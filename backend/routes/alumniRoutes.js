const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createAlumni, getAllAlumni, updateAlumni, deleteAlumni } = require("../controllers/alumniController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("image"), createAlumni);
router.get("/", getAllAlumni);
router.put("/:id", upload.single("image"), updateAlumni);
router.delete("/:id", deleteAlumni);

module.exports = router;
