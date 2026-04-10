import mongoose from "mongoose";

const schema = new mongoose.Schema({
    soilMoisture: Number,
    temperature: Number,
    humidity: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("SensorData", schema);