import mongoose from "mongoose";

const schema = new mongoose.Schema({
  predicted_ndvi: Number,

  pestRisk: Boolean,

  soilMoisture: Number,
  temperature: Number,
  humidity: Number,
  rainfall: Number,

  decision: {
    cropStatus: String,
    pestStatus: String,
    irrigation: String
  },

  actions: [String]

}, { timestamps: true });

export default mongoose.model("Decision", schema);