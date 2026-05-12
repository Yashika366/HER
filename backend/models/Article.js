const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  category: {
    type: String,
    enum: ['Understanding PCOS', 'Diet & Nutrition', 'Mental Health', 'Treatments', 'Success Stories', 'Research', 'Fitness'],
    required: true
  },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImage: String,
  readTime: Number,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date
}, { timestamps: true });

// Auto-generate slug
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (!this.readTime) {
    const words = this.content.split(' ').length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
