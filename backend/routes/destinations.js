// backend/routes/destinations.js
const express = require('express');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all destinations (public)
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch destinations', error: error.message });
  }
});

// Get single destination by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch destination', error: error.message });
  }
});

// Get featured destinations (public)
router.get('/filter/featured', async (req, res) => {
  try {
    const destinations = await Destination.find({ featured: true }).limit(6);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured destinations', error: error.message });
  }
});

module.exports = router;