const express = require("express");
const multer = require("multer");
const { 
  createTimeTable, 
  getTimeTables,
  updateTimeTable,
  deleteTimeTable 
} = require("../controllers/timeTableController");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files are stored in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file
  },
});

// Initialize Multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Route to create a new timetable entry with file upload
router.post("/", upload.single("media"), createTimeTable); // Create a new timetable entry
router.get("/", getTimeTables); // Get all timetable entries
router.put("/:id", upload.single("media"), updateTimeTable);
router.delete("/:id", deleteTimeTable);

module.exports = router;