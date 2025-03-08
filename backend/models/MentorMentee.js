const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  }
});

const mentorMenteeSchema = new mongoose.Schema({
  mentorName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
  },
  academicYear: {
    type: String,
    required: true
  },
  mentees: [menteeSchema],
  mediaUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MentorMentee', mentorMenteeSchema);