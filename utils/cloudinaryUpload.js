import cloudinary from "../config/cloudinary.js";

export const uploadStudentPhoto = async (base64Image) => {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: "students",
    resource_type: "image"
  });

  return result.secure_url;
};
