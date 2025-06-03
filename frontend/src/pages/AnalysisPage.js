import React, { useState } from 'react';
import { Container, Card, Form, Alert, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModernFileUpload from '../components/ModernFileUpload'; 
import ModernAnalysisResult from '../components/ModernAnalysisResult'; 
import AnalysisProgress from '../components/AnalysisProgress';
import HowItWorksModal from '../components/HowItWorksModal';
import AnalysisDetails from '../components/AnalysisDetails';
import EducationalTooltip from '../components/EducationalTooltip';
import { analysisService } from '../services/apiService';
import '../styles/educational.css';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [threshold, setThreshold] = useState(0.75);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setAnalyzing(true);
    setError(null);
    setResult(null); // Clear previous results
    try {
      const response = await analysisService.analyzeSequence(file, threshold);
      setResult(response.data);
      // Simpan ke local storage
      const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
      const resultWithTimestamp = { ...response.data, savedAt: new Date().toISOString() };
      savedResults.unshift(resultWithTimestamp);
      localStorage.setItem('analysisResults', JSON.stringify(savedResults.slice(0, 10)));
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
    setAnalyzing(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={result ? 10 : 8} xl={result ? 9 : 7}>
          {!result ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold mb-0">Sequence Analysis</h1>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => setShowHowItWorks(true)}
                  className="how-it-works-btn"
                >
                  🧬 How It Works
                </Button>
              </div>
              
              <Card className="shadow-lg upload-with-education">
                <Card.Header as="h2" className="h5 py-3 text-center bg-primary text-white">
                  Upload Sequence for Analysis
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                  {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                  
                  <p className="text-center text-muted mb-4">
                    Upload a bacterial DNA sequence in{' '}
                    <EducationalTooltip 
                      term="FASTA Format" 
                      explanation="A text-based format for representing nucleotide sequences, starting with '>' followed by a description line and the sequence data"
                    >
                      FASTA format
                    </EducationalTooltip>{' '}
                    to identify resistance markers using{' '}
                    <EducationalTooltip 
                      term="BLAST Algorithm" 
                      explanation="Basic Local Alignment Search Tool - compares your sequence against our database of known resistance genes"
                    >
                      BLAST analysis
                    </EducationalTooltip>.
                  </p>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <EducationalTooltip 
                        term="Detection Threshold" 
                        explanation="Minimum sequence similarity percentage required to consider a gene as detected. Higher values are more stringent."
                      >
                        Detection Threshold
                      </EducationalTooltip>: <span className="fw-bold" style={{color: 'var(--primary-color)'}}>{threshold.toFixed(2)}</span>
                    </Form.Label>
                    <Form.Range 
                      min={0.5} max={0.95} step={0.05}
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      id="thresholdRange"
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>0.50 (More sensitive)</span>
                      <span>0.95 (More specific)</span>
                    </div>
                  </Form.Group>
                  
                  <ModernFileUpload 
                    onFileUploaded={handleFileUpload}
                    acceptedFormats={['.fasta', '.fa', '.fna']}
                    disabled={loading}
                  />
                  
                  {loading && !analyzing && (
                    <div className="text-center mt-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="text-muted mt-2">Analyzing... Please wait.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              {/* Analysis Progress Component */}
              <AnalysisProgress 
                isAnalyzing={analyzing} 
                onComplete={() => setAnalyzing(false)}
              />
              
              {/* How It Works Modal */}
              <HowItWorksModal 
                show={showHowItWorks} 
                onHide={() => setShowHowItWorks(false)} 
              />
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold mb-0">Analysis Complete</h1>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => setShowHowItWorks(true)}
                >
                  🧬 How It Works
                </Button>
              </div>
              
              <Card className="shadow-lg results-with-education">
                <Card.Body className="p-4 p-md-5">
                  <ModernAnalysisResult result={result} />
                  
                  {/* Analysis Details Component */}
                  <AnalysisDetails result={result} />
                  
                  <hr className="my-4"/>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" size="lg" onClick={() => navigate('/history')}>
                      View History
                    </Button>
                    <Button variant="outline-secondary" size="lg" onClick={handleNewAnalysis}>
                      New Analysis
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              {/* How It Works Modal for Results Page */}
              <HowItWorksModal 
                show={showHowItWorks} 
                onHide={() => setShowHowItWorks(false)} 
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisPage;