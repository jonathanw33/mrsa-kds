import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold">MRSA Resistance Gene Detector</h1>
              <p className="lead">
                Identify antibiotic resistance in bacterial samples by analyzing DNA sequences for the presence of resistance genes, focusing primarily on MRSA.
              </p>
              {isAuthenticated ? (
                <Button as={Link} to="/analysis" variant="light" size="lg" className="me-2">
                  Start New Analysis
                </Button>
              ) : (
                <Button as={Link} to="/register" variant="light" size="lg" className="me-2">
                  Get Started
                </Button>
              )}
              <Button as={Link} to="/about" variant="outline-light" size="lg">
                Learn More
              </Button>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <img
                src="/images/mrsa-illustration.svg"
                alt="MRSA Bacteria Illustration"
                className="img-fluid"
                style={{ maxHeight: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Key Features</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-search fs-1 text-primary"></i>
                </div>
                <Card.Title>Rapid Detection</Card.Title>
                <Card.Text>
                  Quickly identify antibiotic resistance genes in bacterial DNA sequences using advanced alignment algorithms.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-clipboard-data fs-1 text-primary"></i>
                </div>
                <Card.Title>Comprehensive Analysis</Card.Title>
                <Card.Text>
                  Get detailed reports including resistance status, confidence scores, and matching regions within the genome.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-clipboard-pulse fs-1 text-primary"></i>
                </div>
                <Card.Title>Treatment Recommendations</Card.Title>
                <Card.Text>
                  Receive AI-powered treatment suggestions based on the identified resistance genes and current best practices.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="align-items-center">
            <Col lg={6} className="order-lg-2 mb-4 mb-lg-0">
              <img
                src="/images/analysis-workflow.svg"
                alt="Analysis Workflow"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={6} className="order-lg-1">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    1
                  </div>
                </div>
                <div>
                  <h4>Upload DNA Sequence</h4>
                  <p>Upload your bacterial DNA sequence in FASTA format.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    2
                  </div>
                </div>
                <div>
                  <h4>Sequence Analysis</h4>
                  <p>Our system aligns your sequence against a database of known resistance genes using the BLAST algorithm.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    3
                  </div>
                </div>
                <div>
                  <h4>Resistance Assessment</h4>
                  <p>The system evaluates the alignment results to determine the presence of resistance genes.</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    4
                  </div>
                </div>
                <div>
                  <h4>Treatment Recommendations</h4>
                  <p>Receive comprehensive results including treatment recommendations based on the identified resistance profile.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="text-center mb-5">
        <h2 className="mb-4">Ready to Get Started?</h2>
        <p className="lead mb-4">
          Join our platform to access advanced tools for detecting antibiotic resistance genes in bacterial samples.
        </p>
        {isAuthenticated ? (
          <Button as={Link} to="/analysis" variant="primary" size="lg">
            Start New Analysis
          </Button>
        ) : (
          <Button as={Link} to="/register" variant="primary" size="lg">
            Create Your Account
          </Button>
        )}
      </Container>
    </div>
  );
};

export default HomePage;
