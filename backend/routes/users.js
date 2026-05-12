const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedArticles', 'title slug category readTime');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, condition, bio, diagnosisYear } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, condition, bio, diagnosisYear },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/users/save-article/:articleId
router.post('/save-article/:articleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const already = user.savedArticles.includes(req.params.articleId);
    if (already) {
      user.savedArticles = user.savedArticles.filter(id => id.toString() !== req.params.articleId);
    } else {
      user.savedArticles.push(req.params.articleId);
    }
    await user.save();
    res.json({ success: true, saved: !already, savedArticles: user.savedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
