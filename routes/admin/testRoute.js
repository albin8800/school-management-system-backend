import express from "express";
import { uploadStudentPhoto } from '../../utils/cloudinaryUpload.js'

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const imageUrl = await uploadStudentPhoto(image);

    return res.status(200).json({
      message: "Upload successful",
      url: imageUrl
    });
  } catch (error) {
    console.error("Cloudinary Test Upload Error:", error);
    return res.status(500).json({
      message: "Upload failed"
    });
  }
});

export default router;
