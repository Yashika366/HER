const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');
const { protect } = require('../middleware/auth');

// @route POST /api/symptoms
router.post('/', protect, async (req, res) => {
  try {
    const entry = await Symptom.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/symptoms (with optional date range)
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    let query = { user: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const entries = await Symptom.find(query).sort({ date: -1 }).limit(Number(limit));
    res.json({ success: true, entries, count: entries.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/symptoms/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const entries = await Symptom.find({ user: req.user._id });
    const symptomFrequency = {};
    entries.forEach(e => {
      e.symptoms.forEach(s => {
        if (!symptomFrequency[s.name]) symptomFrequency[s.name] = 0;
        symptomFrequency[s.name]++;
      });
    });
    const moodDistribution = entries.reduce((acc, e) => {
      if (e.mood) { acc[e.mood] = (acc[e.mood] || 0) + 1; }
      return acc;
    }, {});
    res.json({ success: true, stats: { symptomFrequency, moodDistribution, totalEntries: entries.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/symptoms/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const entry = await Symptom.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/symptoms/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Symptom.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
