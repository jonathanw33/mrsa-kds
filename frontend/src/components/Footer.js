import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>MRSA Resistance Gene Detector</h5>
            <p className="text-muted">
              A tool for detecting antibiotic resistance genes in Staphylococcus aureus (MRSA)
            </p>
          </Col>
          <Col md={3}>
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/about" className="text-light">About</a></li>
              <li><a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-light">NCBI</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Developers</h5>
            <ul className="list-unstyled">
              <li>Jonathan Wiguna (18222019)</li>
              <li>Harry Truman Suhalim (18222081)</li>
              <li>Steven Adrian Corne (18222101)</li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-secondary" />
        <div className="text-center">
          <p className="mb-0">© {new Date().getFullYear()} MRSA Resistance Gene Detector. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
