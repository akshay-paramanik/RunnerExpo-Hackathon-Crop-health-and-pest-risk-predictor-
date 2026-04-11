import axios from "axios";
import PestData from "../models/pestSchema.js";
import { config } from "dotenv";

config();

const AI_BASE_URL = process.env.AI_BASE_URL;

export const addPest = async (req, res) => {
  try {
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    // ✅ Get uploaded image URL
    const pestImageURL = req.file?.path || req.file?.url || req.file?.secure_url;

    if (!pestImageURL) {
      console.log('No pestImageURL found - Cloudinary upload may have failed');
      console.log('req.file details:', JSON.stringify(req.file, null, 2));
      // Continue with fallback for testing
      const fallbackURL = 'https://via.placeholder.com/300x200?text=Image+Upload+Failed';
      console.log('Using fallback URL for testing:', fallbackURL);
      // For now, let's continue with the fallback to test the rest of the flow
    }

    const finalImageURL = pestImageURL || 'https://via.placeholder.com/300x200?text=Image+Upload+Failed';
    console.log('Final pestImageURL:', finalImageURL);

    // 1️⃣ Call CNN API
    console.log('Calling CNN API with image_url:', finalImageURL);
    const response = await axios.post(
      `${AI_BASE_URL}/predict/cnn`,
      {
        image_url: finalImageURL
      }
    );

    console.log('CNN API response.data:', response.data);

    const { confidence, prediction } = response.data;

    // 2. Extract structured data
    const rawPestName = prediction?.name || "Unknown";
    const pestName = rawPestName.replace(/_\d+(_\d+)*$/, '');
    const cause = prediction?.cause || "Unknown";
    const cure = prediction?.cure || "No suggestion";

    console.log('Extracted:', { pestName, cause, cure, confidence });

    // 3. Pest risk
    const pestRisk = confidence >= 70;

    // 4. Save to DB — ✅ declared outside inner try so res.json can access it
    const data = await PestData.create({
      pestName,
      cause,
      cure,
      confidence,
      pestRisk,
      pestImageURL: finalImageURL
    });

    console.log('Saved to DB:', data);

    // 5. Response
    res.json({
      success: true,
      message: pestRisk ? "Pest detected" : "No major pest risk",
      data,
    });

  } catch (error) {
    console.error('addPest error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get latest pest results
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