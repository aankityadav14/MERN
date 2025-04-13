const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  studentName: { 
    type: String, 
    required: true 
  },
  achievementTitle: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Academic', 'Competition', 'Hackathon', 'Internship', 'Placement', 'Other'],
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  proofUrl: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model("Achievement", AchievementSchema);