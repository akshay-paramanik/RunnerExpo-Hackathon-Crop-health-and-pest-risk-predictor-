import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log('Setting up Cloudinary storage...');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log('Cloudinary storage params called for file:', file.originalname);
    return {
      folder: "pests",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      public_id: `pest_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;