import mongoose from "mongoose";

const lstmSchema = new mongoose.Schema({
  data: {
    type: [[Number]], // 24 x 6 array
    required: true
  }
}, { timestamps: true });

export default mongoose.model("LSTMInput", lstmSchema);