import PestData from "../models/PestData.js";

// 🔥 Add pest detection result
export const addPest = async (req, res) => {
  try {
    const { pestName, confidence, pestRisk, pestImageURL, action } = req.body;

    const data = await PestData.create({
      pestName,
      confidence,
      pestRisk,
      pestImageURL,
      action
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get latest pest results
export const getPests = async (req, res) => {
  try {
    const data = await PestData.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};