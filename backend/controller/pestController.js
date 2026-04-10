
import axios from "axios";
import PestData from "../models/pestSchema.js";

export const addPest = async (req, res) => {
  try {
    // ✅ Get uploaded image URL
    const pestImageURL = req.file?.path;

    if (!pestImageURL) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    // 1️⃣ Call CNN API
    const response = await axios.post(
      "https://unprevalent-jettie-unseductive.ngrok-free.dev/predict/cnn",
      {
        image_url: pestImageURL
      }
    );

    const { confidence, prediction } = response.data;

    // 2️⃣ Extract structured data
    const pestName = prediction?.name || "Unknown";
    const cause = prediction?.cause || "Unknown";
    const cure = prediction?.cure || "No suggestion";

    // 3️⃣ Decide pestRisk
    const pestRisk = confidence >= 70;

    // 4️⃣ Save to DB
    const data = await PestData.create({
      pestName,
      cause,
      cure,
      confidence,
      pestRisk,
      pestImageURL
    });

    // 5️⃣ Response
    res.json({
      success: true,
      message: pestRisk ? "Pest detected" : "No major pest risk",
      data
    });

  } catch (error) {
    console.error(error);
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