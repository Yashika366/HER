const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/articles
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const articles = await Article.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments(query);

    res.json({ success: true, articles, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/articles/:slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/articles/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const liked = article.likes.includes(req.user._id);
    if (liked) {
      article.likes = article.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      article.likes.push(req.user._id);
    }
    await article.save();
    res.json({ success: true, likes: article.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/articles (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user._id, publishedAt: req.body.isPublished ? new Date() : null });
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
