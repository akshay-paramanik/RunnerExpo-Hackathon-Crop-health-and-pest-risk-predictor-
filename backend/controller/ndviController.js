import NDVIData from "../models/ndviSchema.js";
import locationSchema from "../models/locationSchema.js";
import axios from "axios";

// 🔥 Add NDVI data (from Python or API)
export const addNDVI = async (req, res) => {
  try {

    const location = await locationSchema.findOne().sort({ createdAt: -1 });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const ndvi = await axios.post('https://unprevalent-jettie-unseductive.ngrok-free.dev/predict/ndvi', {
      lat: location.lat,
      lon: location.lon
    });

    const data = await NDVIData.create({ ndvi });

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