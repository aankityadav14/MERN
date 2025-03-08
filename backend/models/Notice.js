const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  issuedBy: { type: String, required: true },
  fileUrl: { type: String }, // Optional file attachment
  fileName: { type: String }, // Original file name
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
