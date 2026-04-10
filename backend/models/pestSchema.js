import mongoose from "mongoose";

const schema = new mongoose.Schema({
  pestName: String,          // Corn___Common_rust
  cause: String,             // Fungus Puccinia sorghi.
  cure: String,              // Apply fungicides...

  confidence: Number,
  pestRisk: Boolean,

  pestImageURL: String,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PestData", schema);