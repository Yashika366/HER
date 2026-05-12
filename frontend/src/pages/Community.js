import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Community.css';

const CATEGORIES = ['All', 'My Story', 'Question', 'Tips & Advice', 'Support Needed', 'Celebrate', 'Research'];
const CAT_COLORS = { 'My Story': 'badge-plum', 'Question': 'badge-gold', 'Tips & Advice': 'badge-rose', 'Support Needed': 'badge-rose', 'Celebrate': 'badge-gold', 'Research': 'badge-plum' };
const CAT_ICON = { 'My Story': '📖', 'Question': '❓', 'Tips & Advice': '💡', 'Support Needed': '🤝', 'Celebrate': '🎉', 'Research': '🔬' };

const SAMPLE_POSTS = [
  {
    _id: 'p1', title: 'Finally got my diagnosis after 3 years!', content: 'After struggling for years with irregular periods and unexplained weight gain, I finally have answers. My doctor confirmed PCOS last week. I\'m scared but also relieved to finally know. Has anyone else felt this mix of emotions after diagnosis?',
    category: 'My Story', user: { name: 'Priya S.', condition: 'PCOS' }, likes: ['u1','u2'], comments: [{ _id: 'c1', content: 'You are so brave for sharing this! The relief of finally knowing is so real.', user: { name: 'Meera R.' } }, { _id: 'c2', content: 'Same here! Diagnosis was actually empowering for me. Sending love 💕', user: { name: 'Ananya K.' } }], isAnonymous: false, createdAt: '2024-03-15T10:00:00Z', views: 234
  },
  {
    _id: 'p2', title: 'Best foods to reduce insulin resistance? 🥗', content: 'My doctor mentioned insulin resistance as part of my PCOS. I\'m trying to change my diet but there\'s so much conflicting information online. What has actually worked for you all? Looking for practical meal ideas especially for Indian cooking!',
    category: 'Question', user: { name: 'Divya M.', condition: 'PCOD' }, likes: ['u1'], comments: [{ _id: 'c3', content: 'Low-glycemic foods are key! Dal, sabzi, roti in moderation. Avoid sugar and refined carbs.', user: { name: 'Nutritionist Pooja' } }], isAnonymous: false, createdAt: '2024-03-14T14:30:00Z', views: 189
  },
  {
    _id: 'p3', title: 'Tips that actually helped my PCOS symptoms ✨', content: '6 months into my PCOS journey and I\'ve found what works for me: 1) Spearmint tea twice daily reduced my facial hair visibly 2) 30 min walks after dinner stabilized my blood sugar 3) Reducing dairy helped my acne dramatically 4) Ashwagandha for stress & sleep. Hope this helps someone!',
    category: 'Tips & Advice', user: { name: 'Riya V.', condition: 'PCOS' }, likes: ['u1','u2','u3'], comments: [], isAnonymous: false, createdAt: '2024-03-13T09:15:00Z', views: 567
  },
  {
    _id: 'p4', title: 'Feeling so overwhelmed and alone 💔', content: 'Some days PCOS feels completely unmanageable. My hair is falling, my skin is terrible, and I\'ve gained 8 kgs despite eating well. I feel like my body is working against me. Just needed a safe space to say this.',
    category: 'Support Needed', user: { name: 'Anonymous' }, likes: ['u1','u2','u3','u4'], comments: [{ _id: 'c4', content: 'You are not alone. We all have those days. This community is here for you. 💕', user: { name: 'Priya S.' } }], isAnonymous: true, createdAt: '2024-03-12T20:00:00Z', views: 312
  },
  {
    _id: 'p5', title: '🎉 Pregnant after 2 years with PCOS!', content: 'I cannot believe I\'m typing this. After 2 years of trying, 4 doctors, countless medications, and so many tears — I\'M PREGNANT! PCOS doesn\'t have to mean infertility. Don\'t give up, queens!',
    category: 'Celebrate', user: { name: 'Sneha K.', condition: 'PCOS' }, likes: ['u1','u2','u3','u4','u5'], comments: [{ _id: 'c5', content: 'This made me cry happy tears! Congratulations!! 🎊', user: { name: 'Meera R.' } }], isAnonymous: false, createdAt: '2024-03-11T16:00:00Z', views: 1205
  }
];

