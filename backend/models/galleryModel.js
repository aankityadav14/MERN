const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mediaUrl: { type: String, required: true }, // Google Drive URL
    type: { type: String, enum: ["image", "video"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
