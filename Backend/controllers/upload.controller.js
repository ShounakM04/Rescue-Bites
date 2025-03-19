// import cloudinary from "../utils/cloudinary.js";

// export const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, error: "No file uploaded" });
//     }

//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "food_listings",
//     });

//     res.json({
//       success: true,
//       imageUrl: result.secure_url,
//     });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ success: false, error: "Failed to upload image" });
//   }
// };

import FoodDetails from "../models/foodDetails.model.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      // No file was uploaded
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    // File upload successful
    const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary
    
    // Perform any additional logic or save the file URL to a database
    
  
    res.status(200).json({ success: true, fileUrl: fileUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Failed to upload image" });
  }
};
