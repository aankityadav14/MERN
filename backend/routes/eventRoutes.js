const express = require("express");
const { 
  createEvent, 
  getAllEvents, 
  updateEvent, 
  deleteEvent 
} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), authMiddleware, createEvent);
router.get("/", getAllEvents);
router.put("/:id", upload.single("image"), authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;
