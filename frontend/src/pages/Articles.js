import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Articles.css';

const CATEGORIES = ['All', 'Understanding PCOS', 'Diet & Nutrition', 'Mental Health', 'Treatments', 'Success Stories', 'Research', 'Fitness'];

const SAMPLE_ARTICLES = [
  {
    _id: '1', title: 'Understanding PCOS: Causes, Symptoms & Diagnosis',
    excerpt: 'A comprehensive overview of Polycystic Ovary Syndrome — what it is, how it develops, and how doctors diagnose it.',
    category: 'Understanding PCOS', readTime: 8, views: 1240, likes: [],
    author: { name: 'Dr. Anita Sharma' }, publishedAt: '2024-01-15',
    tags: ['PCOS', 'Diagnosis', 'Hormones']
  },
  {
    _id: '2', title: 'The Anti-Inflammatory Diet for PCOS Management',
    excerpt: 'Discover which foods can help balance your hormones, reduce inflammation, and manage PCOS symptoms naturally.',
    category: 'Diet & Nutrition', readTime: 6, views: 980, likes: [],
    author: { name: 'Nutritionist Pooja Gupta' }, publishedAt: '2024-02-01',
    tags: ['Diet', 'Nutrition', 'Inflammation']
  },
  {
    _id: '3', title: 'PCOS and Mental Health: Breaking the Stigma',
    excerpt: 'How PCOS affects your emotional wellbeing and practical strategies for managing anxiety, depression, and mood swings.',
    category: 'Mental Health', readTime: 7, views: 856, likes: [],
    author: { name: 'Dr. Ritu Mehta' }, publishedAt: '2024-02-10',
    tags: ['Mental Health', 'Anxiety', 'Depression']
  },
  {
    _id: '4', title: 'PCOD vs PCOS: Know the Difference',
    excerpt: 'Many women confuse PCOD with PCOS. Here\'s a clear breakdown of how these two conditions differ in symptoms, severity, and treatment.',
    category: 'Understanding PCOS', readTime: 5, views: 1560, likes: [],
    author: { name: 'Dr. Shrutika Waghmare' }, publishedAt: '2024-01-22',
    tags: ['PCOD', 'PCOS', 'Comparison']
  },
  {
    _id: '5', title: 'Yoga Routines Specifically Designed for PCOS',
    excerpt: 'Science-backed yoga poses and breathing exercises that help regulate hormones and reduce PCOS symptoms.',
    category: 'Fitness', readTime: 10, views: 720, likes: [],
    author: { name: 'Yoga Expert Meera Iyer' }, publishedAt: '2024-02-20',
    tags: ['Yoga', 'Exercise', 'Hormones']
  },
  {
    _id: '6', title: 'Metformin for PCOS: What You Need to Know',
    excerpt: 'An evidence-based look at Metformin as a treatment for PCOS — benefits, side effects, and who it\'s right for.',
    category: 'Treatments', readTime: 7, views: 643, likes: [],
    author: { name: 'Dr. Priya Nair' }, publishedAt: '2024-03-01',
    tags: ['Medication', 'Metformin', 'Treatment']
  },
  {
    _id: '7', title: 'My PCOS Journey: From Diagnosis to Thriving',
    excerpt: 'One woman\'s inspiring story of navigating PCOS diagnosis, finding the right treatment, and reclaiming her life.',
    category: 'Success Stories', readTime: 6, views: 1100, likes: [],
    author: { name: 'Anjali Sharma' }, publishedAt: '2024-03-10',
    tags: ['Story', 'Inspiration', 'Recovery']
  },
  {
    _id: '8', title: 'Latest Research on PCOS Treatment (2024)',
    excerpt: 'A roundup of the most promising new research on PCOS treatment, including emerging therapies and clinical trials.',
    category: 'Research', readTime: 9, views: 430, likes: [],
    author: { name: 'Research Team HER' }, publishedAt: '2024-03-15',
    tags: ['Research', '2024', 'Treatment']
  },
  {
    _id: '9', title: 'Managing Insulin Resistance in PCOS',
    excerpt: 'How insulin resistance connects to PCOS, and practical dietary and lifestyle changes to improve sensitivity.',
    category: 'Diet & Nutrition', readTime: 8, views: 870, likes: [],
    author: { name: 'Dr. Deepika Rao' }, publishedAt: '2024-02-28',
    tags: ['Insulin', 'Blood Sugar', 'Diet']
  }
];

