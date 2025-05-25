import React from 'react';
import { Card, Badge, Row, Col, Table, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AnalysisResult = ({ result }) => {
  if (!result) {
    return <Alert variant="info">No analysis result available</Alert>;
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get badge variant based on resistance status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'resistant':
        return 'danger';
      case 'susceptible':
        return 'success';
      case 'intermediate':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Prepare data for confidence score chart
  const chartData = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [result.confidence_score, 100 - result.confidence_score],
        backgroundColor: [
          result.confidence_score > 80 ? '#28a745' : result.confidence_score > 60 ? '#ffc107' : '#dc3545',
          '#e9ecef',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analysis-result">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Analysis Result</h4>
          <Badge bg={getStatusBadge(result.resistance_status)} className="fs-6">
            {result.resistance_status.charAt(0).toUpperCase() + result.resistance_status.slice(1)}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p><strong>Sample ID:</strong> {result.sample_id}</p>
              <p><strong>Analysis Time:</strong> {formatDate(result.analysis_timestamp)}</p>
              
              {result.identified_genes && result.identified_genes.length > 0 ? (
                <div className="mb-3">
                  <p><strong>Identified Resistance Genes:</strong></p>
                  <ul>
                    {result.identified_genes.map((gene, index) => (
                      <li key={index}>{gene}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p><strong>No resistance genes identified</strong></p>
              )}
            </Col>
            <Col md={4} className="text-center">
              <div style={{ maxWidth: '200px', margin: '0 auto' }}>
                <Doughnut 
                  data={chartData} 
                  options={{
                    cutout: '70%',
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                          }
                        }
                      }
                    }
                  }}
                />
                <div className="mt-2 text-center">
                  <h5>Confidence Score</h5>
                  <h2 className="mb-0">{result.confidence_score.toFixed(1)}%</h2>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Treatment Recommendations */}
      {result.treatment_recommendations && (
        <Card className="mb-4">
          <Card.Header>
            <h4 className="mb-0">Treatment Recommendations</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Recommended Antibiotics</h5>
                <ul>
                  {result.treatment_recommendations.recommended_antibiotics.map((antibiotic, index) => (
                    <li key={index}>{antibiotic}</li>
                  ))}
                </ul>
              </Col>
              <Col md={6}>
                <h5>Antibiotics to Avoid</h5>
                <ul>
                  {result.treatment_recommendations.avoid_antibiotics.map((antibiotic, index) => (
                    <li key={index}>{antibiotic}</li>
                  ))}
                </ul>
              </Col>
            </Row>
            {result.treatment_recommendations.notes && (
              <Alert variant="info" className="mt-3">
                <strong>Notes:</strong> {result.treatment_recommendations.notes}
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Matching Regions */}
      {result.matching_regions && result.matching_regions.length > 0 && (
        <Card>
          <Card.Header>
            <h4 className="mb-0">Matching Regions</h4>
          </Card.Header>
          <Card.Body>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Gene</th>
                  <th>Query Region</th>
                  <th>Subject Region</th>
                  <th>Identity</th>
                  <th>E-value</th>
                </tr>
              </thead>
              <tbody>
                {result.matching_regions.map((region, index) => (
                  <tr key={index}>
                    <td>{region.gene_name}</td>
                    <td>{region.query_start} - {region.query_end}</td>
                    <td>{region.subject_start} - {region.subject_end}</td>
                    <td>{region.percent_identity.toFixed(2)}%</td>
                    <td>{region.evalue.toExponential(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResult;
