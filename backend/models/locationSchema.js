import mongoose from "mongoose";

const schema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("SensorData", schema);