import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernHero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="modern-hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <Container className="hero-content">
        <Row className="justify-content-center align-items-center min-vh-80">
          <Col lg={8} xl={7} className="text-center">
            <div className="hero-badge mb-4">
              <div className="badge-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="9"/>
                </svg>
                <span>Advanced MRSA Detection</span>
              </div>
            </div>
            
            <h1 className="hero-title mb-4">
              Unlock the Secrets of
              <span className="gradient-text"> MRSA Resistance</span>
            </h1>
            
            <p className="hero-subtitle mb-5">
              Analyze DNA sequences to identify antibiotic resistance genes with cutting-edge 
              BLAST technology. Get fast, accurate results that empower your research and 
              clinical decisions.
            </p>
            
            <div className="hero-features mb-5">
              <div className="feature-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
                <span>Fast Detection</span>
              </div>
              <div className="feature-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>High Accuracy</span>
              </div>
              <div className="feature-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>Real-time Results</span>
              </div>
            </div>
            
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Button 
                    as={Link} 
                    to="/analysis" 
                    size="lg" 
                    className="btn-gradient me-3 mb-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Start New Analysis
                  </Button>
                  <Button 
                    as={Link} 
                    to="/history" 
                    variant="outline-light" 
                    size="lg" 
                    className="btn-outline-modern mb-3"
                  >
                    View History
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    as={Link} 
                    to="/register" 
                    size="lg" 
                    className="btn-gradient me-3 mb-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Get Started Free
                  </Button>
                  <Button 
                    as={Link} 
                    to="/about" 
                    variant="outline-light" 
                    size="lg" 
                    className="btn-outline-modern mb-3"
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
        
        <Row className="justify-content-center mt-5">
          <Col lg={10} xl={8} className="text-center">
            <div className="hero-image-container">
              <div className="hero-image-bg"></div>
              <svg 
                width="100%" 
                height="300" 
                viewBox="0 0 800 300" 
                className="hero-illustration"
              >
                {/* DNA Helix */}
                <defs>
                  <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary-color, #6a11cb)" />
                    <stop offset="100%" stopColor="var(--secondary-color, #2575fc)" />
                  </linearGradient>
                </defs>
                
                {/* DNA Strands */}
                <path 
                  d="M100 150 Q200 100 300 150 T500 150 T700 150" 
                  stroke="url(#dnaGradient)" 
                  strokeWidth="4" 
                  fill="none"
                  className="dna-strand"
                />
                <path 
                  d="M100 150 Q200 200 300 150 T500 150 T700 150" 
                  stroke="url(#dnaGradient)" 
                  strokeWidth="4" 
                  fill="none"
                  className="dna-strand"
                />
                
                {/* Connection lines */}
                {[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650].map((x, i) => (
                  <line 
                    key={i}
                    x1={x} 
                    y1={150 + Math.sin(x * 0.02) * 50} 
                    x2={x} 
                    y2={150 - Math.sin(x * 0.02) * 50}
                    stroke="url(#dnaGradient)"
                    strokeWidth="2"
                    opacity="0.6"
                    className="dna-connection"
                  />
                ))}
                
                {/* Floating particles */}
                <circle cx="150" cy="80" r="3" fill="var(--primary-color, #6a11cb)" opacity="0.7" className="particle">
                  <animate attributeName="cy" values="80;90;80" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="300" cy="220" r="2" fill="var(--secondary-color, #2575fc)" opacity="0.5" className="particle">
                  <animate attributeName="cy" values="220;210;220" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="500" cy="60" r="2.5" fill="var(--primary-color, #6a11cb)" opacity="0.6" className="particle">
                  <animate attributeName="cy" values="60;70;60" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="650" cy="240" r="2" fill="var(--secondary-color, #2575fc)" opacity="0.8" className="particle">
                  <animate attributeName="cy" values="240;230;240" dur="3.5s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        .modern-hero {
          position: relative;
          min-height: 90vh;
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          color: white;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          animation: float 6s ease-in-out infinite;
        }
        
        .orb-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .orb-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }
        
        .orb-3 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 30%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .hero-content {
          position: relative;
          z-index: 10;
        }
        
        .min-vh-80 {
          min-height: 80vh;
        }
        
        .hero-badge {
          display: inline-block;
          margin-bottom: 1rem;
        }
        
        .badge-content {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .hero-features {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .hero-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .btn-gradient:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .btn-outline-modern {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        
        .btn-outline-modern:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.8);
          color: white;
          transform: translateY(-2px);
        }
        
        .hero-image-container {
          position: relative;
          margin-top: 3rem;
        }
        
        .hero-image-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(20px);
        }
        
        .hero-illustration {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
        }
        
        .dna-strand {
          animation: pulse 2s ease-in-out infinite alternate;
        }
        
        .dna-connection {
          animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        @keyframes glow {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};

export default ModernHero;