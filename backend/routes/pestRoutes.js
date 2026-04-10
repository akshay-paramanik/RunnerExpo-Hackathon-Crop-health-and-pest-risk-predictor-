import express from "express";
import { addPest, getPests } from "../controllers/pestController.js";

const router = express.Router();

router.post("/", addPest);
router.get("/", getPests);

export default router;