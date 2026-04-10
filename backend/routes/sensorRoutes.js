import express from "express";
import { addSensorData, getSensorData } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/", addSensorData); // ESP32 sends data
router.get("/", getSensorData);  // frontend fetch

export default router;