const CategoryIcon = { 'Understanding PCOS': '🔬', 'Diet & Nutrition': '🥦', 'Mental Health': '💆', 'Treatments': '💊', 'Success Stories': '⭐', 'Research': '📊', 'Fitness': '🏃' };

const ArticleCard = ({ article, onLike, isSaved, onSave, isLoggedIn }) => (
  <div className="article-card card">
    <div className="article-card-header">
      <span className="article-category-icon">{CategoryIcon[article.category] || '📝'}</span>
      <span className="badge badge-plum">{article.category}</span>
    </div>
    <h3 className="article-title">{article.title}</h3>
    <p className="article-excerpt">{article.excerpt}</p>
    <div className="article-tags">
      {article.tags?.map((t, i) => <span key={i} className="article-tag">#{t}</span>)}
    </div>
    <div className="article-footer">
      <div className="article-meta">
        <span>👤 {article.author?.name}</span>
        <span>⏱ {article.readTime} min</span>
        <span>👁 {article.views}</span>
      </div>
      <div className="article-actions">
        {isLoggedIn && (
          <>
            <button className={`icon-btn ${isSaved ? 'active' : ''}`} onClick={() => onSave(article._id)} title="Save article">
              {isSaved ? '🔖' : '📄'}
            </button>
            <button className={`icon-btn ${article.liked ? 'active' : ''}`} onClick={() => onLike(article._id)} title="Like">
              ❤️ {article.likes?.length || 0}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

const Articles = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState(SAMPLE_ARTICLES);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get('/users/profile').then(res => {
        setSavedIds(res.data.user.savedArticles?.map(a => a._id || a) || []);
      }).catch(() => {});
    }
  }, [user]);

  const handleSave = async (id) => {
    if (!user) return;
    try {
      const res = await axios.post(`/users/save-article/${id}`);
      setSavedIds(res.data.savedArticles);
    } catch {}
  };

  const handleLike = async (id) => {
    if (!user) return;
    try {
      await axios.post(`/articles/${id}/like`);
      setArticles(prev => prev.map(a => a._id === id ? { ...a, liked: !a.liked, likes: a.liked ? (a.likes || []).slice(0,-1) : [...(a.likes||[]), user._id] } : a));
    } catch {}
  };

  const filtered = articles.filter(a => {
    const matchCat = category === 'All' || a.category === category;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="articles-page">
      {/* Hero banner */}
      <div className="articles-hero">
        <div className="page-container">
          <h1>Knowledge Hub</h1>
          <p>Expert-reviewed articles on PCOS, PCOD, and women's hormonal health</p>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingBottom: 80 }}>
        {/* Category filters */}
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat !== 'All' && CategoryIcon[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="results-info">
          <span>{filtered.length} article{filtered.length !== 1 ? 's' : ''} found</span>
          {(category !== 'All' || search) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setCategory('All'); setSearch(''); }}>
              Clear filters
            </button>
          )}
        </div>

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <div className="no-results card">
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3>No articles found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filtered.map(article => (
              <ArticleCard
                key={article._id}
                article={article}
                onLike={handleLike}
                isSaved={savedIds.includes(article._id)}
                onSave={handleSave}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}

        {/* Info box */}
        {!user && (
          <div className="login-prompt card">
            <span>🌸</span>
            <div>
              <h4>Join HER to save articles and track your reading</h4>
              <p>Create a free account to bookmark articles, like posts, and get personalized recommendations.</p>
            </div>
            <a href="/register" className="btn btn-primary btn-sm">Join Free</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
