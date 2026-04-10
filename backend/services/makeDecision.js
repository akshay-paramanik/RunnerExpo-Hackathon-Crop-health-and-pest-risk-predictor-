import PestData from "../models/pestSchema.js";
import NDVIData from "../models/ndviSchema.js";
import SensorData from "../models/sensorSchema.js";
import WeatherData from "../models/weatherSchema.js";
import Decision from "../models/decisionModel.js";

export const makeDecision = async (predicted_ndvi) => {
  try {
    // 📥 Fetch latest data
    const lastPest = await PestData.findOne().sort({ timestamp: -1 });
    const sensor = await SensorData.findOne().sort({ timestamp: -1 });
    const weather = await WeatherData.findOne().sort({ timestamp: -1 });

    const pestRisk = lastPest?.pestRisk || false;
    const soil = sensor?.soilMoisture || 0;
    const temp = sensor?.temperature || 0;
    const humidity = sensor?.humidity || 0;
    const rainfall = weather?.rainfall || 0;

    // 🎯 Decision variables
    let cropStatus = "";
    let pestStatus = "";
    let irrigation = "";
    let actions = [];

    // 🌱 Crop Health (NDVI)
    if (predicted_ndvi > 0.7) {
      cropStatus = "Healthy";
    } else if (predicted_ndvi > 0.4) {
      cropStatus = "Moderate";
      actions.push("Monitor crop condition");
    } else {
      cropStatus = "Poor";
      actions.push("Apply fertilizer / check soil health");
    }

    // 🐛 Pest Decision
    if (pestRisk) {
      pestStatus = "High Risk";
      actions.push(lastPest?.action || "Apply pesticide");
    } else {
      pestStatus = "Low Risk";
    }

    // 💧 Irrigation Decision
    if (soil < 300) {
      if (rainfall > 0) {
        irrigation = "Skip (Rain Expected)";
      } else {
        irrigation = "Required";
        actions.push("Start irrigation");
      }
    } else {
      irrigation = "Not Needed";
    }

    // 💾 Save decision
    const saved = await Decision.create({
      predicted_ndvi,
      pestRisk,
      soilMoisture: soil,
      temperature: temp,
      humidity,
      rainfall,
      decision: {
        cropStatus,
        pestStatus,
        irrigation
      },
      actions
    });

    return saved;

  } catch (err) {
    console.error(err);
    throw err;
  }
};