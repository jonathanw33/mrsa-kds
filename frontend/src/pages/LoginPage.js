import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);
    try {
      const { error: loginError } = await login(email, password);
      if (loginError) throw loginError;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg">
            <Card.Header className="text-center py-4 bg-primary text-white">
              <h2 className="mb-0">Welcome Back!</h2>
            </Card.Header>
            <Card.Body className="p-4 p-lg-5">
              <p className="text-center text-muted mb-4">Login to access your dashboard.</p>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : "Login"}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  Don't have an account? <Link to="/register">Register here</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;