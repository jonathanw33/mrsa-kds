import React from 'react';
import { Container, Row, Col, Card, ListGroup, Accordion } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-4"> {/* Padding standar dari App.js */}
      <Row className="justify-content-center mb-4">
        <Col lg={10} className="text-center">
          <h1 className="fw-bold mb-3">About MRSA Resistance Gene Detector</h1>
          <p className="lead text-muted">
            A specialized tool for identifying antibiotic resistance by analyzing DNA sequences, focusing on MRSA.
          </p>
        </Col>
      </Row>
      
      <Card className="mb-4"> {/* Konten dibungkus Card agar mendapat styling global */}
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col lg={7} className="mb-3 mb-lg-0">
              <h2 className="h4 mb-3 fw-semibold text-primary">Project Overview</h2> {/* text-primary untuk subjudul */}
              <p>
                The MRSA Resistance Gene Detector is a specialized tool designed to identify antibiotic resistance in bacterial samples by analyzing DNA sequences for the presence of resistance genes, focusing primarily on Methicillin-Resistant Staphylococcus aureus (MRSA).
              </p>
              <p>
                Using advanced sequence alignment algorithms, our tool can quickly identify key resistance markers such as the mecA gene (~2kb) that confers resistance to beta-lactam antibiotics, including methicillin.
              </p>
              <p className="mb-0"> {/* mb-0 jika ini paragraf terakhir di section overview */}
                This tool helps laboratories quickly screen bacterial samples for antibiotic resistance, enabling faster treatment decisions and better antibiotic stewardship.
              </p>
            </Col>
            <Col lg={5} className="text-center">
              <img 
                src="/images/mrsa-microscope.jpg" 
                alt="MRSA under microscope" 
                className="img-fluid rounded shadow-sm" /* Tambah shadow-sm pada gambar */
                style={{maxHeight: '300px'}}
              />
              <p className="text-muted mt-2"><small>Microscopic view of MRSA bacteria</small></p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header as="h4" className="fw-semibold text-primary">Technical Approach</Card.Header>
        <Card.Body>
          {/* Accordion akan mendapat styling dari .card di index.css untuk item-itemnya jika distrukturkan sebagai card */}
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0" className="border-bottom"> {/* Beri border antar item jika flush */}
              <Accordion.Header>Data Sources</Accordion.Header>
              <Accordion.Body className="pb-3 pt-1"> {/* Sesuaikan padding body accordion */}
                <p className="mb-2">Our tool utilizes reference data from established sources:</p>
                <ul>
                  <li>Reference database of resistance genes (particularly mecA ~2kb)</li>
                  <li>Source: National Center for Biotechnology Information (NCBI) GenBank</li>
                  <li>Database size: ~50 reference sequences (stored locally or accessed via the NCBI API)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="border-bottom">
              <Accordion.Header>Computing Methods</Accordion.Header>
              <Accordion.Body className="pb-3 pt-1">
                <p className="mb-2">Our analysis utilizes sophisticated bioinformatics approaches:</p>
                <ul>
                  <li><strong>Sequence alignment:</strong> Using the BLAST algorithm to align query sequences against reference resistance genes</li>
                  <li><strong>Pattern matching:</strong> Identifying key resistance markers through sequence homology</li>
                  <li><strong>Statistical analysis:</strong> Calculating alignment scores and confidence metrics for resistance determination</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2"> {/* Item terakhir tidak perlu border-bottom jika flush */}
              <Accordion.Header>Input/Output System</Accordion.Header>
              <Accordion.Body className="pb-3 pt-1">
                <p className="mb-1"><strong>Input:</strong></p>
                <ul>
                  <li>FASTA file containing bacterial DNA sequence</li>
                </ul>
                <p className="mb-1 mt-2"><strong>Output:</strong></p>
                <ul>
                  <li>Resistance status (Resistant/Susceptible)</li>
                  <li>Confidence score (0-100%)</li>
                  <li>Alignment results showing matching regions</li>
                  <li>Treatment recommendations (utilizing AI for personalized suggestions)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header as="h4" className="fw-semibold text-primary">Development Team</Card.Header>
        <ListGroup variant="flush">
          {[
            { name: "Jonathan Wiguna", id: "18222019", role: "Backend Development, Sequence Analysis" },
            { name: "Harry Truman Suhalim", id: "18222081", role: "Frontend Development, User Interface" },
            { name: "Steven Adrian Corne", id: "18222101", role: "Data Processing, Algorithm Implementation" }
          ].map((member, index) => (
            <ListGroup.Item key={index} className="px-3 py-3 d-flex justify-content-between align-items-start"> {/* Padding disesuaikan */}
              <div>
                <div className="fw-bold">{member.name}</div>
                <div className="text-muted small">Student ID: {member.id}</div>
              </div>
              <div className="text-end">
                <small className="text-muted">{member.role}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      
      <Card>
        <Card.Header as="h4" className="fw-semibold text-primary">References & Resources</Card.Header>
        <ListGroup variant="flush">
          {[
            { name: "NCBI GenBank", text: "Source of reference sequences for resistance genes", url: "https://www.ncbi.nlm.nih.gov/genbank/" },
            { name: "BLAST Algorithm", text: "Used for sequence alignment", url: "https://blast.ncbi.nlm.nih.gov/Blast.cgi" },
            { name: "CDC - MRSA Information", text: "Background on MRSA", url: "https://www.cdc.gov/mrsa/index.html" },
            { name: "Biopython", text: "Python tools for computational molecular biology", url: "https://biopython.org/" }
          ].map((ref, index) => (
            <ListGroup.Item key={index} className="px-3 py-3"> {/* Padding disesuaikan */}
              <strong>{ref.name}</strong> - <span className="text-muted">{ref.text}</span>
              <br />
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none small">
                {ref.url}
              </a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default AboutPage;