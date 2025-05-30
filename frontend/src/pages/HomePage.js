import React from 'react';
// HANYA MENGGUNAKAN LIBRARY REACT-BOOTSTRAP
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// HANYA MENGGUNAKAN LIBRARY REACT-ROUTER-DOM
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// TIDAK ADA LAGI IMPORT REACT-BOOTSTRAP-ICONS

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { 
      title: "Rapid Detection", 
      text: "Quickly identify antibiotic resistance genes in bacterial DNA sequences using advanced alignment algorithms." 
    },
    { 
      title: "Comprehensive Analysis", 
      text: "Get detailed reports including resistance status, confidence scores, and matching regions within the genome." 
    },
    { 
      title: "Smart Recommendations", 
      text: "Receive AI-powered treatment suggestions based on the identified resistance genes and current best practices." 
    }
  ];

  const steps = [
    { title: "Upload DNA Sequence", text: "Upload your bacterial DNA sequence in FASTA format." },
    { title: "Sequence Analysis", text: "Our system aligns your sequence against a database of known resistance genes using the BLAST algorithm." },
    { title: "Resistance Assessment", text: "The system evaluates the alignment results to determine the presence of resistance genes." },
    { title: "Get Results & Recommendations", text: "Receive comprehensive results including treatment recommendations based on the identified resistance profile." }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-white text-center mb-5">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-4 text-white">Unlock the Secrets of MRSA Resistance</h1>
              <p className="lead fs-4 mb-5">
                Analyze DNA sequences to identify antibiotic resistance genes. Empower your research with fast, accurate, and actionable insights.
              </p>
              {isAuthenticated ? (
                <Button as={Link} to="/analysis" variant="light" size="lg" className="me-2">
                  Start New Analysis
                </Button>
              ) : (
                <Button as={Link} to="/register" variant="light" size="lg" className="me-2">
                  Get Started Free
                </Button>
              )}
              <Button as={Link} to="/about" variant="outline-light" size="lg">
                Learn More
              </Button>
            </Col>
            <Col lg={10} className="mt-5">
               <img
                src="/images/mrsa-illustration.svg" 
                alt="MRSA Bacteria Illustration"
                className="img-fluid"
                style={{ maxHeight: '320px' }} 
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section - Menggunakan Angka sebagai pengganti ikon */}
      <Container className="py-5">
        <h2 className="text-center mb-5 h1">Why Choose Our Platform?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={4} className="mb-4 d-flex" key={index}>
              <Card className="h-100 text-center interactive-card">
                <Card.Body className="p-5 d-flex flex-column">
                  {/* PENGGANTI IKON: Bulatan Angka dengan CSS */}
                  <div className="feature-number">{index + 1}</div>
                  <Card.Title as="h3" className="mb-3">{feature.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="how-it-works-section bg-white">
        <Container>
          <h2 className="text-center mb-5 h1">A Simple Path to Discovery</h2>
          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0 text-center">
              <img
                src="/images/analysis-workflow.svg"
                alt="Analysis Workflow"
                className="img-fluid"
                style={{ maxHeight: '400px' }}
              />
            </Col>
            <Col lg={7}>
              <div className="timeline">
                {steps.map((step, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker">{index + 1}</div>
                    <div className="timeline-content">
                      <h4 className="h5 mb-1 fw-semibold">{step.title}</h4>
                      <p className="text-muted mb-0">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="text-center py-5 my-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="mb-4 h1">Ready to Start Your Analysis?</h2>
            <p className="lead fs-5 text-muted mb-4">
              Join our platform today and gain access to advanced tools for detecting antibiotic resistance. Your next breakthrough is just a sequence away.
            </p>
            {isAuthenticated ? (
              <Button as={Link} to="/analysis" variant="primary" size="lg">
                Go To Dashboard
              </Button>
            ) : (
              <Button as={Link} to="/register" variant="primary" size="lg">
                Create Your Free Account
              </Button>
            )}
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default HomePage;