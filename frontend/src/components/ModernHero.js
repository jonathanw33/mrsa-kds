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
      
      <Container fluid className="hero-content">
        {/* Baris ini sekarang tidak lagi memiliki min-vh-100 */}
        <Row className="justify-content-center align-items-center"> 
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
        
        {/* Bagian Row untuk hero-image-container DIHAPUS dari sini */}
        {/* Jika Anda ingin menampilkannya di bawah, render di luar komponen ModernHero */}

      </Container>
      
      <style jsx>{`
        .modern-hero {
          position: relative;
          margin-left: calc(-50vw + 50%); 
          margin-right: calc(-50vw + 50%); 
          margin-top: calc(-47vw + 50%);
          width: 100vw; 
          padding-top: 6rem; 
          padding-bottom: 5rem; 

          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          color: white;
          overflow: hidden; 
          display: flex;
          align-items: center;
          border-radius: 15px; 
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
          width: 100%;
        }
        
        /* CSS untuk .min-vh-100 tidak lagi relevan untuk row utama hero, */
        /* tapi bisa dipertahankan jika digunakan di tempat lain. */
        /* Untuk row utama, kita sudah hapus kelas .min-vh-100 */
        .min-vh-100 { 
          min-height: 90vh; 
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
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.8rem;
          }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.35rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 700px;
          margin: 0 auto; /* Sudah ada, bagus untuk centering */
          margin-bottom: 2.5rem !important; /* pastikan ada margin bawah sebelum features */
        }
        
        .hero-features {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem !important; /* pastikan ada margin bawah sebelum actions */
        }
        
        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 1rem;
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
          padding: 0.9rem 2.5rem;
          border-radius: 50px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-size: 1.1rem;
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
          padding: 0.9rem 2.5rem;
          border-radius: 50px;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }
        
        .btn-outline-modern:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.8);
          color: white;
          transform: translateY(-2px);
        }

        /* CSS untuk hero-image-container, hero-image-bg, hero-illustration, dll. */
        /* tidak lagi relevan di dalam komponen ini jika SVG sudah dihapus. */
        /* Jika Anda memindahkannya ke luar, styling tersebut harus ikut. */
        
      `}</style>
    </section>
  );
};

export default ModernHero;