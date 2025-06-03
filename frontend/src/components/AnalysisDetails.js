import React, { useState } from 'react';
import { Card, Collapse, Button, Table, Badge } from 'react-bootstrap';
import EducationalTooltip from './EducationalTooltip';

const AnalysisDetails = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Debug logging
  console.log('AnalysisDetails result:', result);
  console.log('Matching regions:', result?.matching_regions);

  if (!result || !result.matching_regions) {
    return null;
  }

  const getIdentityColor = (identity) => {
    if (identity >= 95) return 'success';
    if (identity >= 90) return 'info';
    if (identity >= 80) return 'warning';
    return 'danger';
  };

  const formatEValue = (evalue) => {
    if (!evalue || evalue === 0) return '0.00e+0';
    return parseFloat(evalue).toExponential(2);
  };

  return (
    <Card className="analysis-details-card mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🔬 Detailed Analysis Results</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide Details' : 'Show Analysis Details'}
          <span className="ms-1">{showDetails ? '▲' : '▼'}</span>
        </Button>
      </Card.Header>
      
      <Collapse in={showDetails}>
        <div>
          <Card.Body>
            {/* Analysis Summary */}
            <div className="mb-4">
              <h6>📊 Analysis Summary</h6>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Sample ID:</strong> {result.sample_id || 'N/A'}</p>
                  <p><strong>Analysis Date:</strong> {result.analysis_date ? new Date(result.analysis_date).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Resistance Status:</strong> 
                    <Badge bg={result.resistance_status?.toLowerCase() === 'resistant' ? 'danger' : 'success'} className="ms-2">
                      {result.resistance_status}
                    </Badge>
                  </p>
                  <p><strong>Confidence Score:</strong> 
                    <Badge bg="primary" className="ms-2">{result.confidence_score}%</Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* BLAST Alignment Results */}
            <div className="mb-4">
              <h6>🎯 BLAST Alignment Results</h6>
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead className="table-dark">
                    <tr>
                      <th>Gene</th>
                      <th>
                        <EducationalTooltip 
                          term="Query Region" 
                          explanation="The region in your submitted sequence that matched the reference gene"
                        >
                          Query Region
                        </EducationalTooltip>
                      </th>
                      <th>
                        <EducationalTooltip 
                          term="Subject Region" 
                          explanation="The region in the reference gene that matched your sequence"
                        >
                          Subject Region
                        </EducationalTooltip>
                      </th>
                      <th>
                        <EducationalTooltip 
                          term="Identity %" 
                          explanation="Percentage of nucleotides that are identical between your sequence and the reference"
                        >
                          Identity (%)
                        </EducationalTooltip>
                      </th>
                      <th>
                        <EducationalTooltip 
                          term="E-value" 
                          explanation="Statistical significance - lower values indicate more significant matches"
                        >
                          E-value
                        </EducationalTooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matching_regions.map((region, index) => (
                      <tr key={index}>
                        <td>
                          <code>{region.gene_name}</code>
                          {region.percent_identity >= 80 && (
                            <Badge bg="success" className="ms-2 small">Detected</Badge>
                          )}
                        </td>
                        <td>{region.query_start} - {region.query_end}</td>
                        <td>{region.subject_start} - {region.subject_end}</td>
                        <td>
                          <Badge bg={getIdentityColor(region.percent_identity)}>
                            {region.percent_identity?.toFixed(2)}%
                          </Badge>
                        </td>
                        <td>
                          <code className="small">{formatEValue(region.evalue)}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Gene Detection Explanation */}
            <div className="mb-4">
              <h6>💡 How We Determined Resistance Status</h6>
              <Card className="bg-light">
                <Card.Body>
                  <div className="explanation-content">
                    {result.resistance_status?.toLowerCase() === 'resistant' ? (
                      <div>
                        <p className="text-success">
                          <strong>✅ RESISTANT:</strong> Your sequence contains significant matches to known resistance genes.
                        </p>
                        <ul className="small">
                          <li>One or more genes detected with ≥80% sequence identity</li>
                          <li>Detected genes: <strong>{result.identified_genes?.join(', ') || 'None listed'}</strong></li>
                          <li>These genes confer resistance to specific antibiotics (see treatment recommendations)</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-primary">
                          <strong>✅ SUSCEPTIBLE:</strong> No significant resistance genes detected in your sequence.
                        </p>
                        <ul className="small">
                          <li>No genes found with ≥80% sequence identity threshold</li>
                          <li>Sequence likely represents a susceptible bacterial strain</li>
                          <li>Standard antibiotic treatments should be effective</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Technical Information */}
            <div className="mb-3">
              <h6>🔧 Technical Information</h6>
              <div className="row">
                <div className="col-md-6">
                  <Card className="bg-light border-0">
                    <Card.Body className="py-2">
                      <p className="small mb-1"><strong>Algorithm:</strong> NCBI BLAST+</p>
                      <p className="small mb-1"><strong>Database:</strong> 18 resistance gene references</p>
                      <p className="small mb-0"><strong>Identity Threshold:</strong> 80% minimum</p>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card className="bg-light border-0">
                    <Card.Body className="py-2">
                      <p className="small mb-1"><strong>Analysis Method:</strong> Sequence alignment</p>
                      <p className="small mb-1"><strong>Confidence Calculation:</strong> Based on best match identity</p>
                      <p className="small mb-0"><strong>Processing Time:</strong> ~2-5 seconds</p>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default AnalysisDetails;
