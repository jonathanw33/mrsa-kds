import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernNavigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="modern-navbar shadow-sm">
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="modern-brand d-flex align-items-center">
          <div className="brand-icon me-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
              <path d="m21 12-6-6-6 6-6-6"/>
            </svg>
          </div>
          <span className="brand-text">MRSA Detector</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar-nav" className="modern-toggler" />
        
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="modern-nav-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/analysis" className="modern-nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  New Analysis
                </Nav.Link>
                
                <Nav.Link as={Link} to="/history" className="modern-nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  History
                </Nav.Link>
              </>
            )}
            
            <Nav.Link as={Link} to="/about" className="modern-nav-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              About
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center">
                    <div className="user-avatar me-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <span className="user-email">{user?.email || 'Account'}</span>
                  </div>
                }
                id="user-nav-dropdown"
                align="end"
                className="modern-dropdown"
              >
                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-modern">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="auth-buttons d-flex align-items-center gap-2">
                <Nav.Link as={Link} to="/login" className="modern-nav-link login-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login
                </Nav.Link>
                
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="register-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      <style jsx>{`
        .modern-navbar {
          background: rgba(26, 31, 58, 0.95) !important;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .modern-brand {
          font-weight: 700;
          font-size: 1.25rem;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
        }
        
        .modern-brand:hover {
          color: #e0e7ff;
          transform: translateY(-1px);
        }
        
        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .brand-icon:hover {
          transform: rotate(5deg) scale(1.05);
        }
        
        .brand-text {
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .modern-nav-link {
          color: rgba(255, 255, 255, 0.8) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          border-radius: 8px;
          margin: 0 0.25rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .modern-nav-link:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        
        .modern-nav-link.active {
          color: white !important;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .login-link {
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .register-btn {
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          border: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        
        .register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          opacity: 0.9;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-email {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .modern-dropdown .dropdown-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .modern-dropdown .dropdown-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .dropdown-item-modern {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
          border-radius: 6px;
          margin: 0.25rem;
        }
        
        .dropdown-item-modern:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #dc3545;
        }
        
        .modern-toggler {
          border: none;
          padding: 0.25rem;
        }
        
        .modern-toggler:focus {
          box-shadow: none;
        }
        
        @media (max-width: 991.98px) {
          .auth-buttons {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem !important;
            margin-top: 1rem;
          }
          
          .register-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default ModernNavigation;