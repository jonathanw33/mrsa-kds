import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      {/* ENHANCEMENT: Menambahkan shadow-lg untuk efek visual lebih kuat, padding vertikal (py-5) sudah cukup */}
      <div className="bg-primary text-white text-center py-5 mb-5 rounded shadow-lg">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}> {/* Sedikit lebih lebar untuk konten hero */}
              <h1 className="display-4 fw-bold mb-3">MRSA Resistance Gene Detector</h1>
              <p className="lead fs-5 mb-4 px-md-5"> {/* fs-5 dan padding horizontal untuk lead text */}
                Identify antibiotic resistance in bacterial samples by analyzing DNA sequences for the presence of resistance genes, focusing primarily on MRSA.
              </p>
              {isAuthenticated ? (
                <Button as={Link} to="/analysis" variant="light" size="lg" className="px-4 py-2 me-2 shadow-sm">
                  Start New Analysis
                </Button>
              ) : (
                <Button as={Link} to="/register" variant="light" size="lg" className="px-4 py-2 me-2 shadow-sm">
                  Get Started
                </Button>
              )}
              <Button as={Link} to="/about" variant="outline-light" size="lg" className="px-4 py-2 shadow-sm">
                Learn More
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col md={8} lg={7}>
               {/* Gambar akan tetap seperti sebelumnya, styling card/image akan mengikuti index.css jika ada */}
              <img
                src="/images/mrsa-illustration.svg" // Pastikan path gambar ini ada dan benar
                alt="MRSA Bacteria Illustration"
                className="img-fluid" // Dihapus rounded agar styling global card (jika ada) tidak bentrok
                style={{ maxHeight: '300px' }} // Maksimum tinggi gambar disesuaikan
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-4"> {/* Padding standar */}
        <h2 className="text-center mb-5 fw-bold h1">Key Features</h2>
        <Row>
          {[
            { title: "Rapid Detection", text: "Quickly identify antibiotic resistance genes in bacterial DNA sequences using advanced alignment algorithms." },
            { title: "Comprehensive Analysis", text: "Get detailed reports including resistance status, confidence scores, and matching regions within the genome." },
            { title: "Treatment Recommendations", text: "Receive AI-powered treatment suggestions based on the identified resistance genes and current best practices." }
          ].map((feature, index) => (
            <Col md={4} className="mb-4 d-flex" key={index}> {/* d-flex untuk tinggi card yang sama jika isinya beda */}
              {/* Card akan otomatis mendapat style dari index.css. Tambahkan interactive-card jika mau efek hover */}
              <Card className="h-100 text-center interactive-card">
                <Card.Body className="p-4 d-flex flex-column">
                  <Card.Title as="h3" className="mb-3">{feature.title}</Card.Title> {/* h3 untuk judul fitur */}
                  <Card.Text className="text-muted flex-grow-1">{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How It Works Section - Menggunakan bg-white agar kontras dengan body #e9ecef */}
      <div className="bg-white py-5 my-5 rounded shadow-sm"> {/* my-5 untuk spasi atas bawah */}
        <Container>
          <h2 className="text-center mb-5 fw-bold h1">How It Works</h2>
          <Row className="align-items-center">
            <Col lg={6} className="order-lg-2 mb-4 mb-lg-0 text-center">
              <img
                src="/images/analysis-workflow.svg" // Pastikan path gambar ini ada
                alt="Analysis Workflow"
                className="img-fluid rounded" // Biarkan rounded jika ini gambar, bukan card
                style={{ maxHeight: '300px' }}
              />
            </Col>
            <Col lg={6} className="order-lg-1">
              {[
                { title: "Upload DNA Sequence", text: "Upload your bacterial DNA sequence in FASTA format." },
                { title: "Sequence Analysis", text: "Our system aligns your sequence against a database of known resistance genes using the BLAST algorithm." },
                { title: "Resistance Assessment", text: "The system evaluates the alignment results to determine the presence of resistance genes." },
                { title: "Get Results & Recommendations", text: "Receive comprehensive results including treatment recommendations based on the identified resistance profile." }
              ].map((step, index) => (
                <div className="d-flex align-items-start mb-4" key={index}> {/* align-items-start agar nomor sejajar atas */}
                  <div className="me-3 mt-1 flex-shrink-0"> {/* flex-shrink-0 agar nomor tidak mengecil */}
                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h4 className="h5 mb-1 fw-semibold">{step.title}</h4>
                    <p className="text-muted mb-0">{step.text}</p>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="text-center py-5">
        <h2 className="mb-4 fw-bold h1">Ready to Get Started?</h2>
        <p className="lead fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          Join our platform to access advanced tools for detecting antibiotic resistance genes in bacterial samples.
        </p>
        {isAuthenticated ? (
          <Button as={Link} to="/analysis" variant="primary" size="lg" className="px-5 py-3"> {/* Tombol primary standar */}
            Start New Analysis
          </Button>
        ) : (
          <Button as={Link} to="/register" variant="primary" size="lg" className="px-5 py-3"> {/* Tombol primary standar */}
            Create Your Account
          </Button>
        )}
      </Container>
    </div>
  );
};

export default HomePage;