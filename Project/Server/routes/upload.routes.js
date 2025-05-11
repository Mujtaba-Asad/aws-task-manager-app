// /server/routes/upload.routes.js
const router = require('express').Router();
const upload = require('../config/s3.config');
const verifyToken = require('../middleware/auth.middleware');

// Upload single file
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: req.file.location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;