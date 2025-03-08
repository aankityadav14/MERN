const Academic = require("../models/Academic");
const fs = require("fs");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");

// Create new academic entry
exports.createAcademic = async (req, res) => {
  try {
    const { title, subject, type, year, semester } = req.body;

    if (!title || !subject || !type || !year || !semester || !req.file) {
      return res.status(400).json({ 
        message: "All fields and file are required",
        required: "title, subject, type (syllabus/notes), year, semester, and file"
      });
    }

    // Validate type
    if (!['syllabus', 'notes'].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'syllabus' or 'notes'" });
    }

    // Validate year
    const validYears = ['First Year', 'Second Year', 'Third Year', 'MSc Part 1', 'MSc Part 2'];
    if (!validYears.includes(year)) {
      return res.status(400).json({ message: "Invalid year selection" });
    }

    // Validate semester
    const validSemesters = ['Semester 1', 'Semester 2'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({ message: "Invalid semester selection" });
    }

    // Upload file to Google Drive
    const mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);

    if (!mediaUrl) {
      return res.status(500).json({ message: "Failed to upload file to Google Drive" });
    }

    const newAcademic = new Academic({
      title,
      subject,
      type,
      year,
      semester,
      mediaUrl
    });

    await newAcademic.save();

    res.status(201).json({
      message: "Academic content uploaded successfully",
      academic: newAcademic
    });

  } catch (error) {
    console.error("❌ Creation Error:", error);
    res.status(500).json({ message: "Error creating academic entry", error: error.message });
  } finally {
    // Cleanup: Remove the temporary file
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    }
  }
};

// Get all academic entries
exports.getAcademics = async (req, res) => {
  try {
    const academics = await Academic.find();
    res.status(200).json(academics);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching academic content", error });
  }
};

// Get academic entries by type
exports.getAcademicsByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['syllabus', 'notes'].includes(type)) {
      return res.status(400).json({ message: "Invalid type parameter" });
    }
    
    const academics = await Academic.find({ type });
    res.status(200).json(academics);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching academic content", error });
  }
};

// Get academics by year
exports.getAcademicsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const validYears = ['First Year', 'Second Year', 'Third Year', 'MSc Part 1', 'MSc Part 2'];
    
    if (!validYears.includes(year)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }
    
    const academics = await Academic.find({ year });
    res.status(200).json(academics);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching academic content", error });
  }
};

// Delete academic entry
exports.deleteAcademic = async (req, res) => {
  try {
    const { id } = req.params;

    const academic = await Academic.findById(id);
    if (!academic) {
      return res.status(404).json({ message: "Academic resource not found" });
    }

    // Extract file ID from Google Drive URL
    const fileId = academic.mediaUrl.split('/d/')[1]?.split('/')[0];
    if (!fileId) {
      return res.status(400).json({ message: "Invalid Google Drive URL format" });
    }

    // Delete from Google Drive
    await deleteFromGoogleDrive(fileId);

    // Delete from database
    await Academic.findByIdAndDelete(id);

    res.status(200).json({ 
      message: "Academic resource deleted successfully",
      deletedResource: academic
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ 
      message: "Error deleting academic resource", 
      error: error.message 
    });
  }
};

// Update academic entry
exports.updateAcademic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, type, year, semester } = req.body;

    // Validate type if provided
    if (type && !['syllabus', 'notes'].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'syllabus' or 'notes'" });
    }

    // Validate year if provided
    const validYears = ['First Year', 'Second Year', 'Third Year', 'MSc Part 1', 'MSc Part 2'];
    if (year && !validYears.includes(year)) {
      return res.status(400).json({ message: "Invalid year selection" });
    }

    // Validate semester if provided
    const validSemesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'semester 5', 'semester 6', 'part 1', 'part 2'];
    if (semester && !validSemesters.includes(semester)) {
      return res.status(400).json({ message: "Invalid semester selection" });
    }

    let updateData = { title, subject, type, year, semester };
    
    // Handle file update if new file is provided
    if (req.file) {
      // Find the old entry to get the mediaUrl
      const oldAcademic = await Academic.findById(id);
      if (oldAcademic) {
        // Delete old file from Google Drive
        const oldFileId = oldAcademic.mediaUrl.split('/').pop();
        await deleteFromGoogleDrive(oldFileId);
      }

      // Upload new file
      const mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
      if (!mediaUrl) {
        return res.status(500).json({ message: "Failed to upload new file to Google Drive" });
      }
      updateData.mediaUrl = mediaUrl;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedAcademic = await Academic.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAcademic) {
      return res.status(404).json({ message: "Academic resource not found" });
    }

    res.status(200).json({
      message: "Academic resource updated successfully",
      academic: updatedAcademic
    });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ 
      message: "Error updating academic resource", 
      error: error.message 
    });
  } finally {
    // Cleanup: Remove the temporary file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    }
  }
};