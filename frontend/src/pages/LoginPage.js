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
    if (!email || !password) { setError('Please enter both email and password'); return; }
    setLoading(true); setError(null);
    try {
      const { error: loginError } = await login(email, password);
      if (loginError) throw loginError;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <Container className="py-5"> {/* py-5 agar lebih di tengah vertikal */}
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}> {/* Kolom standar untuk form */}
          <Card className="shadow-lg"> {/* Card akan mendapat style dari index.css, shadow-lg untuk penekanan */}
            <Card.Header className="bg-primary text-white text-center py-3"> {/* Header berwarna dari index.css jika .bg-primary ditambahkan */}
              <h2 className="mb-0 h3">Login to Your Account</h2> {/* h3 agar tidak terlalu besar */}
            </Card.Header>
            <Card.Body className="p-4 p-lg-5"> {/* Padding lebih besar di layar besar */}
              {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="fw-semibold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="e.g., name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid"> {/* Tombol full-width */}
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    size="lg" /* Tombol lebih besar dan mencolok */
                  >
                    {loading ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Logging in...</>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4 pt-2"> {/* Spasi di atas link */}
                <p className="mb-0 text-muted">
                  Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Register here</Link> {/* fw-bold untuk link */}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;