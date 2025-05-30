import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Spinner } from 'react-bootstrap';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container 
        className="d-flex flex-column justify-content-center align-items-center text-center" 
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 lead text-muted">Authenticating...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;