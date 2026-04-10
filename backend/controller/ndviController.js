import NDVIData from "../models/ndviSchema.js";

// 🔥 Add NDVI data (from Python or API)
export const addNDVI = async (req, res) => {
  try {
    const { ndvi } = req.body;

    const data = await NDVIData.create({ ndvi });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get latest NDVI data
export const getNDVI = async (req, res) => {
  try {
    const data = await NDVIData.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};