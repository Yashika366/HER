import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, symptomsRes, apptRes] = await Promise.all([
          axios.get('/symptoms/stats'),
          axios.get('/symptoms?limit=5'),
          axios.get('/appointments')
        ]);
        setStats(statsRes.data.stats);
        setRecentSymptoms(symptomsRes.data.entries);
        setAppointments(apptRes.data.appointments.filter(a => a.status === 'Upcoming').slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const topSymptoms = stats?.symptomFrequency
    ? Object.entries(stats.symptomFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];

  const moodEmoji = { Great: '😄', Good: '😊', Okay: '😐', Bad: '😔', Terrible: '😢' };

  return (
    <div className="dashboard page-container" style={{paddingTop: 100, paddingBottom: 60}}>
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]} 🌸</h1>
          <p>Here's your health overview. <span className="badge badge-rose">{user?.condition || 'Not Diagnosed'}</span></p>
        </div>
        <Link to="/tracker" className="btn btn-primary">+ Log Today</Link>
      </div>

      {/* Stats row */}
      <div className="dash-stats">
        <div className="dash-stat-card card">
          <div className="dash-stat-icon">📝</div>
          <div className="dash-stat-num">{stats?.totalEntries || 0}</div>
          <div className="dash-stat-label">Total Entries</div>
        </div>
        <div className="dash-stat-card card">
          <div className="dash-stat-icon">🩺</div>
          <div className="dash-stat-num">{appointments.length}</div>
          <div className="dash-stat-label">Upcoming Appts</div>
        </div>
        <div className="dash-stat-card card">
          <div className="dash-stat-icon">⚡</div>
          <div className="dash-stat-num">{topSymptoms.length > 0 ? topSymptoms[0][0].split(' ')[0] : '—'}</div>
          <div className="dash-stat-label">Top Symptom</div>
        </div>
        <div className="dash-stat-card card">
          <div className="dash-stat-icon">💪</div>
          <div className="dash-stat-num">{recentSymptoms.filter(s => s.exercise?.done).length}</div>
          <div className="dash-stat-label">Exercise Days</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Recent entries */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Entries</h3>
            <Link to="/tracker" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {recentSymptoms.length === 0 ? (
            <div className="empty-state">
              <span>📋</span>
              <p>No entries yet. <Link to="/tracker">Start tracking →</Link></p>
            </div>
          ) : (
            <div className="entry-list">
              {recentSymptoms.map(entry => (
                <div key={entry._id} className="entry-item">
                  <div className="entry-date">{new Date(entry.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
                  <div className="entry-details">
                    <div className="entry-mood">{moodEmoji[entry.mood] || '😐'} {entry.mood || 'No mood'}</div>
                    <div className="entry-symptoms">
                      {entry.symptoms?.slice(0,3).map((s, i) => (
                        <span key={i} className="badge badge-rose" style={{fontSize:11}}>{s.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top symptoms */}
        <div className="card">
          <div className="card-header">
            <h3>Common Symptoms</h3>
          </div>
          {topSymptoms.length === 0 ? (
            <div className="empty-state"><span>📊</span><p>Track symptoms to see trends</p></div>
          ) : (
            <div className="symptom-bars">
              {topSymptoms.map(([name, count], i) => {
                const max = topSymptoms[0][1];
                return (
                  <div key={i} className="symptom-bar-item">
                    <div className="symptom-bar-label">{name}</div>
                    <div className="symptom-bar-track">
                      <div className="symptom-bar-fill" style={{width: `${(count/max)*100}%`}}></div>
                    </div>
                    <div className="symptom-bar-count">{count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Appointments</h3>
            <Link to="/appointments" className="btn btn-ghost btn-sm">Manage</Link>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <span>📅</span>
              <p>No upcoming appointments. <Link to="/appointments">Schedule one →</Link></p>
            </div>
          ) : (
            <div className="appt-list">
              {appointments.map(appt => (
                <div key={appt._id} className="appt-item">
                  <div className="appt-date-box">
                    <div className="appt-day">{new Date(appt.date).getDate()}</div>
                    <div className="appt-month">{new Date(appt.date).toLocaleString('en-IN', {month:'short'})}</div>
                  </div>
                  <div>
                    <div className="appt-doctor">{appt.doctorName}</div>
                    <div className="appt-spec">{appt.specialty} · {appt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 style={{marginBottom: 20}}>Quick Actions</h3>
          <div className="quick-actions">
            {[
              { icon: '📝', label: 'Log Symptoms', to: '/tracker' },
              { icon: '📚', label: 'Read Articles', to: '/articles' },
              { icon: '💬', label: 'Join Discussion', to: '/community' },
              { icon: '📅', label: 'Book Appointment', to: '/appointments' },
              { icon: '👤', label: 'Edit Profile', to: '/profile' },
            ].map((a, i) => (
              <Link key={i} to={a.to} className="quick-action-btn">
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
