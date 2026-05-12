import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const CONDITIONS = ['Not Diagnosed', 'PCOS', 'PCOD', 'Both', 'Suspected'];

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', condition: 'Not Diagnosed', bio: '', diagnosisYear: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    axios.get('/users/profile').then(res => {
      setProfile(res.data.user);
      const u = res.data.user;
      setForm({ name: u.name || '', age: u.age || '', condition: u.condition || 'Not Diagnosed', bio: u.bio || '', diagnosisYear: u.diagnosisYear || '' });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/users/profile', form);
      setProfile(res.data.user);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const joinDate = profile?.joinedDate || profile?.createdAt;

  return (
    <div className="profile-page page-container" style={{ paddingTop: 100, paddingBottom: 80 }}>
      {/* Profile hero card */}
      <div className="profile-hero card">
        <div className="profile-avatar-big">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-hero-info">
          <h1>{profile?.name}</h1>
          <p>{profile?.email}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <span className="badge badge-rose">{profile?.condition || 'Not Diagnosed'}</span>
            {profile?.age && <span className="badge badge-plum">Age {profile.age}</span>}
            {profile?.role !== 'user' && <span className="badge badge-gold">⭐ {profile?.role}</span>}
          </div>
          {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
        <div className="profile-hero-meta">
          <div className="profile-meta-item">
            <div className="profile-meta-num">{profile?.savedArticles?.length || 0}</div>
            <div className="profile-meta-label">Saved Articles</div>
          </div>
          <div className="profile-meta-item">
            <div className="profile-meta-num">{joinDate ? new Date(joinDate).getFullYear() : '—'}</div>
            <div className="profile-meta-label">Member Since</div>
          </div>
          {profile?.diagnosisYear && (
            <div className="profile-meta-item">
              <div className="profile-meta-num">{profile.diagnosisYear}</div>
              <div className="profile-meta-label">Diagnosed</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {['profile', 'saved', 'settings'].map(tab => (
          <button key={tab} className={`profile-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'profile' ? '👤 My Profile' : tab === 'saved' ? '🔖 Saved Articles' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="profile-section-header">
            <h3>Personal Information</h3>
            {!editing && (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
            )}
          </div>
          {saved && <div className="alert alert-success">✅ Profile updated successfully!</div>}

          {editing ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" className="form-input" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} min={10} max={80} />
                </div>
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select className="form-select" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
                    {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year Diagnosed</label>
                  <input type="number" className="form-input" value={form.diagnosisYear} onChange={e => setForm(p => ({ ...p, diagnosisYear: e.target.value }))} placeholder="e.g. 2021" min={2000} max={2024} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio / About Me</label>
                <textarea className="form-textarea" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Share a little about your journey..." maxLength={500} />
                <small style={{ color: 'var(--text-muted)', fontSize: 12 }}>{form.bio.length}/500</small>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-view">
              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <div className="profile-view-label">Full Name</div>
                  <div className="profile-view-value">{profile?.name}</div>
                </div>
                <div className="profile-view-item">
                  <div className="profile-view-label">Email</div>
                  <div className="profile-view-value">{profile?.email}</div>
                </div>
                <div className="profile-view-item">
                  <div className="profile-view-label">Age</div>
                  <div className="profile-view-value">{profile?.age || '—'}</div>
                </div>
                <div className="profile-view-item">
                  <div className="profile-view-label">Condition</div>
                  <div className="profile-view-value">{profile?.condition || '—'}</div>
                </div>
                <div className="profile-view-item">
                  <div className="profile-view-label">Diagnosed Year</div>
                  <div className="profile-view-value">{profile?.diagnosisYear || '—'}</div>
                </div>
                <div className="profile-view-item">
                  <div className="profile-view-label">Member Since</div>
                  <div className="profile-view-value">{joinDate ? new Date(joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
                </div>
              </div>
              {profile?.bio && (
                <div className="profile-view-item" style={{ marginTop: 16 }}>
                  <div className="profile-view-label">About Me</div>
                  <div className="profile-view-value">{profile.bio}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Articles */}
      {activeTab === 'saved' && (
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>🔖 Saved Articles</h3>
          {!profile?.savedArticles?.length ? (
            <div className="empty-state">
              <span>📚</span>
              <p>No saved articles yet. <a href="/articles" style={{ color: 'var(--rose)' }}>Browse articles →</a></p>
            </div>
          ) : (
            <div className="saved-articles-list">
              {profile.savedArticles.map(article => (
                <div key={article._id || article} className="saved-article-item">
                  <div>
                    <div className="saved-article-title">{article.title || 'Article'}</div>
                    {article.category && <span className="badge badge-rose" style={{ fontSize: 11 }}>{article.category}</span>}
                  </div>
                  {article.readTime && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>⏱ {article.readTime} min</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="card">
          <h3 style={{ marginBottom: 24 }}>⚙️ Account Settings</h3>
          <div className="settings-list">
            <div className="settings-item">
              <div>
                <div className="settings-label">Email Address</div>
                <div className="settings-value">{profile?.email}</div>
              </div>
              <span className="badge badge-plum">Verified</span>
            </div>
            <div className="settings-item">
              <div>
                <div className="settings-label">Account Role</div>
                <div className="settings-value capitalize">{profile?.role || 'user'}</div>
              </div>
            </div>
            <div className="settings-item">
              <div>
                <div className="settings-label">Notifications</div>
                <div className="settings-value">Appointment reminders & updates</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-item">
              <div>
                <div className="settings-label">Community Visibility</div>
                <div className="settings-value">Others can see your posts and profile</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <hr className="divider" />

          <div className="danger-zone">
            <h4>Danger Zone</h4>
            <button className="btn" style={{ background: '#FEE2E2', color: '#991B1B', border: 'none' }} onClick={logout}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
