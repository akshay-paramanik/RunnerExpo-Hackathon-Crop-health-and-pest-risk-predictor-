import mongoose from "mongoose";

const schema = new mongoose.Schema({
    ndvi: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("NDVIData", schema);