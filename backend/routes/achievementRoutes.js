const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const achievementController = require('../controllers/achievementController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configure multiple file uploads
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'proof', maxCount: 1 }
]);

// Routes
router.post('/', uploadFields, achievementController.createAchievement);
router.get('/', achievementController.getAllAchievements);
router.put('/:id', uploadFields, achievementController.updateAchievement);
router.delete('/:id', achievementController.deleteAchievement);

module.exports = router;
