import SensorData from "../models/sensorSchema.js";
import axios from "axios";
import { config } from "dotenv";

config();
const AI_BASE_URL = process.env.AI_BASE_URL;

// 🔥 Add sensor data (ESP32 will hit this)
export const addSensorData = async (req, res) => {
  try {
    const response = await axios.get(`${AI_BASE_URL}/fetch`);
    
    const { soil_moisture, temperature, humidity } = response.data.data;
    const data = await SensorData.create({
      soilMoisture: soil_moisture,
      temperature: temperature,
      humidity: humidity,
    });

    res.json(data);
    console.log(soilMoisture,temperature,humidity);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get latest sensor data
export const getSensorData = async (req, res) => {
  try {
    const data = await SensorData.findOne()
      .sort({ timestamp: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

