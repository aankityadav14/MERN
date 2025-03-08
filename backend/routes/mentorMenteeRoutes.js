const express = require('express');
const multer = require('multer');
const { 
  createMentorMentee, 
  getAllMentorMentees, 
  getMentorMenteeById,
  updateMentorMentee, 
  deleteMentorMentee 
} = require('../controllers/mentorMenteeController');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', upload.single('media'), createMentorMentee);
router.get('/', getAllMentorMentees);
router.get('/:id', getMentorMenteeById);
router.put('/:id', upload.single('media'), updateMentorMentee);
router.delete('/:id', deleteMentorMentee);

module.exports = router;