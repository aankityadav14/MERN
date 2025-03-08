const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Alumni", alumniSchema);
