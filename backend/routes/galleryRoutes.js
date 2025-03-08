const express = require("express");
const { 
  uploadMedia, 
  getGallery, 
  updateMedia, 
  deleteMedia 
} = require("../controllers/galleryController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// ✅ Correct Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files are stored in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file
  },
});

// ✅ Ensure the field name is "media"
const upload = multer({
  storage: storage,
});

router.post("/", upload.single("media"), uploadMedia); // Upload media
router.get("/", getGallery); // Get all media
router.put("/:id", upload.single("media"), updateMedia); // Update media
router.delete("/:id", deleteMedia); // Delete media

module.exports = router;
