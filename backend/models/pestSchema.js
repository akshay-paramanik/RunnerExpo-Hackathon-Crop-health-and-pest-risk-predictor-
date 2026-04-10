import mongoose from "mongoose";

const schema = new mongoose.Schema({
    pestName: String,
    confidence: Number,
    pestRisk: Boolean,
    pestImageURL: String,
    action: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("SensorData", schema);