import React from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import EducationalTooltip from './EducationalTooltip';

const HowItWorksModal = ({ show, onHide }) => {
  const steps = [
    {
      number: 1,
      title: "Sequence Upload",
      description: "Your DNA sequence is uploaded and validated for proper FASTA format.",
      icon: "📄",
      details: "We accept sequences in FASTA format containing nucleotide data (A, T, G, C)."
    },
    {
      number: 2,
      title: "BLAST Alignment",
      description: "Your sequence is compared against our database of 18 known resistance genes.",
      icon: "🔍",
      details: "Uses NCBI BLAST+ algorithm to find regions of similarity between your sequence and reference genes."
    },
    {
      number: 3,
      title: "Identity Analysis",
      description: "We analyze the alignment quality and calculate sequence identity percentages.",
      icon: "📊",
      details: "Genes with ≥80% identity are considered significant matches indicating resistance."
    },
    {
      number: 4,
      title: "Result Generation",
      description: "Confidence scores and treatment recommendations are generated based on detected genes.",
      icon: "🎯",
      details: "Higher identity percentages result in higher confidence scores for more reliable results."
    }
  ];

  const resistanceGenes = [
    { gene: "mecA", function: "Methicillin resistance (β-lactam antibiotics)", threshold: "80%" },
    { gene: "mecC", function: "Alternative methicillin resistance", threshold: "80%" },
    { gene: "ermA", function: "Erythromycin resistance (macrolide antibiotics)", threshold: "80%" },
    { gene: "ermC", function: "Erythromycin resistance (macrolide antibiotics)", threshold: "80%" },
    { gene: "vanA", function: "Vancomycin resistance", threshold: "80%" },
    { gene: "tetK", function: "Tetracycline resistance", threshold: "80%" }
  ];

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🧬 How Resistance Gene Detection Works</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Main Process Flow */}
        <div className="mb-5">
          <h5 className="mb-4">Analysis Process</h5>
          <Row>
            {steps.map((step, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="h-100 text-center process-step-card">
                  <Card.Body>
                    <div className="step-icon" style={{ fontSize: '2rem' }}>{step.icon}</div>
                    <div className="step-number-badge">{step.number}</div>
                    <Card.Title className="h6 mt-3">{step.title}</Card.Title>
                    <Card.Text className="small text-muted">{step.description}</Card.Text>
                    <div className="step-details">
                      <small className="text-primary">{step.details}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Technical Details */}
        <div className="mb-5">
          <h5 className="mb-3">Technical Details</h5>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header><strong>Algorithm Used</strong></Card.Header>
                <Card.Body>
                  <p>
                    <EducationalTooltip 
                      term="BLAST" 
                      explanation="Basic Local Alignment Search Tool - finds regions of similarity between sequences"
                    >
                      BLAST (Basic Local Alignment Search Tool)
                    </EducationalTooltip> is used to compare your sequence against our reference database.
                  </p>
                  <ul className="small">
                    <li><strong>Database:</strong> 18 curated resistance gene references</li>
                    <li><strong>Threshold:</strong> 80% sequence identity minimum</li>
                    <li><strong>E-value:</strong> Statistical significance measure</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header><strong>Confidence Scoring</strong></Card.Header>
                <Card.Body>
                  <p>
                    Confidence scores are calculated based on 
                    <EducationalTooltip 
                      term="Sequence Identity" 
                      explanation="Percentage of nucleotides that match between your sequence and the reference gene"
                    >
                      sequence identity percentage
                    </EducationalTooltip> and alignment quality.
                  </p>
                  <ul className="small">
                    <li><strong>90-100%:</strong> Very high confidence</li>
                    <li><strong>85-90%:</strong> High confidence</li>
                    <li><strong>80-85%:</strong> Moderate confidence</li>
                    <li><strong>&lt;80%:</strong> Not considered resistant</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Resistance Genes Database */}
        <div className="mb-4">
          <h5 className="mb-3">Resistance Genes in Our Database</h5>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead className="table-dark">
                <tr>
                  <th>Gene</th>
                  <th>Resistance Function</th>
                  <th>Detection Threshold</th>
                </tr>
              </thead>
              <tbody>
                {resistanceGenes.map((gene, index) => (
                  <tr key={index}>
                    <td><code>{gene.gene}</code></td>
                    <td>{gene.function}</td>
                    <td>{gene.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Limitations */}
        <div className="mb-3">
          <Card className="border-warning">
            <Card.Header className="bg-warning text-dark">
              <strong>⚠️ Important Limitations</strong>
            </Card.Header>
            <Card.Body>
              <ul className="mb-0 small">
                <li>This tool is for research purposes only - not for clinical diagnosis</li>
                <li>Results should be validated with laboratory testing</li>
                <li>Novel or highly variant genes may not be detected</li>
                <li>Consult healthcare professionals for treatment decisions</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Got it! Start Analysis
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HowItWorksModal;
