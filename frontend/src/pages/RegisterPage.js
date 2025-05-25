import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', fullName: '', institution: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Full name, email and password are required'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long'); return;
    }
    setLoading(true); setError(null);
    try {
      const { error: regError } = await register(formData.email, formData.password, {
        full_name: formData.fullName, institution: formData.institution
      });
      if (regError) throw regError;
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Container className="py-5"> {/* py-5 agar lebih di tengah vertikal */}
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={7}> {/* Kolom sedikit lebih lebar untuk form register */}
          <Card className="shadow-lg"> {/* Card akan mendapat style dari index.css */}
            <Card.Header className="bg-primary text-white text-center py-3"> {/* Header berwarna */}
              <h2 className="mb-0 h3">Create Your Account</h2>
            </Card.Header>
            <Card.Body className="p-4 p-lg-5">
              {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerFullName">
                  <Form.Label className="fw-semibold">Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label className="fw-semibold">Email address <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                  <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                </Form.Group>
                
                <Row className="mb-3"> {/* mb-3 untuk spasi antar row field password dan field lain */}
                  <Col md={6}>
                    <Form.Group controlId="registerPassword">
                      <Form.Label className="fw-semibold">Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0"> {/* mt untuk spasi di mobile */}
                    <Form.Group controlId="registerConfirmPassword">
                      <Form.Label className="fw-semibold">Confirm Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4" controlId="registerInstitution">
                  <Form.Label className="fw-semibold">Institution (Optional)</Form.Label>
                  <Form.Control type="text" name="institution" placeholder="Enter your institution or organization" value={formData.institution} onChange={handleChange} />
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Creating Account...</>
                    ) : ( "Register" )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4 pt-2">
                <p className="mb-0 text-muted">
                  Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;