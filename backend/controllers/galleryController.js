const Gallery = require("../models/galleryModel");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Upload media (image/video)
exports.uploadMedia = async (req, res) => {
  try {
    console.log("📩 Received Request Body:", req.body);
    console.log("📂 Received File:", req.file); // Debugging file upload

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    // ✅ Upload to Google Drive
    const mediaUrl = await uploadToGoogleDrive(
      req.file.path,
      req.file.filename
    );

    if (!mediaUrl) {
      return res
        .status(500)
        .json({ message: "Failed to upload media to Google Drive" });
    }

    // ✅ Save to MongoDB
    const newMedia = new Gallery({ title, mediaUrl, type });
    await newMedia.save();

    res
      .status(201)
      .json({ message: "Media uploaded successfully", media: newMedia });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res
      .status(500)
      .json({ message: "Error uploading media", error: error.message });
  }
};

// Get all gallery media
exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.status(200).json(gallery);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching gallery", error });
  }
};

// Update media
exports.updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type } = req.body;

    // Find existing media
    const media = await Gallery.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Handle media file update if new file is provided
    let mediaUrl = media.mediaUrl;
    if (req.file) {
      // Delete old media from Google Drive
      const oldFileId = media.mediaUrl.split('/d/')[1]?.split('/')[0];
      if (oldFileId) {
        await deleteFromGoogleDrive(oldFileId);
      }

      // Upload new media
      mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
      
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    }

    // Update media details
    const updatedMedia = await Gallery.findByIdAndUpdate(
      id,
      {
        title: title || media.title,
        type: type || media.type,
        mediaUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Media updated successfully",
      media: updatedMedia
    });

  } catch (error) {
    console.error("❌ Error updating media:", error);
    res.status(500).json({
      message: "Error updating media",
      error: error.message
    });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Find media to get URL before deletion
    const media = await Gallery.findById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete media from Google Drive
    const fileId = media.mediaUrl.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    // Delete media from database
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      message: "Media deleted successfully",
      deletedMedia: media
    });

  } catch (error) {
    console.error("❌ Error deleting media:", error);
    res.status(500).json({
      message: "Error deleting media",
      error: error.message
    });
  }
};
