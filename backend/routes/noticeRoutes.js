const express = require("express");
const multer = require("multer");
const { 
  createNotice, 
  getAllNotices, 
  updateNotice, 
  deleteNotice 
} = require("../controllers/noticeController");
const authMiddleware = require("../middleware/authMiddleware");

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

router.post("/", authMiddleware, upload.single("file"), createNotice);
router.get("/", getAllNotices);
router.put("/:id", authMiddleware, upload.single("file"), updateNotice);
router.delete("/:id", authMiddleware, deleteNotice);

module.exports = router;
