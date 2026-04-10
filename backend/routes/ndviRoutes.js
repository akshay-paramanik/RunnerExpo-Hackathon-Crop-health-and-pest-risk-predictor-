import express from "express";
import { addNDVI, getNDVI } from "../controller/ndviController.js";

const router = express.Router();

router.post("/", addNDVI);   // add NDVI value
router.get("/", getNDVI);    // fetch NDVI history

export default router;