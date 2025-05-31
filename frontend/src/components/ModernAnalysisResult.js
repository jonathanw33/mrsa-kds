import React from 'react';
import { Card, Badge, Row, Col, Table, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ModernAnalysisResult = ({ result }) => {
  if (!result) {
    return (
      <Alert variant="info" className="modern-alert">
        <div className="d-flex align-items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          No analysis result available.
        </div>
      </Alert>
    );
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resistant':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'susceptible':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        );
    }
  };

  const confidenceScore = result.confidence_score || 0;
  const chartData = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [confidenceScore, 100 - confidenceScore],
        backgroundColor: [
          confidenceScore > 80 ? '#10b981' : confidenceScore > 60 ? '#f59e0b' : '#ef4444',
          '#f1f5f9',
        ],
        borderColor: [
          confidenceScore > 80 ? '#10b981' : confidenceScore > 60 ? '#f59e0b' : '#ef4444',
          '#e2e8f0',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: '75%',
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
    <div className="modern-analysis-result">
      {/* Summary Card */}
      <Card className="summary-card shadow-sm mb-4">
        <div className="card-header-modern">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold d-flex align-items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                <path d="M9 11V7a3 3 0 0 1 6 0v4"/>
              </svg>
              Analysis Summary
            </h4>
            <Badge bg={getStatusBadge(result.resistance_status)} className="status-badge">
              <span className="d-flex align-items-center gap-1">
                {getStatusIcon(result.resistance_status)}
                {result.resistance_status ? result.resistance_status.charAt(0).toUpperCase() + result.resistance_status.slice(1) : 'N/A'}
              </span>
            </Badge>
          </div>
        </div>
        
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8} className="mb-4 mb-md-0">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Sample ID
                  </div>
                  <div className="info-value">{result.sample_id || 'N/A'}</div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    Analysis Time
                  </div>
                  <div className="info-value">{formatDate(result.analysis_timestamp || result.savedAt)}</div>
                </div>
                
                <div className="info-item full-width">
                  <div className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    Identified Resistance Genes
                  </div>
                  <div className="info-value">
                    {result.identified_genes && result.identified_genes.length > 0 ? (
                      <div className="gene-badges">
                        {result.identified_genes.map((gene, index) => (
                          <span key={index} className="gene-badge">
                            {gene}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No specific resistance genes identified</span>
                    )}
                  </div>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="text-center">
              <div className="confidence-chart-container">
                <div className="chart-wrapper">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="chart-center">
                    <div className="confidence-score">
                      {confidenceScore.toFixed(1)}%
                    </div>
                    <div className="confidence-label">Confidence</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Treatment Recommendations */}
      {result.treatment_recommendations && (
        <Card className="treatment-card shadow-sm mb-4">
          <div className="card-header-modern">
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Treatment Recommendations
            </h5>
          </div>
          
          <Card.Body className="p-4">
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <div className="recommendation-section recommended">
                  <h6 className="fw-semibold text-success d-flex align-items-center mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    Recommended Antibiotics
                  </h6>
                  {result.treatment_recommendations.recommended_antibiotics && result.treatment_recommendations.recommended_antibiotics.length > 0 ? (
                    <div className="antibiotic-list">
                      {result.treatment_recommendations.recommended_antibiotics.map((antibiotic, index) => (
                        <div key={index} className="antibiotic-item recommended-item">
                          {antibiotic}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small">No specific recommendations available.</p>
                  )}
                </div>
              </Col>
              
              <Col md={6}>
                <div className="recommendation-section avoid">
                  <h6 className="fw-semibold text-danger d-flex align-items-center mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Potentially Avoid
                  </h6>
                  {result.treatment_recommendations.avoid_antibiotics && result.treatment_recommendations.avoid_antibiotics.length > 0 ? (
                    <div className="antibiotic-list">
                      {result.treatment_recommendations.avoid_antibiotics.map((antibiotic, index) => (
                        <div key={index} className="antibiotic-item avoid-item">
                          {antibiotic}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small">None specified based on this analysis.</p>
                  )}
                </div>
              </Col>
            </Row>
            
            {result.treatment_recommendations.notes && (
              <Alert variant="info" className="mt-3 notes-alert">
                <div className="d-flex align-items-start">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2 mt-1 flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  <div>
                    <strong>Clinical Notes:</strong> {result.treatment_recommendations.notes}
                  </div>
                </div>
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Matching Regions */}
      {result.matching_regions && result.matching_regions.length > 0 && (
        <Card className="alignment-card shadow-sm">
          <div className="card-header-modern">
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
              </svg>
              Alignment Details
            </h5>
          </div>
          
          <div className="table-responsive">
            <Table hover className="alignment-table mb-0">
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
                    <td className="px-3">
                      <span className="gene-name">{region.gene_name || 'N/A'}</span>
                    </td>
                    <td className="px-3">
                      <span className="region-span">{region.query_start} - {region.query_end}</span>
                    </td>
                    <td className="px-3">
                      <span className="region-span">{region.subject_start} - {region.subject_end}</span>
                    </td>
                    <td className="px-3">
                      <div className="identity-cell">
                        <span className="identity-value">
                          {region.percent_identity?.toFixed(2) || 'N/A'}%
                        </span>
                        <div className="identity-bar">
                          <div 
                            className="identity-fill" 
                            style={{ width: `${region.percent_identity || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3">
                      <span className="evalue">{region.evalue?.toExponential(2) || 'N/A'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      
      <style jsx>{`
        .modern-analysis-result {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .summary-card, .treatment-card, .alignment-card {
          border: none;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .card-header-modern {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem;
        }
        
        .status-badge {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 600;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .info-item.full-width {
          grid-column: span 2;
        }
        
        .info-label {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .info-value {
          font-weight: 600;
          color: #1e293b;
        }
        
        .gene-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .gene-badge {
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .confidence-chart-container {
          position: relative;
          max-width: 200px;
          margin: 0 auto;
        }
        
        .chart-wrapper {
          position: relative;
        }
        
        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .confidence-score {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }
        
        .confidence-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .recommendation-section {
          height: 100%;
        }
        
        .antibiotic-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .antibiotic-item {
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 500;
          border-left: 4px solid;
        }
        
        .recommended-item {
          background: #f0fdf4;
          border-left-color: #10b981;
          color: #065f46;
        }
        
        .avoid-item {
          background: #fef2f2;
          border-left-color: #ef4444;
          color: #991b1b;
        }
        
        .notes-alert {
          border: none;
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
        }
        
        .alignment-table {
          font-size: 0.9rem;
        }
        
        .alignment-table th {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }
        
        .gene-name {
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .region-span {
          font-family: 'Courier New', monospace;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .identity-cell {
          min-width: 120px;
        }
        
        .identity-value {
          font-weight: 600;
          color: #1e293b;
        }
        
        .identity-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.25rem;
        }
        
        .identity-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .evalue {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .modern-alert {
          border: none;
          border-radius: 12px;
          border-left: 4px solid #0ea5e9;
        }
        
        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .info-item.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernAnalysisResult;