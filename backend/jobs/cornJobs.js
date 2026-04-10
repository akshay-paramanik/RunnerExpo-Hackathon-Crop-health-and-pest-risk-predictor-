import cron from "node-cron";
import LSTMInput from "../models/lastmInputSchema.js";
import { get24SetData } from "../services/get24setData.js";
import { makeDecision } from "../services/makeDecision.js";
import axios from 'axios';
import decisionModel from '../models/decisionModel.js'

export const startCronJobs = () => {

  // every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    try {
      console.log("Running LSTM job...");

      const data = await get24SetData();

      await LSTMInput.create({ data });
      
      const lstmResponse = await axios.post('https://unprevalent-jettie-unseductive.ngrok-free.dev/predict/lstm',{data});
    const {predicted_ndvi} = lstmResponse;
    
    const decision = makeDecision(predicted_ndvi);
    await decisionModel.create(decision)


      console.log("24-set saved successfully");

    } catch (err) {
      console.error("Cron Error:", err.message);
    }
  });

};