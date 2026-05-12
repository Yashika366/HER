const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { protect } = require('../middleware/auth');

// @route GET /api/community
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    let query = {};
    if (category) query.category = category;

    const posts = await CommunityPost.find(query)
      .populate('user', 'name avatar condition')
      .populate('comments.user', 'name avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CommunityPost.countDocuments(query);
    res.json({ success: true, posts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/community
router.post('/', protect, async (req, res) => {
  try {
    const post = await CommunityPost.create({ ...req.body, user: req.user._id });
    await post.populate('user', 'name avatar condition');
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/community/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/community/:id/comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    post.comments.push({ user: req.user._id, content: req.body.content });
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.status(201).json({ success: true, comments: post.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/community/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
