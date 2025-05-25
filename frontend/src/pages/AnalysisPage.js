import React, { useState } from 'react';
import { Container, Card, Form, Alert, Button, Spinner } from 'react-bootstrap';
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
      
      // Save result to local storage for history
      const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
      const resultWithTimestamp = {
        ...response.data,
        savedAt: new Date().toISOString()
      };
      
      // Add to the beginning of the array (most recent first)
      savedResults.unshift(resultWithTimestamp);
      
      // Keep only the last 10 results
      const trimmedResults = savedResults.slice(0, 10);
      
      // Save back to local storage
      localStorage.setItem('analysisResults', JSON.stringify(trimmedResults));
      
    } catch (err) {
      console.error('Error analyzing sequence:', err);
      setError(err.response?.data?.detail || 'Error analyzing sequence');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = () => {
    // In a real app, this would save to the user's history in the database
    // For now, we'll just redirect to the history page
    navigate('/history');
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Container>
      <h1 className="mb-4">Sequence Analysis</h1>
      
      {!result ? (
        <Card>
          <Card.Header>
            <h4 className="mb-0">Upload Sequence</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <p className="mb-4">
              Upload a bacterial DNA sequence in FASTA format to analyze for antibiotic resistance genes.
              The system will identify known resistance markers, primarily focusing on MRSA.
            </p>
            
            <Form.Group className="mb-4">
              <Form.Label>Detection Threshold (0-1)</Form.Label>
              <Form.Range 
                min={0.5}
                max={0.95}
                step={0.05}
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
              />
              <div className="d-flex justify-content-between">
                <small>0.5 (More sensitive)</small>
                <small>Current: {threshold}</small>
                <small>0.95 (More specific)</small>
              </div>
            </Form.Group>
            
            <FileUpload 
              onFileUploaded={handleFileUpload}
              acceptedFormats={['.fasta', '.fa', '.fna']}
            />
            
            {loading && (
              <div className="text-center my-4">
                <Spinner animation="border" role="status" className="mb-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Analyzing sequence... This may take a few moments.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div>
          <AnalysisResult result={result} />
          
          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" onClick={handleSaveResult}>
              Save to History
            </Button>
            <Button variant="outline-secondary" onClick={handleNewAnalysis}>
              New Analysis
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AnalysisPage;
