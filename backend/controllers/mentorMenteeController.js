const MentorMentee = require('../models/MentorMentee');
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require('../config/googleDrive');
const fs = require('fs');

// Create Mentor-Mentee
exports.createMentorMentee = async (req, res) => {
  try {
    const { mentorName, department, semester, academicYear, mentees } = req.body;

    if (!mentorName || !department || !semester || !academicYear || !req.file) {
      return res.status(400).json({
        message: 'Required fields missing',
        required: 'mentorName, department, semester, academicYear, and media file'
      });
    }

    // Parse mentees array if provided as string
    let parsedMentees = [];
    if (mentees) {
      try {
        parsedMentees = typeof mentees === 'string' ? JSON.parse(mentees) : mentees;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid mentees data format' });
      }
    }

    // Upload file to Google Drive
    const mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
    if (!mediaUrl) {
      return res.status(500).json({ message: 'Failed to upload media file' });
    }

    const newMentorMentee = new MentorMentee({
      mentorName,
      department,
      semester,
      academicYear,
      mentees: parsedMentees,
      mediaUrl
    });

    await newMentorMentee.save();

    res.status(201).json({
      message: 'Mentor-Mentee record created successfully',
      mentorMentee: newMentorMentee
    });

  } catch (error) {
    console.error('❌ Creation Error:', error);
    res.status(500).json({ message: 'Error creating mentor-mentee record', error: error.message });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, err => {
        if (err) console.error('Failed to delete local file:', err);
      });
    }
  }
};

// Get All Mentor-Mentees
exports.getAllMentorMentees = async (req, res) => {
  try {
    const mentorMentees = await MentorMentee.find().sort({ createdAt: -1 });
    res.status(200).json(mentorMentees);
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching mentor-mentee records', error: error.message });
  }
};

// Get Mentor-Mentee by ID
exports.getMentorMenteeById = async (req, res) => {
  try {
    const mentorMentee = await MentorMentee.findById(req.params.id);
    if (!mentorMentee) {
      return res.status(404).json({ message: 'Mentor-Mentee record not found' });
    }
    res.status(200).json(mentorMentee);
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching mentor-mentee record', error: error.message });
  }
};

// Update Mentor-Mentee
exports.updateMentorMentee = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorName, department, semester, academicYear, mentees } = req.body;

    const mentorMentee = await MentorMentee.findById(id);
    if (!mentorMentee) {
      return res.status(404).json({ message: 'Mentor-Mentee record not found' });
    }

    // Parse mentees if provided
    let parsedMentees = mentorMentee.mentees;
    if (mentees) {
      try {
        parsedMentees = typeof mentees === 'string' ? JSON.parse(mentees) : mentees;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid mentees data format' });
      }
    }

    // Handle media update
    let mediaUrl = mentorMentee.mediaUrl;
    if (req.file) {
      // Delete old file
      const oldFileId = mentorMentee.mediaUrl.split('/d/')[1]?.split('/')[0];
      if (oldFileId) {
        await deleteFromGoogleDrive(oldFileId);
      }
      // Upload new file
      mediaUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
    }

    const updatedMentorMentee = await MentorMentee.findByIdAndUpdate(
      id,
      {
        mentorName: mentorName || mentorMentee.mentorName,
        department: department || mentorMentee.department,
        semester: semester || mentorMentee.semester,
        academicYear: academicYear || mentorMentee.academicYear,
        mentees: parsedMentees,
        mediaUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Mentor-Mentee record updated successfully',
      mentorMentee: updatedMentorMentee
    });

  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({ message: 'Error updating mentor-mentee record', error: error.message });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, err => {
        if (err) console.error('Failed to delete local file:', err);
      });
    }
  }
};

// Delete Mentor-Mentee
exports.deleteMentorMentee = async (req, res) => {
  try {
    const { id } = req.params;

    const mentorMentee = await MentorMentee.findById(id);
    if (!mentorMentee) {
      return res.status(404).json({ message: 'Mentor-Mentee record not found' });
    }

    // Delete file from Google Drive
    const fileId = mentorMentee.mediaUrl.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    await MentorMentee.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Mentor-Mentee record deleted successfully',
      deletedRecord: mentorMentee
    });

  } catch (error) {
    console.error('❌ Delete Error:', error);
    res.status(500).json({ message: 'Error deleting mentor-mentee record', error: error.message });
  }
};