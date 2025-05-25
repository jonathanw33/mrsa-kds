import React, { useState } from 'react';
import { Container, Card, Form, Alert, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload'; 
import AnalysisResult from '../components/AnalysisResult'; 
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
    try {
      const response = await analysisService.analyzeSequence(file, threshold);
      setResult(response.data);
      const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
      const resultWithTimestamp = { ...response.data, savedAt: new Date().toISOString() };
      savedResults.unshift(resultWithTimestamp);
      const trimmedResults = savedResults.slice(0, 10);
      localStorage.setItem('analysisResults', JSON.stringify(trimmedResults));
    } catch (err) {
      setError(err.response?.data?.detail || 'Error analyzing sequence');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = () => navigate('/history');
  const handleNewAnalysis = () => { setResult(null); setError(null); };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={result ? 10 : 8}> {/* Kolom lebih lebar jika hasil ditampilkan */}
          <h1 className="mb-4 text-center fw-bold">Sequence Analysis</h1>
          
          {!result ? (
            <Card> {/* Card akan otomatis mendapat style dari index.css */}
              <Card.Header as="h5" className="py-3 fw-semibold"> {/* fw-semibold untuk header */}
                Upload Sequence for Analysis
              </Card.Header>
              <Card.Body className="p-4">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                
                <p className="mb-4 text-muted">
                  Upload a bacterial DNA sequence in FASTA format. The system will identify known resistance markers, primarily focusing on MRSA.
                </p>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Detection Threshold: <span className="text-primary fw-bold">{threshold.toFixed(2)}</span></Form.Label>
                  <Form.Range 
                    min={0.5} max={0.95} step={0.05}
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    id="thresholdRange"
                  />
                  <div className="d-flex justify-content-between text-muted small mt-1">
                    <span>0.5 (More sensitive)</span>
                    <span>0.95 (More specific)</span>
                  </div>
                </Form.Group>
                
                {/* FileUpload component akan berada di dalam Card.Body */}
                <div className="p-3 border rounded bg-light mb-3"> {/* bg-light agar sedikit beda */}
                  <FileUpload 
                    onFileUploaded={handleFileUpload}
                    acceptedFormats={['.fasta', '.fa', '.fna']}
                  />
                </div>
                
                {loading && (
                  <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" role="status" className="mb-2">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Analyzing sequence... This may take a few moments.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card> {/* Hasil juga dibungkus card */}
              <Card.Header as="h5" className="py-3 fw-semibold">Analysis Complete</Card.Header>
              <Card.Body className="p-4">
                <AnalysisResult result={result} />
                <hr className="my-4"/> {/* Pemisah sebelum tombol aksi */}
                <div className="d-flex justify-content-center gap-2">
                  <Button variant="primary" onClick={handleSaveResult} className="px-4">
                    Save to History
                  </Button>
                  <Button variant="outline-secondary" onClick={handleNewAnalysis} className="px-4">
                    New Analysis
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisPage;