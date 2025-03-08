const Notice = require("../models/Notice");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Create Notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content, issuedBy } = req.body;
    
    // Handle file upload if present
    let fileUrl = null;
    let fileName = null;
    
    if (req.file) {
      fileUrl = await uploadToGoogleDrive(req.file.path, req.file.originalname);
      fileName = req.file.originalname;
      
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    }

    const newNotice = new Notice({ 
      title, 
      content, 
      issuedBy,
      fileUrl,
      fileName
    });

    await newNotice.save();
    res.status(201).json({ 
      message: "Notice created successfully", 
      notice: newNotice 
    });
  } catch (error) {
    console.error("❌ Error creating notice:", error);
    res.status(500).json({ message: "Error creating notice", error: error.message });
  }
};

// Get All Notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices", error });
  }
};

// Update Notice
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, issuedBy } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Handle file update if new file is provided
    let fileUrl = notice.fileUrl;
    let fileName = notice.fileName;

    if (req.file) {
      // Delete old file if exists
      if (notice.fileUrl) {
        const oldFileId = notice.fileUrl.split('/d/')[1]?.split('/')[0];
        if (oldFileId) {
          await deleteFromGoogleDrive(oldFileId);
        }
      }

      // Upload new file
      fileUrl = await uploadToGoogleDrive(req.file.path, req.file.originalname);
      fileName = req.file.originalname;

      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      {
        title: title || notice.title,
        content: content || notice.content,
        issuedBy: issuedBy || notice.issuedBy,
        fileUrl,
        fileName
      },
      { new: true }
    );

    res.status(200).json({
      message: "Notice updated successfully",
      notice: updatedNotice
    });

  } catch (error) {
    console.error("❌ Error updating notice:", error);
    res.status(500).json({
      message: "Error updating notice",
      error: error.message
    });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Delete file from Google Drive if exists
    if (notice.fileUrl) {
      const fileId = notice.fileUrl.split('/d/')[1]?.split('/')[0];
      if (fileId) {
        await deleteFromGoogleDrive(fileId);
      }
    }

    await Notice.findByIdAndDelete(id);

    res.status(200).json({
      message: "Notice deleted successfully",
      deletedNotice: notice
    });

  } catch (error) {
    console.error("❌ Error deleting notice:", error);
    res.status(500).json({
      message: "Error deleting notice",
      error: error.message
    });
  }
};
