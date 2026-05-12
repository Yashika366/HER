import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', condition: 'Not Diagnosed' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>
      <div className="auth-container">
        <div className="auth-brand">
          <span style={{fontSize:36}}>🌸</span>
          <h2>Join HER</h2>
          <p>Start your healing journey today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" className="form-input" placeholder="Your age" value={form.age} onChange={handleChange} min={10} max={80} />
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select name="condition" className="form-select" value={form.condition} onChange={handleChange}>
                <option value="Not Diagnosed">Not Diagnosed</option>
                <option value="PCOS">PCOS</option>
                <option value="PCOD">PCOD</option>
                <option value="Both">Both</option>
                <option value="Suspected">Suspected</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop: 8}} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create My Account →'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;
