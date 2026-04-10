import express from "express";
import { addPest, getPests } from "../controller/pestController.js";
import upload from '../middleware/multer.js'

const router = express.Router();

router.post("/",upload.single('image_url'), addPest);
router.get("/", getPests);

export default router;