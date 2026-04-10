import mongoose from "mongoose";

const schema = new mongoose.Schema({
  rainfall: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("WeatherData", schema);