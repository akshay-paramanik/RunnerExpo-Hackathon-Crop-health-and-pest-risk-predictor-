import { get24SetData } from "../services/get24setData.js";
import axios from "axios";
import { makeDecision } from "../services/makeDecision.js";
import decisionModel from "../models/decisionModel.js";

const lstmAnalysisController = {
  analyzeLSTM: async (req, res) => {
    try {
      const latestLstmData = await get24SetData();

      if (!latestLstmData) {
        return res.status(404).json({ error: "lstm data not found" });
      }

      // ✅ FIX: correct variable name
      const lstmResponse = await axios.post(
        "https://unprevalent-jettie-unseductive.ngrok-free.dev/predict/lstm",
        { lstmData: latestLstmData }
      );

      // ✅ FIX: correct response access
      const { predicted_ndvi } = lstmResponse.data;

      // ✅ FIX: await + correct name
      const decision = await makeDecision(predicted_ndvi);

      // ❌ you already save inside makeDecision → no need again
      // await decisionModel.create(decision);

      return res.status(200).json({
        msg: "Analysis completed",
        decision,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "LSTM analysis failed" });
    }
  },

  getAnalysis: async (req, res) => {
    try {
      const analysedData = await decisionModel
        .findOne()
        .sort({ createdAt: -1 });

      return res.status(200).json({
        msg: "success",
        analysedData,
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  },
};

export default lstmAnalysisController;