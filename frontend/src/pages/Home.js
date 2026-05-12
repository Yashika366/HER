import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const StatCard = ({ number, label }) => (
  <div className="stat-card">
    <div className="stat-num">{number}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, to }) => (
  <Link to={to} className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <span className="feature-arrow">→</span>
  </Link>
);

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="hero-content page-container">
          <div className="hero-badge badge badge-rose">🌸 For Women, By Women</div>
          <h1 className="hero-title">
            You Deserve to<br />
            <em>Heal, Excel &</em><br />
            Renown
          </h1>
          <p className="hero-desc">
            HER is your comprehensive companion for navigating PCOS & PCOD — 
            from understanding your body to building a thriving community of support.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Start Your Journey</Link>
                <Link to="/articles" className="btn btn-outline">Learn More</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <StatCard number="1 in 10" label="Women have PCOS" />
            <StatCard number="70%" label="Go Undiagnosed" />
            <StatCard number="∞" label="Support Available" />
          </div>
        </div>
      </section>

      {/* What is PCOS/PCOD */}
      <section className="info-section section">
        <div className="page-container">
          <div className="info-grid">
            <div className="info-text">
              <span className="section-eyebrow">Understanding</span>
              <h2 className="section-title">What is PCOS & PCOD?</h2>
              <p>Polycystic Ovary Syndrome (PCOS) and Polycystic Ovary Disorder (PCOD) are hormonal conditions affecting millions of women worldwide, yet they remain widely misunderstood and underdiagnosed.</p>
              <p style={{marginTop: 16}}>These conditions affect hormonal balance, reproductive health, metabolism, and emotional wellbeing — but with the right knowledge and support, you can thrive.</p>
              <Link to="/articles" className="btn btn-primary" style={{marginTop: 28}}>Learn More</Link>
            </div>
            <div className="info-cards">
              {[
                { icon: '🔄', label: 'Irregular Periods' },
                { icon: '⚖️', label: 'Hormonal Imbalance' },
                { icon: '🧬', label: 'Genetic Factors' },
                { icon: '🍽️', label: 'Metabolic Impact' },
                { icon: '💆', label: 'Mental Health' },
                { icon: '👶', label: 'Fertility Concerns' }
              ].map((item, i) => (
                <div key={i} className="symptom-chip">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section section">
        <div className="page-container">
          <div style={{textAlign:'center', marginBottom: 48}}>
            <span className="section-eyebrow">Everything You Need</span>
            <h2 className="section-title">Your Complete PCOS Toolkit</h2>
          </div>
          <div className="grid-3">
            <FeatureCard icon="📊" title="Symptom Tracker" desc="Log daily symptoms, mood, sleep, and cycle to discover patterns and triggers." to="/tracker" />
            <FeatureCard icon="📚" title="Knowledge Hub" desc="Expert-reviewed articles on PCOS causes, treatments, diet, and mental health." to="/articles" />
            <FeatureCard icon="💬" title="Community" desc="Connect with women who truly understand your journey. Share, support, and grow together." to="/community" />
            <FeatureCard icon="📅" title="Appointment Manager" desc="Track your doctor visits, prepare questions, and manage your healthcare journey." to="/appointments" />
            <FeatureCard icon="📈" title="Health Dashboard" desc="Visualize your health trends and see your progress over time." to="/dashboard" />
            <FeatureCard icon="👤" title="Personal Profile" desc="Customize your experience based on your condition, symptoms, and goals." to="/profile" />
          </div>
        </div>
      </section>

      {/* Stories teaser */}
      <section className="stories-section section">
        <div className="page-container">
          <div style={{textAlign:'center', marginBottom: 48}}>
            <span className="section-eyebrow">Community Voices</span>
            <h2 className="section-title">You Are Not Alone</h2>
          </div>
          <div className="grid-3">
            {[
              { name: 'Priya, 26', quote: 'HER helped me understand my body in ways no doctor ever explained. I finally feel in control.', tag: 'PCOS' },
              { name: 'Meera, 31', quote: 'The community here is unlike anything else. These women lifted me when I was at my lowest.', tag: 'PCOD' },
              { name: 'Ananya, 22', quote: 'I was diagnosed at 19 and felt so lost. HER gave me the information and support to move forward.', tag: 'PCOS' }
            ].map((s, i) => (
              <div key={i} className="story-card card">
                <div className="story-quote">"</div>
                <p className="story-text">{s.quote}</p>
                <div className="story-footer">
                  <div className="story-avatar">{s.name[0]}</div>
                  <div>
                    <div className="story-name">{s.name}</div>
                    <span className="badge badge-rose">{s.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop: 40}}>
            <Link to="/community" className="btn btn-outline">Read More Stories</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="page-container">
          <div className="cta-card">
            <div className="cta-blob"></div>
            <h2>Ready to Begin Your Journey?</h2>
            <p>Join thousands of women reclaiming their health with HER.</p>
            <div style={{display:'flex', gap: 16, justifyContent: 'center', flexWrap:'wrap'}}>
              {!user && <Link to="/register" className="btn btn-primary">Create Free Account</Link>}
              <Link to="/community" className="btn" style={{background:'rgba(255,255,255,0.2)', color:'white', border:'2px solid rgba(255,255,255,0.4)'}}>Join Community</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">🌸 HER — Heal · Excel · Renown</div>
              <p className="footer-sub">Empowering women with PCOS & PCOD</p>
            </div>
            <div className="footer-links">
              <Link to="/articles">Articles</Link>
              <Link to="/community">Community</Link>
              <Link to="/tracker">Tracker</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 HER. Built with ❤️ for every queen out there.</p>
            <p>References: askpcos.org · pcossisters.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
