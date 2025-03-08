const express = require("express");
const multer = require("multer");
const { 
  createAcademic, 
  getAcademics, 
  getAcademicsByType,
  getAcademicsByYear,
  deleteAcademic,
  updateAcademic 
} = require("../controllers/academicController");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize Multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || 
        file.mimetype === "application/msword" || 
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only PDF and DOC/DOCX files are allowed!'));
    }
  }
});

// Routes without authentication
router.post("/", upload.single("file"), createAcademic);
router.get("/", getAcademics);
router.get("/type/:type", getAcademicsByType);
router.get("/year/:year", getAcademicsByYear);
router.delete("/:id", deleteAcademic);
router.put("/:id", upload.single("file"), updateAcademic);

module.exports = router;