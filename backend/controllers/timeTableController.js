const TimeTable = require("../models/TimeTable");
const fs = require("fs");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");

// Create a new timetable entry
exports.createTimeTable = async (req, res) => {
  try {
    const { year, facultyName } = req.body;

    if (!year || !facultyName || !req.file) {
      return res.status(400).json({ message: "Year, faculty name, and media are required" });
    }

    // Upload file to Google Drive
    const mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);

    if (!mediaUrl) {
      return res.status(500).json({ message: "Failed to upload media to Google Drive" });
    }

    const newTimeTable = new TimeTable({ year, facultyName, media: mediaUrl });
    await newTimeTable.save();

    res.status(201).json({ message: "TimeTable created successfully", timeTable: newTimeTable });
  } catch (error) {
    console.error("❌ Creation Error:", error);
    res.status(500).json({ message: "Error creating timetable", error: error.message });
  } finally {
    // Remove the file from the server after uploading to Google Drive
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    }
  }
};

// Get all timetable entries
exports.getTimeTables = async (req, res) => {
  try {
    const timeTables = await TimeTable.find();
    res.status(200).json(timeTables);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching timetables", error });
  }
};

// Update timetable
exports.updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, facultyName } = req.body;

    // Find existing timetable
    const timeTable = await TimeTable.findById(id);
    if (!timeTable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Handle media update if new file is provided
    let mediaUrl = timeTable.media;
    if (req.file) {
      // Delete old media from Google Drive
      const oldFileId = timeTable.media.split('/d/')[1]?.split('/')[0];
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

    // Update timetable
    const updatedTimeTable = await TimeTable.findByIdAndUpdate(
      id,
      {
        year: year || timeTable.year,
        facultyName: facultyName || timeTable.facultyName,
        media: mediaUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Timetable updated successfully",
      timeTable: updatedTimeTable
    });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({
      message: "Error updating timetable",
      error: error.message
    });
  }
};

// Delete timetable
exports.deleteTimeTable = async (req, res) => {
  try {
    const { id } = req.params;

    // Find timetable to get media URL before deletion
    const timeTable = await TimeTable.findById(id);
    if (!timeTable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Delete media from Google Drive
    const fileId = timeTable.media.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    // Delete timetable from database
    await TimeTable.findByIdAndDelete(id);

    res.status(200).json({
      message: "Timetable deleted successfully",
      deletedTimeTable: timeTable
    });

  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({
      message: "Error deleting timetable",
      error: error.message
    });
  }
};