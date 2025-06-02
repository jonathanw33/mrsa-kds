import React from 'react';
import { Container, Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-5">
      {/* --- Bagian Header --- */}
      <Row className="justify-content-center mb-5">
        <Col lg={10} className="text-center">
          <h1 className="display-4 fw-bold mb-3">About The Project</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            A specialized tool for identifying antibiotic resistance by analyzing DNA sequences, with a primary focus on MRSA.
          </p>
        </Col>
      </Row>
      
      {/* --- Bagian Overview --- */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4 p-lg-5">
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <h2 className="h3 mb-3 fw-bold">Project Overview</h2>
              <p>
                The MRSA Resistance Gene Detector is a tool designed to identify antibiotic resistance in bacterial samples by analyzing DNA sequences. It focuses primarily on Methicillin-Resistant Staphylococcus aureus (MRSA).
              </p>
              <p>
                Using advanced sequence alignment algorithms like BLAST, our tool quickly identifies key resistance markers, such as the <strong>mecA gene</strong>, which confers resistance to beta-lactam antibiotics.
              </p>
              <p className="mb-0">
                This tool helps laboratories screen bacterial samples efficiently, enabling faster treatment decisions and promoting better antibiotic stewardship.
              </p>
            </Col>
            <Col lg={5} className="text-center">
              <img 
                src="/images/MRSA_microscope.jpg" 
                alt="MRSA under microscope" 
                className="img-fluid rounded-3 shadow"
                style={{maxHeight: '300px'}}
              />
              <p className="text-muted mt-2 fst-italic"><small>Microscopic view of MRSA bacteria.</small></p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* --- Bagian Technical & Team dalam Dua Kolom --- */}
      <Row>
        <Col lg={7}>
          {/* --- Bagian Technical Approach --- */}
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h3" className="py-3 h5">Technical Approach</Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Data Sources</Accordion.Header>
                  <Accordion.Body>
                    Our tool utilizes reference data from the <strong>National Center for Biotechnology Information (NCBI) GenBank</strong>, focusing on a curated database of resistance genes like mecA.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Computing Methods</Accordion.Header>
                  <Accordion.Body>
                    We employ the <strong>BLAST algorithm</strong> for sequence alignment, pattern matching to identify resistance markers, and statistical analysis to calculate confidence scores.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Input & Output</Accordion.Header>
                  <Accordion.Body>
                    <strong>Input:</strong> A FASTA file containing a bacterial DNA sequence.
                    <br/>
                    <strong>Output:</strong> A detailed report including resistance status, confidence score, matching gene regions, and AI-powered treatment recommendations.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          {/* --- Bagian Team --- */}
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h3" className="py-3 h5">Development Team</Card.Header>
            <ListGroup variant="flush">
              {[
                { name: "Jonathan Wiguna", id: "18222019", role: "Backend, Sequence Analysis" },
                { name: "Harry Truman Suhalim", id: "18222081", role: "Frontend, UI/UX" },
                { name: "Steven Adrian Corne", id: "18222101", role: "Data, Algorithm" }
              ].map((member, index) => (
                <ListGroup.Item key={index} className="px-3 py-3">
                  <div className="d-flex justify-content-between">
                    <div className="fw-bold">{member.name}</div>
                    <small className="text-muted">{member.id}</small>
                  </div>
                  <div className="text-muted small">{member.role}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* --- Bagian Referensi --- */}
       <Card className="shadow-sm">
        <Card.Header as="h3" className="py-3 h5">References & Resources</Card.Header>
        <ListGroup variant="flush">
          {[
            { name: "NCBI GenBank", text: "Source of reference sequences.", url: "https://www.ncbi.nlm.nih.gov/genbank/" },
            { name: "BLAST Algorithm", text: "Core tool for sequence alignment.", url: "https://blast.ncbi.nlm.nih.gov/Blast.cgi" }
          ].map((ref, index) => (
            <ListGroup.Item key={index} className="p-3">
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

