const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Article = require('./models/Article');
const CommunityPost = require('./models/CommunityPost');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Connected to MongoDB for seeding...');

  // Clear existing
  await User.deleteMany({});
  await Article.deleteMany({});
  await CommunityPost.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'HER Admin',
    email: 'admin@her.com',
    password: 'admin123',
    role: 'admin',
    condition: 'PCOS',
    age: 28,
    bio: 'Co-founder of HER. PCOS warrior for 6 years.',
    isVerified: true
  });

  // Create sample user
  const user = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'priya123',
    condition: 'PCOS',
    age: 26,
    diagnosisYear: 2021,
    bio: 'Navigating PCOS one day at a time 🌸',
    isVerified: true
  });

  // Create articles
  const articles = await Article.insertMany([
    {
      title: 'Understanding PCOS: Causes, Symptoms & Diagnosis',
      slug: 'understanding-pcos-causes-symptoms-diagnosis',
      content: 'Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders among women of reproductive age. It affects 1 in 10 women worldwide and is characterized by hormonal imbalance, irregular menstrual cycles, and the development of small cysts on the ovaries...',
      excerpt: 'A comprehensive overview of PCOS — what it is, how it develops, and how doctors diagnose it.',
      category: 'Understanding PCOS',
      tags: ['PCOS', 'Diagnosis', 'Hormones'],
      author: admin._id,
      readTime: 8,
      views: 1240,
      isPublished: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: 'The Anti-Inflammatory Diet for PCOS Management',
      slug: 'anti-inflammatory-diet-pcos-management',
      content: 'Chronic low-grade inflammation plays a significant role in PCOS. Research shows that an anti-inflammatory diet can help reduce insulin resistance, balance hormones, and manage symptoms...',
      excerpt: 'Discover which foods can help balance your hormones and manage PCOS symptoms naturally.',
      category: 'Diet & Nutrition',
      tags: ['Diet', 'Nutrition', 'Inflammation'],
      author: admin._id,
      readTime: 6,
      views: 980,
      isPublished: true,
      publishedAt: new Date('2024-02-01')
    },
    {
      title: 'PCOS and Mental Health: Breaking the Stigma',
      slug: 'pcos-mental-health-breaking-stigma',
      content: 'The psychological impact of PCOS is often underestimated. Women with PCOS are 3x more likely to experience anxiety and depression. This article explores the mind-body connection in PCOS...',
      excerpt: 'How PCOS affects your emotional wellbeing and strategies for managing anxiety and mood swings.',
      category: 'Mental Health',
      tags: ['Mental Health', 'Anxiety', 'Depression'],
      author: admin._id,
      readTime: 7,
      views: 856,
      isPublished: true,
      publishedAt: new Date('2024-02-10')
    }
  ]);

  // Create community posts
  await CommunityPost.insertMany([
    {
      user: user._id,
      title: 'Finally got my diagnosis after 3 years!',
      content: 'After struggling for years with irregular periods and unexplained weight gain, I finally have answers. My doctor confirmed PCOS last week. Has anyone else felt this mix of relief and fear?',
      category: 'My Story',
      likes: [admin._id],
      isAnonymous: false
    },
    {
      user: admin._id,
      title: 'Tips that actually helped my PCOS symptoms ✨',
      content: '6 months into my PCOS journey and I\'ve found what works: spearmint tea, low-glycemic diet, daily walks, and stress management. Share what works for you!',
      category: 'Tips & Advice',
      isPinned: true,
      isAnonymous: false
    }
  ]);

  console.log('✅ Seeding complete!');
  console.log('👤 Admin: admin@her.com / admin123');
  console.log('👤 User:  priya@example.com / priya123');
  await mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
