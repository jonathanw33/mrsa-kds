import React, { useState } from 'react';
import { Container, Card, Form, Alert, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModernFileUpload from '../components/ModernFileUpload'; 
import ModernAnalysisResult from '../components/ModernAnalysisResult'; 
import { analysisService } from '../services/apiService';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [threshold, setThreshold] = useState(0.75);

  const handleFileUpload = async (file) => {
    setLoading(true);
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
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={result ? 10 : 8} xl={result ? 9 : 7}>
          {!result ? (
            <>
              <h1 className="fw-bold text-center mb-4">Sequence Analysis</h1>
              <Card className="shadow-lg">
                <Card.Header as="h2" className="h5 py-3 text-center bg-primary text-white">
                  Upload Sequence for Analysis
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                  {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                  <p className="text-center text-muted mb-4">
                    Upload a bacterial DNA sequence in FASTA format to identify resistance markers.
                  </p>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Detection Threshold: <span className="fw-bold" style={{color: 'var(--primary-color)'}}>{threshold.toFixed(2)}</span></Form.Label>
                    <Form.Range 
                      min={0.5} max={0.95} step={0.05}
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      id="thresholdRange"
                    />
                  </Form.Group>
                  
                  <ModernFileUpload 
                    onFileUploaded={handleFileUpload}
                    acceptedFormats={['.fasta', '.fa', '.fna']}
                    disabled={loading}
                  />
                  
                  {loading && (
                    <div className="text-center mt-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="text-muted mt-2">Analyzing... Please wait.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          ) : (
            <>
              <h1 className="fw-bold text-center mb-4">Analysis Complete</h1>
              <Card className="shadow-lg">
                <Card.Body className="p-4 p-md-5">
                  <ModernAnalysisResult result={result} />
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
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisPage;