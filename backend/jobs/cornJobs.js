import cron from "node-cron";
import LSTMInput from "../models/lastmInputSchema.js";
import { get24SetData } from "../services/get24setData.js";
import { makeDecision } from "../services/makeDecision.js";
import axios from 'axios';
import decisionModel from '../models/decisionModel.js'
import SensorData from '../models/sensorSchema.js';
import NDVIData from '../models/ndviSchema.js';
import weatherModel from '../models/weatherSchema.js';
import locationSchema from '../models/locationSchema.js';
import { config } from "dotenv";

config();
const AI_BASE_URL = process.env.AI_BASE_URL;

// Fetch and save sensor data
export const fetchAndSaveSensorData = async () => {
  try {
    const response = await axios.get(
      `${AI_BASE_URL}/fetch`
    );
 
    const { soil_moisture, temperature, humidity } = response.data.data;
 
    const data = await SensorData.create({ soilMoisture:soil_moisture, temperature, humidity });
 
    console.log(`[Sensor Cron] Saved at ${new Date().toISOString()}:`, {
      soilMoisture:soil_moisture,
      temperature,
      humidity,
    });
 
    return data;
  } catch (error) {
    console.error("[Sensor Cron] Error:", error.message);
  }
};

// HTTP handler for manual trigger via API
export const addSensorData = async (req, res) => {
  try {
    const data = await fetchAndSaveSensorData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start all cron jobs
export const startCronJobs = () => {
  // Run LSTM analysis every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    try {
      console.log("Running LSTM job...");

      const data = await get24SetData();

      await LSTMInput.create({ data });
      
      const lstmResponse = await axios.post(`${AI_BASE_URL}/predict/lstm`, { data });
      const { predicted_ndvi } = lstmResponse.data;
      
      const decision = makeDecision(predicted_ndvi);
      await decisionModel.create(decision);

      console.log("24-set saved successfully");
    } catch (err) {
      console.error("Cron Error:", err.message);
    }
  });

  // Run NDVI weekly (once every 7 days) - Sunday at midnight
  cron.schedule("0 0 * * 0", async () => {
    try {
      console.log("Running weekly NDVI job...");

      const location = await locationSchema.findOne().sort({ createdAt: -1 });
      if (!location) {
        console.warn("Weekly NDVI job skipped: no location found.");
        return;
      }

      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);

      const ndviResponse = await axios.post(`${AI_BASE_URL}/ndvi`, {
        lat: location.latitude,
        lon: location.longitude,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      });

      const ndviValue = ndviResponse.data?.ndvi;
      if (ndviValue == null) {
        throw new Error('NDVI response missing ndvi value');
      }

      await NDVIData.create({ ndvi: ndviValue });
      console.log("Weekly NDVI job completed successfully.");
    } catch (err) {
      console.error("Weekly NDVI Cron Error:", err.message);
    }
  });

  // Run weather store every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running hourly weather store job...");

      const locationData = await locationSchema.findOne().sort({ createdAt: -1 });
      if (!locationData) {
        console.warn("Hourly weather job skipped: no location found.");
        return;
      }

      const { lat, lon } = locationData;
      const API_KEY = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);

      const daily = response.data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 7);

      const savedData = [];
      for (let item of daily) {
        const rainfall = item.rain?.["3h"] || 0;
        const saved = await weatherModel.create({ rainfall });
        savedData.push(saved);
      }

      console.log(`Hourly weather job saved ${savedData.length} records.`);
    } catch (err) {
      console.error("Hourly Weather Cron Error:", err.message);
    }
  });

  // Run sensor data collection every 6 minutes
  cron.schedule("*/6 * * * *", () => {
    console.log("[Sensor Cron] Running scheduled fetch...");
    fetchAndSaveSensorData();
  });
 
  console.log("[Sensor Cron] Scheduler started — runs every 6 minutes.");
};

export const addNDVI = async (req, res) => {
  try {

    const location = await locationSchema.findOne().sort({ createdAt: -1 });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    console.log(location);
    
    // Calculate dates: today and 1 week ago
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const ndvi = await axios.post(`${AI_BASE_URL}/ndvi`, {
      lat: location.latitude,
      lon: location.longitude,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    const data = await NDVIData.create({ ndvi: ndvi.data.ndvi });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default startCronJobs;