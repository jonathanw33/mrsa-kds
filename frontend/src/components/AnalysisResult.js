import React from 'react';
import { Card, Badge, Row, Col, Table, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalysisResult = ({ result }) => {
  if (!result) {
    return <Alert variant="info">No analysis result available.</Alert>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resistant': return 'danger';
      case 'susceptible': return 'success';
      case 'intermediate': return 'warning';
      default: return 'secondary';
    }
  };

  const confidenceScore = result.confidence_score || 0;
  const chartData = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [confidenceScore, 100 - confidenceScore],
        backgroundColor: [
          confidenceScore > 80 ? '#28a745' : confidenceScore > 60 ? '#ffc107' : '#dc3545',
          '#e9ecef',
        ],
        borderColor: [
          confidenceScore > 80 ? '#28a745' : confidenceScore > 60 ? '#ffc107' : '#dc3545',
          '#dee2e6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw?.toFixed(1) || 0}%`;
          }
        }
      }
    }
  };

  return (
    <div> {/* Div pembungkus luar */}
      <Card className="mb-4">
        <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center py-3">
          <h4 className="mb-2 mb-sm-0 fw-semibold">Analysis Summary</h4>
          <Badge bg={getStatusBadge(result.resistance_status)} pill className="px-3 py-2 fs-6">
            {result.resistance_status ? result.resistance_status.charAt(0).toUpperCase() + result.resistance_status.slice(1) : 'N/A'}
          </Badge>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={7} lg={8} className="mb-4 mb-md-0">
              <p className="mb-2"><strong>Sample ID:</strong> {result.sample_id || 'N/A'}</p>
              <p className="mb-3"><strong>Analysis Time:</strong> {formatDate(result.analysis_timestamp || result.savedAt)}</p>
              
              {result.identified_genes && result.identified_genes.length > 0 ? (
                <div className="mb-3">
                  <p className="mb-1"><strong>Identified Resistance Genes:</strong></p>
                  <ul className="list-unstyled ps-3">
                    {result.identified_genes.map((gene, index) => (
                      <li key={index} className="mb-1">{gene}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted"><strong>No specific resistance genes identified.</strong></p>
              )}
            </Col>
            <Col md={5} lg={4} className="text-center">
              <div style={{ maxWidth: '180px', margin: '0 auto' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className="mt-3 text-center">
                <h5 className="mb-1 text-muted small text-uppercase">Confidence Score</h5>
                <h2 className="mb-0 fw-bold display-6">{confidenceScore.toFixed(1)}%</h2>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {result.treatment_recommendations && (
        <Card className="mb-4">
          <Card.Header as="h5" className="py-3 fw-semibold">Treatment Recommendations</Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <h6 className="fw-semibold text-success">Recommended Antibiotics</h6>
                {result.treatment_recommendations.recommended_antibiotics && result.treatment_recommendations.recommended_antibiotics.length > 0 ? (
                  <ul className="list-unstyled ps-3">
                    {result.treatment_recommendations.recommended_antibiotics.map((antibiotic, index) => (
                      <li key={index} className="mb-1">{antibiotic}</li>
                    ))}
                  </ul>
                ) : <p className="text-muted small">No specific recommendations.</p>}
              </Col>
              <Col md={6}>
                <h6 className="fw-semibold text-danger">Antibiotics to Potentially Avoid</h6>
                {result.treatment_recommendations.avoid_antibiotics && result.treatment_recommendations.avoid_antibiotics.length > 0 ? (
                  <ul className="list-unstyled ps-3">
                    {result.treatment_recommendations.avoid_antibiotics.map((antibiotic, index) => (
                      <li key={index} className="mb-1">{antibiotic}</li>
                    ))}
                  </ul>
                ) : <p className="text-muted small">None specified to avoid based on this analysis.</p>}
              </Col>
            </Row>
            {result.treatment_recommendations.notes && (
              <Alert variant="info" className="mt-3 small">
                <strong>Notes:</strong> {result.treatment_recommendations.notes}
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {result.matching_regions && result.matching_regions.length > 0 && (
        <Card>
          <Card.Header as="h5" className="py-3 fw-semibold">Matching Regions (Alignment Details)</Card.Header>
          <div className="table-responsive"> 
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th className="px-3">Gene</th>
                  <th className="px-3">Query Region</th>
                  <th className="px-3">Subject Region</th>
                  <th className="px-3">Identity (%)</th>
                  <th className="px-3">E-value</th>
                </tr>
              </thead>
              <tbody>
                {result.matching_regions.map((region, index) => (
                  <tr key={index}>
                    <td className="px-3">{region.gene_name || 'N/A'}</td>
                    <td className="px-3">{region.query_start} - {region.query_end}</td>
                    <td className="px-3">{region.subject_start} - {region.subject_end}</td>
                    <td className="px-3">{region.percent_identity?.toFixed(2) || 'N/A'}</td>
                    <td className="px-3">{region.evalue?.toExponential(2) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResult;