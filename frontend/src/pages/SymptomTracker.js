import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SymptomTracker.css';

const SYMPTOMS = [
  'Irregular periods', 'Heavy bleeding', 'Acne', 'Hair loss',
  'Excess hair growth', 'Weight gain', 'Fatigue', 'Mood swings',
  'Bloating', 'Headache', 'Pelvic pain', 'Sleep issues',
  'Brain fog', 'Anxiety', 'Depression', 'Cravings'
];

const MOODS = ['Great', 'Good', 'Okay', 'Bad', 'Terrible'];
const MOOD_EMOJI = { Great:'😄', Good:'😊', Okay:'😐', Bad:'😔', Terrible:'😢' };

const defaultForm = {
  date: new Date().toISOString().split('T')[0],
  symptoms: [],
  period: { started: false, flow: 'None', painLevel: 0 },
  mood: 'Okay',
  sleep: 7,
  exercise: { done: false, type: '', duration: '' },
  diet: { waterIntake: 8, notes: '' },
  medications: [],
  notes: ''
};

const SymptomTracker = () => {
  const [form, setForm] = useState(defaultForm);
  const [entries, setEntries] = useState([]);
  const [tab, setTab] = useState('log');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [medInput, setMedInput] = useState('');

  useEffect(() => {
    axios.get('/symptoms?limit=20').then(res => setEntries(res.data.entries));
  }, []);

  const toggleSymptom = (name) => {
    setForm(prev => {
      const exists = prev.symptoms.find(s => s.name === name);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter(s => s.name !== name)
          : [...prev.symptoms, { name, severity: 3 }]
      };
    });
  };

  const updateSeverity = (name, severity) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(s => s.name === name ? { ...s, severity } : s)
    }));
  };

  const addMedication = () => {
    if (!medInput.trim()) return;
    setForm(prev => ({ ...prev, medications: [...prev.medications, { name: medInput.trim(), taken: false }] }));
    setMedInput('');
  };

  const toggleMed = (idx) => {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.map((m, i) => i === idx ? { ...m, taken: !m.taken } : m)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/symptoms', form);
      const res = await axios.get('/symptoms?limit=20');
      setEntries(res.data.entries);
      setForm(defaultForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTab('history');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    await axios.delete(`/symptoms/${id}`);
    setEntries(prev => prev.filter(e => e._id !== id));
  };

  return (
    <div className="tracker page-container" style={{paddingTop: 100, paddingBottom: 60}}>
      <div className="page-header" style={{textAlign:'left', padding:'0 0 40px'}}>
        <h1>Symptom Tracker</h1>
        <p>Log your daily symptoms, mood, and wellness to find patterns.</p>
      </div>

      <div className="tracker-tabs">
        <button className={`tracker-tab ${tab === 'log' ? 'active' : ''}`} onClick={() => setTab('log')}>📝 Log Today</button>
        <button className={`tracker-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>📊 History</button>
      </div>

      {tab === 'log' && (
        <form onSubmit={handleSubmit} className="tracker-form">
          {saved && <div className="alert alert-success">✅ Entry saved successfully!</div>}

          {/* Date */}
          <div className="card section-card">
            <h3>📅 Date</h3>
            <input type="date" className="form-input" style={{maxWidth:240}} value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} required />
          </div>

          {/* Mood */}
          <div className="card section-card">
            <h3>😊 How are you feeling today?</h3>
            <div className="mood-grid">
              {MOODS.map(mood => (
                <button key={mood} type="button"
                  className={`mood-btn ${form.mood === mood ? 'selected' : ''}`}
                  onClick={() => setForm(p => ({...p, mood}))}>
                  <span>{MOOD_EMOJI[mood]}</span>
                  <span>{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="card section-card">
            <h3>🩺 Symptoms</h3>
            <p style={{color:'var(--text-muted)', fontSize: 14, marginBottom: 16}}>Select all that apply</p>
            <div className="symptoms-grid">
              {SYMPTOMS.map(s => {
                const selected = form.symptoms.find(x => x.name === s);
                return (
                  <div key={s} className={`symptom-toggle ${selected ? 'selected' : ''}`} onClick={() => toggleSymptom(s)}>
                    <span>{s}</span>
                    {selected && (
                      <div className="severity-row" onClick={e => e.stopPropagation()}>
                        <span style={{fontSize:11, color:'var(--text-muted)'}}>Severity:</span>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" className={`sev-btn ${selected.severity >= n ? 'active' : ''}`}
                            onClick={() => updateSeverity(s, n)}>{n}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Period */}
          <div className="card section-card">
            <h3>🩸 Period</h3>
            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox" checked={form.period.started} onChange={e => setForm(p => ({...p, period: {...p.period, started: e.target.checked}}))} />
                <span>Period started today</span>
              </label>
            </div>
            {form.period.started && (
              <div className="period-details">
                <div className="form-group">
                  <label className="form-label">Flow</label>
                  <select className="form-select" value={form.period.flow} onChange={e => setForm(p => ({...p, period: {...p.period, flow: e.target.value}}))}>
                    {['Light','Medium','Heavy'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pain Level (0-10): <strong>{form.period.painLevel}</strong></label>
                  <input type="range" min={0} max={10} value={form.period.painLevel}
                    onChange={e => setForm(p => ({...p, period: {...p.period, painLevel: Number(e.target.value)}}))} style={{width:'100%'}} />
                </div>
              </div>
            )}
          </div>

          {/* Sleep & Exercise */}
          <div className="card section-card two-col">
            <div>
              <h3>😴 Sleep Hours</h3>
              <div className="sleep-row">
                <input type="range" min={0} max={12} step={0.5} value={form.sleep}
                  onChange={e => setForm(p => ({...p, sleep: Number(e.target.value)}))} />
                <span className="sleep-val">{form.sleep}h</span>
              </div>
            </div>
            <div>
              <h3>🏃 Exercise</h3>
              <label className="toggle-label">
                <input type="checkbox" checked={form.exercise.done} onChange={e => setForm(p => ({...p, exercise: {...p.exercise, done: e.target.checked}}))} />
                <span>Did exercise today</span>
              </label>
              {form.exercise.done && (
                <div style={{display:'flex', gap: 8, marginTop: 12}}>
                  <input className="form-input" placeholder="Type (Yoga, Walk...)" value={form.exercise.type} onChange={e => setForm(p => ({...p, exercise: {...p.exercise, type: e.target.value}}))} />
                  <input className="form-input" type="number" placeholder="Mins" style={{width: 80}} value={form.exercise.duration} onChange={e => setForm(p => ({...p, exercise: {...p.exercise, duration: e.target.value}}))} />
                </div>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="card section-card">
            <h3>💊 Medications</h3>
            <div style={{display:'flex', gap: 8, marginBottom: 12}}>
              <input className="form-input" placeholder="Add medication..." value={medInput} onChange={e => setMedInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMedication())} />
              <button type="button" className="btn btn-outline btn-sm" onClick={addMedication}>Add</button>
            </div>
            {form.medications.map((med, i) => (
              <label key={i} className="toggle-label" style={{marginBottom: 8}}>
                <input type="checkbox" checked={med.taken} onChange={() => toggleMed(i)} />
                <span style={{textDecoration: med.taken ? 'line-through' : 'none'}}>{med.name}</span>
              </label>
            ))}
          </div>

          {/* Notes */}
          <div className="card section-card">
            <h3>📓 Notes</h3>
            <textarea className="form-textarea" placeholder="Any additional notes for today..." value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} />
          </div>

          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'16px'}} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Entry'}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="history">
          {entries.length === 0 ? (
            <div className="card" style={{textAlign:'center', padding: 60}}>
              <div style={{fontSize:48, marginBottom:16}}>📋</div>
              <p style={{color:'var(--text-muted)'}}>No entries yet. Start logging to see your history.</p>
            </div>
          ) : (
            <div className="history-list">
              {entries.map(entry => (
                <div key={entry._id} className="card history-card">
                  <div className="history-header">
                    <div>
                      <div className="history-date">{new Date(entry.date).toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
                      <div className="history-mood">{MOOD_EMOJI[entry.mood]} {entry.mood}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => deleteEntry(entry._id)} style={{color:'#ef4444'}}>🗑</button>
                  </div>
                  {entry.symptoms?.length > 0 && (
                    <div className="history-symptoms">
                      {entry.symptoms.map((s, i) => <span key={i} className="badge badge-rose" style={{fontSize:12}}>{s.name} ({s.severity}/5)</span>)}
                    </div>
                  )}
                  <div className="history-meta">
                    {entry.sleep && <span>😴 {entry.sleep}h sleep</span>}
                    {entry.exercise?.done && <span>🏃 {entry.exercise.type || 'Exercise'}</span>}
                    {entry.period?.started && <span>🩸 Period day</span>}
                  </div>
                  {entry.notes && <p className="history-notes">📓 {entry.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomTracker;
