const router = express.Router();
import cloudinary from '../utils/cloudinary.js';
import express from 'express'
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
const upload = uploadMiddleware("images")

router.post("/", upload.single("file"), uploadImage);

export default router;