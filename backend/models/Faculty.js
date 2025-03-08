const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Google Drive URL
}, { timestamps: true });

module.exports = mongoose.model("Faculty", FacultySchema);
