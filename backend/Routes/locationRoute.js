import locationController from "../controller/locationController.js";
import express from "express";

const router = express.Router();

router.post("/", locationController.addLocation);

export default router;