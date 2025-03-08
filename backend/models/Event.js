const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Google Drive URL
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
