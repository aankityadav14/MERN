const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    facultyName: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    }
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;