import express from "express";
import multer from "multer";
import { addPest, getPests } from "../controller/pestController.js";
import upload from '../middleware/multer.js'

const router = express.Router();

// Add error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
    }
  }
  next(error);
};

router.post("/", upload.single('pestImage'), handleMulterError, addPest);
router.get("/", getPests);

export default router;