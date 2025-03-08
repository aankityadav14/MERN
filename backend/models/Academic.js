const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['syllabus', 'notes'],
        required: true
    },
    year: {
        type: String,
        enum: ['First Year', 'Second Year', 'Third Year', 'MSc Part 1', 'MSc Part 2'],
        required: true
    },
    semester: {
        type: String,
        enum: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4','semester 5','semester 6','part 1','part 2'],
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Academic', academicSchema);