import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap'; // Tambah Card
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="py-5 d-flex align-items-center justify-content-center" style={{minHeight: 'calc(100vh - 160px)'}}>
      <Row className="justify-content-center w-100">
        <Col md={10} lg={8} xl={6}>
          <Card className="text-center shadow-lg p-4 p-md-5"> {/* Card untuk 404 */}
            <Card.Body>
              {/* Bisa tambahkan ilustrasi SVG sederhana di sini jika ada */}
              <h1 className="display-1 fw-bolder text-primary mb-3">404</h1> {/* fw-bolder */}
              <h2 className="mb-3 display-4">Oops! Page Not Found.</h2> {/* display-4 */}
              <p className="lead text-muted mb-5 mx-auto" style={{maxWidth: '500px'}}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <Button as={Link} to="/" variant="primary" size="lg" className="px-4"> {/* px-4 padding x */}
                  Go to Homepage
                </Button>
                <Button as={Link} to="/analysis" variant="outline-secondary" size="lg" className="px-4">
                  Start New Analysis
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;