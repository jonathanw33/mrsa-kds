import React from 'react';
import { Container, Row, Col, Card, ListGroup, Accordion } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">About MRSA Resistance Gene Detector</h1>
      
      <Row className="mb-5">
        <Col lg={8}>
          <h2 className="h4 mb-3">Project Overview</h2>
          <p>
            The MRSA Resistance Gene Detector is a specialized tool designed to identify antibiotic resistance in bacterial samples by analyzing DNA sequences for the presence of resistance genes, focusing primarily on Methicillin-Resistant Staphylococcus aureus (MRSA).
          </p>
          <p>
            Using advanced sequence alignment algorithms, our tool can quickly identify key resistance markers such as the mecA gene (~2kb) that confers resistance to beta-lactam antibiotics, including methicillin.
          </p>
          <p>
            This tool helps laboratories quickly screen bacterial samples for antibiotic resistance, enabling faster treatment decisions and better antibiotic stewardship.
          </p>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow">
            <Card.Img variant="top" src="/images/mrsa-microscope.jpg" alt="MRSA under microscope" />
            <Card.Body className="bg-light">
              <Card.Text className="text-center">
                <small>Microscopic view of MRSA (Methicillin-Resistant Staphylococcus aureus) bacteria</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <h2 className="h4 mb-3">Technical Approach</h2>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Data Sources</Accordion.Header>
              <Accordion.Body>
                <p>Our tool utilizes reference data from established sources:</p>
                <ul>
                  <li>Reference database of resistance genes (particularly mecA ~2kb)</li>
                  <li>Source: National Center for Biotechnology Information (NCBI) GenBank</li>
                  <li>Database size: ~50 reference sequences (stored locally or accessed via the NCBI API)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Computing Methods</Accordion.Header>
              <Accordion.Body>
                <p>Our analysis utilizes sophisticated bioinformatics approaches:</p>
                <ul>
                  <li><strong>Sequence alignment:</strong> Using the BLAST algorithm to align query sequences against reference resistance genes</li>
                  <li><strong>Pattern matching:</strong> Identifying key resistance markers through sequence homology</li>
                  <li><strong>Statistical analysis:</strong> Calculating alignment scores and confidence metrics for resistance determination</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Input/Output System</Accordion.Header>
              <Accordion.Body>
                <p><strong>Input:</strong></p>
                <ul>
                  <li>FASTA file containing bacterial DNA sequence</li>
                </ul>
                <p><strong>Output:</strong></p>
                <ul>
                  <li>Resistance status (Resistant/Susceptible)</li>
                  <li>Confidence score (0-100%)</li>
                  <li>Alignment results showing matching regions</li>
                  <li>Treatment recommendations (utilizing AI for personalized suggestions)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <h2 className="h4 mb-3">Development Team</h2>
          <p>This project was developed by a team of students from Institut Teknologi Bandung (ITB):</p>
          <ListGroup>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-bold">Jonathan Wiguna</div>
                <div className="text-muted">Student ID: 18222019</div>
              </div>
              <div>Backend Development, Sequence Analysis</div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-bold">Harry Truman Suhalim</div>
                <div className="text-muted">Student ID: 18222081</div>
              </div>
              <div>Frontend Development, User Interface</div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-bold">Steven Adrian Corne</div>
                <div className="text-muted">Student ID: 18222101</div>
              </div>
              <div>Data Processing, Algorithm Implementation</div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <h2 className="h4 mb-3">References & Resources</h2>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>NCBI GenBank</strong> - Source of reference sequences for resistance genes
                  <br />
                  <a href="https://www.ncbi.nlm.nih.gov/genbank/" target="_blank" rel="noopener noreferrer">
                    https://www.ncbi.nlm.nih.gov/genbank/
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>BLAST Algorithm</strong> - Used for sequence alignment
                  <br />
                  <a href="https://blast.ncbi.nlm.nih.gov/Blast.cgi" target="_blank" rel="noopener noreferrer">
                    https://blast.ncbi.nlm.nih.gov/Blast.cgi
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>CDC - MRSA Information</strong> - Background on MRSA
                  <br />
                  <a href="https://www.cdc.gov/mrsa/index.html" target="_blank" rel="noopener noreferrer">
                    https://www.cdc.gov/mrsa/index.html
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Biopython</strong> - Python tools for computational molecular biology
                  <br />
                  <a href="https://biopython.org/" target="_blank" rel="noopener noreferrer">
                    https://biopython.org/
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
