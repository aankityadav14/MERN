const Alumni = require("../models/Alumni");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Create Alumni
exports.createAlumni = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    console.log("Received file:", req.file);

    const { name, graduationYear, department, email, phone, linkedin } = req.body;

    // Validate required fields
    if (!name || !graduationYear || !department || !email || !phone || !linkedin || !req.file) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: "name, graduationYear, department, email, phone, linkedin, image"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate graduation year
    const currentYear = new Date().getFullYear();
    if (isNaN(graduationYear) || graduationYear < 1900 || graduationYear > currentYear + 5) {
      return res.status(400).json({ message: "Invalid graduation year" });
    }

    // Upload image to Google Drive
    const imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);

    // Create new alumni
    const alumni = new Alumni({
      name,
      graduationYear,
      department,
      email,
      phone,
      linkedin,
      imageUrl
    });

    await alumni.save();

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error removing temporary file:", err);
    });

    res.status(201).json({
      message: "Alumni added successfully",
      alumni
    });

  } catch (error) {
    console.error("❌ Error creating alumni:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: "A user with this email is already registered"
      });
    }
    res.status(500).json({ 
      message: "Error creating alumni", 
      error: error.message 
    });
  }
};

// Get All Alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });
    res.status(200).json(alumni);
  } catch (error) {
    console.error("❌ Error fetching alumni:", error);
    res.status(500).json({ 
      message: "Error fetching alumni", 
      error: error.message 
    });
  }
};

// Update Alumni
exports.updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, graduationYear, department, email, phone, linkedin } = req.body;

    // Find existing alumni
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Validate email if it's being updated
    if (email && email !== alumni.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    // Validate graduation year if it's being updated
    if (graduationYear) {
      const currentYear = new Date().getFullYear();
      if (isNaN(graduationYear) || graduationYear < 1900 || graduationYear > currentYear + 5) {
        return res.status(400).json({ message: "Invalid graduation year" });
      }
    }

    // Handle image update if new file is provided
    let imageUrl = alumni.imageUrl;
    if (req.file) {
      // Extract file ID from old imageUrl and delete from Google Drive
      const oldFileId = alumni.imageUrl.split('/d/')[1]?.split('/')[0];
      if (oldFileId) {
        await deleteFromGoogleDrive(oldFileId);
      }
      // Upload new image
      imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
      // Cleanup: Remove uploaded file after processing
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    }

    // Update alumni details
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      id,
      {
        name: name || alumni.name,
        graduationYear: graduationYear || alumni.graduationYear,
        department: department || alumni.department,
        email: email || alumni.email,
        phone: phone || alumni.phone,
        linkedin: linkedin || alumni.linkedin,
        imageUrl: imageUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Alumni updated successfully",
      alumni: updatedAlumni
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: "A user with this email is already registered"
      });
    }
    console.error("❌ Error updating alumni:", error);
    res.status(500).json({
      message: "Error updating alumni",
      error: error.message
    });
  }
};

// Delete Alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Find alumni to get image URL before deletion
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Delete image from Google Drive
    const fileId = alumni.imageUrl.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    // Delete alumni from database
    await Alumni.findByIdAndDelete(id);

    res.status(200).json({
      message: "Alumni deleted successfully",
      deletedAlumni: alumni
    });
  } catch (error) {
    console.error("❌ Error deleting alumni:", error);
    res.status(500).json({
      message: "Error deleting alumni",
      error: error.message
    });
  }
};