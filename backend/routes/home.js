// backend/routes/home.js
const express = require('express');
const homeData = require('../data/homeData');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get homepage data (public)
router.get('/home', (req, res) => {
  res.json(homeData);
});

// Get user profile (protected)
router.get('/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;