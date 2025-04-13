const express = require("express");
const { 
  createFaculty, 
  getAllFaculty, 
  updateFaculty, 
  deleteFaculty 
} = require("../controllers/facultyController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const multer = require("multer");

const router = express.Router();

// Configure multer storage
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

router.post("/", upload.single("image"), authMiddleware,isAdmin, createFaculty);
router.get("/", getAllFaculty);
router.put("/:id", upload.single("image"), authMiddleware,isAdmin, updateFaculty);
router.delete("/:id", authMiddleware,isAdmin, deleteFaculty);

module.exports = router;
