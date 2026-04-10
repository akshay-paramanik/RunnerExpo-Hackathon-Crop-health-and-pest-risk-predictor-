import express from "express";
import weatherController from "../controller/weatherController.js";

const router = express.Router();

router.get("/", weatherController.getWeather);
router.post("/store", weatherController.storeWeather);

export default router;