const PostCard = ({ post, onLike, onComment, isLoggedIn, userId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(post.likes?.includes(userId));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) return;
    setLiked(p => !p);
    setLikeCount(c => liked ? c - 1 : c + 1);
    try { await onLike(post._id); } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isLoggedIn) return;
    setSubmitting(true);
    try {
      const res = await onComment(post._id, commentText);
      if (res) setLocalComments(res);
      else setLocalComments(prev => [...prev, { _id: Date.now(), content: commentText, user: { name: 'You' } }]);
      setCommentText('');
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="post-card card">
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">{post.isAnonymous ? '👤' : post.user?.name?.[0]}</div>
          <div>
            <div className="post-name">{post.isAnonymous ? 'Anonymous' : post.user?.name}</div>
            {!post.isAnonymous && post.user?.condition && (
              <span className="badge badge-rose" style={{ fontSize: 11 }}>{post.user.condition}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${CAT_COLORS[post.category] || 'badge-plum'}`}>{CAT_ICON[post.category]} {post.category}</span>
          <span className="post-time">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>

      <div className="post-footer">
        <div className="post-actions">
          <button className={`post-action-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={!isLoggedIn}>
            ❤️ {likeCount}
          </button>
          <button className="post-action-btn" onClick={() => setShowComments(p => !p)}>
            💬 {localComments.length}
          </button>
          <span className="post-views">👁 {post.views}</span>
        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {localComments.map((c, i) => (
              <div key={c._id || i} className="comment-item">
                <div className="comment-avatar">{c.user?.name?.[0] || '?'}</div>
                <div className="comment-body">
                  <div className="comment-author">{c.user?.name}</div>
                  <div className="comment-text">{c.content}</div>
                </div>
              </div>
            ))}
          </div>
          {isLoggedIn ? (
            <form className="comment-form" onSubmit={handleComment}>
              <input
                className="form-input"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? '...' : 'Post'}
              </button>
            </form>
          ) : (
            <p className="comment-login-prompt">
              <a href="/login">Sign in</a> to comment
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [category, setCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'My Story', isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/community').then(res => {
      if (res.data.posts?.length > 0) {
        setPosts(prev => [...res.data.posts, ...prev]);
      }
    }).catch(() => {});
  }, []);

  const handleLike = async (id) => {
    try { await axios.post(`/community/${id}/like`); } catch {}
  };

  const handleComment = async (id, content) => {
    try {
      const res = await axios.post(`/community/${id}/comment`, { content });
      return res.data.comments;
    } catch { return null; }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post('/community', newPost);
      setPosts(prev => [res.data.post, ...prev]);
      setNewPost({ title: '', content: '', category: 'My Story', isAnonymous: false });
      setShowNewPost(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    }
    setSubmitting(false);
  };

  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category);

  return (
    <div className="community-page">
      <div className="community-hero">
        <div className="page-container">
          <h1>Our Community 💬</h1>
          <p>A safe, supportive space for women navigating PCOS & PCOD together</p>
          {user && (
            <button className="btn" style={{ background: 'white', color: 'var(--plum)', fontWeight: 600 }}
              onClick={() => setShowNewPost(p => !p)}>
              ✍️ Share Your Story
            </button>
          )}
        </div>
      </div>

      <div className="page-container community-body">
        {/* New post form */}
        {showNewPost && user && (
          <div className="card new-post-card">
            <h3>✍️ New Post</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmitPost}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="What's on your mind?" value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} required maxLength={200} />
              </div>
              <div className="form-group">
                <label className="form-label">Share more...</label>
                <textarea className="form-textarea" placeholder="Tell your story, ask your question, share your tip..." value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} required maxLength={5000} />
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 180 }}>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={newPost.category}
                    onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="toggle-label" style={{ marginBottom: 12 }}>
                    <input type="checkbox" checked={newPost.isAnonymous}
                      onChange={e => setNewPost(p => ({ ...p, isAnonymous: e.target.checked }))} />
                    <span>Post anonymously</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Publish Post'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowNewPost(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Category filter */}
        <div className="community-filters">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-btn ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat !== 'All' && CAT_ICON[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="posts-list">
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No posts in this category yet. Be the first!</p>
            </div>
          ) : (
            filtered.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                isLoggedIn={!!user}
                userId={user?._id}
              />
            ))
          )}
        </div>

        {!user && (
          <div className="community-join-banner card">
            <span style={{ fontSize: 40 }}>🌸</span>
            <div>
              <h4>Join the HER Community</h4>
              <p>Share your story, ask questions, and connect with thousands of women on the same journey.</p>
            </div>
            <a href="/register" className="btn btn-primary">Join Free</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
