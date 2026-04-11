import NDVIData from "../models/ndviSchema.js";
import locationSchema from "../models/locationSchema.js";
import axios from "axios";
import { config } from "dotenv";

config();

// 🔥 Add NDVI data (from Python or API)
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

// 🔥 Get latest NDVI data
export const getNDVI = async (req, res) => {
  try {
    const data = await NDVIData.findOne()
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};