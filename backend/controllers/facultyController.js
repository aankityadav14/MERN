const Faculty = require("../models/Faculty");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Create Faculty
exports.createFaculty = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    console.log("Received file:", req.file);

    const { name, designation, department, email, phone } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);

    // Save faculty details to the database
    const newFaculty = new Faculty({
      name,
      designation,
      department,
      email,
      phone,
      imageUrl,
    });

    await newFaculty.save();

    res.status(201).json({ message: "Faculty added successfully", faculty: newFaculty });
  } catch (error) {
    console.error("❌ Error creating faculty:", error);
    res.status(500).json({ message: "Error creating faculty", error: error.message });
  }
};

// Get All Faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, email, phone } = req.body;

    // Find existing faculty
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Handle image update if new file is provided
    let imageUrl = faculty.imageUrl;
    if (req.file) {
      // Delete old image from Google Drive
      const oldFileId = faculty.imageUrl.split('/d/')[1]?.split('/')[0];
      if (oldFileId) {
        await deleteFromGoogleDrive(oldFileId);
      }

      // Upload new image
      imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
      
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    }

    // Update faculty
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      {
        name: name || faculty.name,
        designation: designation || faculty.designation,
        department: department || faculty.department,
        email: email || faculty.email,
        phone: phone || faculty.phone,
        imageUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Faculty updated successfully",
      faculty: updatedFaculty
    });

  } catch (error) {
    console.error("❌ Error updating faculty:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: "A faculty member with this email is already registered"
      });
    }
    res.status(500).json({
      message: "Error updating faculty",
      error: error.message
    });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    // Find faculty to get image URL before deletion
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Delete image from Google Drive
    const fileId = faculty.imageUrl.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    // Delete faculty from database
    await Faculty.findByIdAndDelete(id);

    res.status(200).json({
      message: "Faculty deleted successfully",
      deletedFaculty: faculty
    });

  } catch (error) {
    console.error("❌ Error deleting faculty:", error);
    res.status(500).json({
      message: "Error deleting faculty",
      error: error.message
    });
  }
};
