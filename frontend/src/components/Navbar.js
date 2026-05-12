import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌸</span>
          <div>
            <span className="brand-name">HER</span>
            <span className="brand-tagline">Heal · Excel · Renown</span>
          </div>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Learn</Link>
          <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Community</Link>
          {user && (
            <>
              <Link to="/tracker" className={`nav-link ${isActive('/tracker') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Tracker</Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join HER</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
