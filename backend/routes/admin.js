// backend/routes/admin.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Destination = require('../models/Destination');
const adminAuth = require('../middleware/admin');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'destination-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload images
router.post('/upload', adminAuth, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Create new destination
router.post('/destinations', adminAuth, async (req, res) => {
  try {
    const { title, description, price, location, images, rating, duration, featured, discount, originalPrice } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const destination = new Destination({
      title,
      description,
      price,
      location,
      images: images || [],
      rating: rating || 4.5,
      duration: duration || '5 days',
      featured: featured || false,
      discount,
      originalPrice
    });

    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create destination', error: error.message });
  }
});

// Update destination
router.put('/destinations/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const destination = await Destination.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update destination', error: error.message });
  }
});

// Delete destination
router.delete('/destinations/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByIdAndDelete(id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Delete associated images
    if (destination.images && destination.images.length > 0) {
      destination.images.forEach(imageUrl => {
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete destination', error: error.message });
  }
});

// Get all destinations (admin view)
router.get('/destinations', adminAuth, async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch destinations', error: error.message });
  }
});

module.exports = router;