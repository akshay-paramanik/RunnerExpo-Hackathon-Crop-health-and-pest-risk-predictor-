import mongoose from "mongoose";

const schema = new mongoose.Schema({
    predictedValue: Number,
    action: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("LSTMData", schema);