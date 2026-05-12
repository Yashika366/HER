import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointments.css';

const SPECIALTIES = ['Gynecologist', 'Endocrinologist', 'Nutritionist', 'Dermatologist', 'Psychologist', 'General Physician'];
const TYPES = ['In-person', 'Online', 'Phone'];
const SPEC_ICON = { 'Gynecologist': '👩‍⚕️', 'Endocrinologist': '🧬', 'Nutritionist': '🥗', 'Dermatologist': '✨', 'Psychologist': '💆', 'General Physician': '🏥' };

const defaultForm = { doctorName: '', specialty: 'Gynecologist', date: '', time: '', type: 'In-person', notes: '', questions: [''] };

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('Upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/appointments');
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, questions: form.questions.filter(q => q.trim()) };
      if (editId) {
        const res = await axios.put(`/appointments/${editId}`, payload);
        setAppointments(prev => prev.map(a => a._id === editId ? res.data.appointment : a));
      } else {
        const res = await axios.post('/appointments', payload);
        setAppointments(prev => [res.data.appointment, ...prev]);
      }
      setForm(defaultForm);
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (appt) => {
    setForm({
      doctorName: appt.doctorName,
      specialty: appt.specialty,
      date: appt.date?.split('T')[0],
      time: appt.time,
      type: appt.type,
      notes: appt.notes || '',
      questions: appt.questions?.length ? appt.questions : ['']
    });
    setEditId(appt._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? res.data.appointment : a));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await axios.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch {}
  };

  const addQuestion = () => setForm(p => ({ ...p, questions: [...p.questions, ''] }));
  const updateQuestion = (i, val) => setForm(p => ({ ...p, questions: p.questions.map((q, idx) => idx === i ? val : q) }));
  const removeQuestion = (i) => setForm(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }));

  const filtered = appointments.filter(a => filter === 'All' || a.status === filter);
  const upcoming = appointments.filter(a => a.status === 'Upcoming').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

  const STATUS_COLOR = { Upcoming: 'badge-rose', Completed: 'badge-plum', Cancelled: 'badge-gold' };
  const STATUS_DOT = { Upcoming: '#22c55e', Completed: '#8b5cf6', Cancelled: '#f59e0b' };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="appointments-page page-container" style={{ paddingTop: 100, paddingBottom: 80 }}>
      {/* Header */}
      <div className="appt-page-header">
        <div>
          <h1>📅 Appointments</h1>
          <p>Manage your healthcare visits and prepare your questions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(p => !p); setEditId(null); setForm(defaultForm); }}>
          {showForm ? '✕ Cancel' : '+ New Appointment'}
        </button>
      </div>

      {/* Stats */}
      <div className="appt-stats">
        <div className="appt-stat card">
          <div className="appt-stat-num" style={{ color: '#22c55e' }}>{upcoming}</div>
          <div className="appt-stat-label">Upcoming</div>
        </div>
        <div className="appt-stat card">
          <div className="appt-stat-num" style={{ color: 'var(--plum)' }}>{completed}</div>
          <div className="appt-stat-label">Completed</div>
        </div>
        <div className="appt-stat card">
          <div className="appt-stat-num" style={{ color: 'var(--rose)' }}>{appointments.length}</div>
          <div className="appt-stat-label">Total</div>
        </div>
      </div>

      {/* New/Edit Form */}
      {showForm && (
        <div className="card appt-form-card">
          <h3>{editId ? '✏️ Edit Appointment' : '➕ New Appointment'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="appt-form-grid">
              <div className="form-group">
                <label className="form-label">Doctor's Name *</label>
                <input className="form-input" placeholder="Dr. Sharma" value={form.doctorName}
                  onChange={e => setForm(p => ({ ...p, doctorName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Specialty</label>
                <select className="form-select" value={form.specialty}
                  onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className="form-input" value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input type="time" className="form-input" value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Appointment Type</label>
                <div className="type-btns">
                  {TYPES.map(t => (
                    <button key={t} type="button"
                      className={`type-btn ${form.type === t ? 'active' : ''}`}
                      onClick={() => setForm(p => ({ ...p, type: t }))}>
                      {t === 'In-person' ? '🏥' : t === 'Online' ? '💻' : '📞'} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Symptoms to discuss, test results to bring..."
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>

            {/* Questions prep */}
            <div className="form-group">
              <label className="form-label">Questions to Ask Your Doctor</label>
              {form.questions.map((q, i) => (
                <div key={i} className="question-row">
                  <input className="form-input" placeholder={`Question ${i + 1}...`} value={q}
                    onChange={e => updateQuestion(i, e.target.value)} />
                  {form.questions.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeQuestion(i)} style={{ color: '#ef4444' }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion} style={{ marginTop: 8 }}>
                + Add Question
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Update Appointment' : 'Save Appointment'}
              </button>
              <button type="button" className="btn btn-outline"
                onClick={() => { setShowForm(false); setEditId(null); setForm(defaultForm); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="appt-filter-tabs">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
          <button key={f} className={`appt-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 56 }}>📅</div>
          <h3 style={{ color: 'var(--plum)', margin: '16px 0 8px' }}>No appointments found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Click "New Appointment" to schedule your first visit.</p>
        </div>
      ) : (
        <div className="appt-list">
          {filtered.map(appt => (
            <div key={appt._id} className="appt-card card">
              <div className="appt-card-header">
                <div className="appt-card-left">
                  <div className="appt-spec-icon">{SPEC_ICON[appt.specialty] || '🏥'}</div>
                  <div>
                    <div className="appt-card-doctor">{appt.doctorName}</div>
                    <div className="appt-card-spec">{appt.specialty}</div>
                  </div>
                </div>
                <div className="appt-card-right">
                  <span className={`badge ${STATUS_COLOR[appt.status]}`}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: STATUS_DOT[appt.status], marginRight: 5 }}></span>
                    {appt.status}
                  </span>
                </div>
              </div>

              <div className="appt-card-details">
                <span>📅 {new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>🕐 {appt.time}</span>
                <span>{appt.type === 'In-person' ? '🏥' : appt.type === 'Online' ? '💻' : '📞'} {appt.type}</span>
              </div>

              {appt.notes && (
                <div className="appt-card-notes">
                  <strong>📝 Notes:</strong> {appt.notes}
                </div>
              )}

              {appt.questions?.length > 0 && (
                <div className="appt-questions">
                  <strong>❓ Questions to ask:</strong>
                  <ul>
                    {appt.questions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}

              <div className="appt-card-actions">
                {appt.status === 'Upcoming' && (
                  <button className="btn btn-outline btn-sm"
                    onClick={() => handleStatusChange(appt._id, 'Completed')}>✅ Mark Complete</button>
                )}
                {appt.status === 'Upcoming' && (
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => handleStatusChange(appt._id, 'Cancelled')}>❌ Cancel</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(appt)}>✏️ Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}
                  onClick={() => handleDelete(appt._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips box */}
      <div className="card appt-tips">
        <h4>💡 Tips for Your Doctor Visit</h4>
        <ul>
          <li>Bring your symptom tracker report to show patterns</li>
          <li>List all medications and supplements you're taking</li>
          <li>Note the dates and duration of your last few periods</li>
          <li>Don't hesitate to ask for a second opinion</li>
          <li>Request copies of all your test results</li>
        </ul>
      </div>
    </div>
  );
};

export default Appointments;
