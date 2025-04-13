const Achievement = require("../models/Achievement");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Create Achievement
exports.createAchievement = async (req, res) => {
  try {
    const { studentName, achievementTitle, description, category, year } = req.body;

    let imageUrl = "";
    let proofUrl = "";

    // Handle image upload
    if (req.files && req.files.image) {
      imageUrl = await uploadToGoogleDrive(req.files.image[0].path, req.files.image[0].filename);
      fs.unlink(req.files.image[0].path, err => {
        if (err) console.error("Error removing temporary image:", err);
      });
    }

    // Handle proof document upload
    if (req.files && req.files.proof) {
      proofUrl = await uploadToGoogleDrive(req.files.proof[0].path, req.files.proof[0].filename);
      fs.unlink(req.files.proof[0].path, err => {
        if (err) console.error("Error removing temporary proof:", err);
      });
    }

    const newAchievement = new Achievement({
      studentName,
      achievementTitle,
      description,
      category,
      year,
      imageUrl,
      proofUrl
    });

    await newAchievement.save();

    res.status(201).json({
      message: "Achievement added successfully",
      achievement: newAchievement
    });
  } catch (error) {
    console.error("❌ Error creating achievement:", error);
    res.status(500).json({
      message: "Error creating achievement",
      error: error.message
    });
  }
};

// Get All Achievements
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ year: -1, createdAt: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching achievements",
      error: error.message
    });
  }
};

// Update Achievement
exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, achievementTitle, description, category, year } = req.body;

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    let imageUrl = achievement.imageUrl;
    let proofUrl = achievement.proofUrl;

    // Handle image update
    if (req.files && req.files.image) {
      if (achievement.imageUrl) {
        const oldImageId = achievement.imageUrl.split('/d/')[1]?.split('/')[0];
        if (oldImageId) await deleteFromGoogleDrive(oldImageId);
      }
      imageUrl = await uploadToGoogleDrive(req.files.image[0].path, req.files.image[0].filename);
      fs.unlink(req.files.image[0].path, err => {
        if (err) console.error("Error removing temporary image:", err);
      });
    }

    // Handle proof update
    if (req.files && req.files.proof) {
      if (achievement.proofUrl) {
        const oldProofId = achievement.proofUrl.split('/d/')[1]?.split('/')[0];
        if (oldProofId) await deleteFromGoogleDrive(oldProofId);
      }
      proofUrl = await uploadToGoogleDrive(req.files.proof[0].path, req.files.proof[0].filename);
      fs.unlink(req.files.proof[0].path, err => {
        if (err) console.error("Error removing temporary proof:", err);
      });
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      {
        studentName,
        achievementTitle,
        description,
        category,
        year,
        imageUrl,
        proofUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Achievement updated successfully",
      achievement: updatedAchievement
    });
  } catch (error) {
    console.error("❌ Error updating achievement:", error);
    res.status(500).json({
      message: "Error updating achievement",
      error: error.message
    });
  }
};

// Delete Achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Delete image from Google Drive
    if (achievement.imageUrl) {
      const imageId = achievement.imageUrl.split('/d/')[1]?.split('/')[0];
      if (imageId) await deleteFromGoogleDrive(imageId);
    }

    // Delete proof from Google Drive
    if (achievement.proofUrl) {
      const proofId = achievement.proofUrl.split('/d/')[1]?.split('/')[0];
      if (proofId) await deleteFromGoogleDrive(proofId);
    }

    await Achievement.findByIdAndDelete(id);

    res.status(200).json({
      message: "Achievement deleted successfully",
      deletedAchievement: achievement
    });
  } catch (error) {
    console.error("❌ Error deleting achievement:", error);
    res.status(500).json({
      message: "Error deleting achievement",
      error: error.message
    });
  }
};