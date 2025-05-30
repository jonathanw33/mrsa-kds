import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="shadow-sm custom-navbar" style={{ backgroundColor: '#1a1f3a' }}>
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <img
            src="/logo.png" // Pastikan path logo ini benar
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="MRSA Detector Logo"
            style={{ marginTop: '-2px' }}
          />
          MRSA Detector
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/analysis">New Analysis</Nav.Link>
                <Nav.Link as={Link} to="/history">Analysis History</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
          <Nav className="align-items-center"> {/* PENAMBAHAN: align-items-center pada Nav pembungkus */}
            {isAuthenticated ? (
              <NavDropdown
                title={user?.email || 'My Account'}
                id="user-nav-dropdown"
                align="end"
                menuVariant="dark"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                {/* PERUBAHAN: Menggunakan kelas flex untuk centering yang lebih eksplisit */}
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  // Hapus px-2 atau px-3 untuk sementara, biarkan padding default btn-sm
                  // Tambahkan kelas d-flex dan alignmentnya
                  className="d-flex align-items-center justify-content-center"
                  // Jika padding default btn-sm terlalu kecil, bisa tambahkan padding spesifik di sini
                  // misalnya style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                  // atau gunakan kelas px-2 jika dirasa pas
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;