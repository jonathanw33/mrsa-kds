import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={10} lg={8}>
          <Card className="text-center shadow-lg p-4 p-md-5 border-0">
            <Card.Body>
              <h1 className="display-1 fw-bolder mb-3" style={{color: 'var(--primary-color)'}}>404</h1>
              <h2 className="display-5 fw-bold mb-3">Page Not Found</h2>
              <p className="lead text-muted mb-5">
                The page you are looking for doesn't exist or has been moved.
              </p>
              <Button as={Link} to="/" variant="primary" size="lg">
                Go to Homepage
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;