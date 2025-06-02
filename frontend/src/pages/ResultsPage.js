import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import AnalysisResult from '../components/AnalysisResult';
import { analysisService } from '../services/apiService';

const ResultsPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await analysisService.getAnalysisResult(id);
        setResult(response.data);
      } catch (err) {
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        const foundResult = savedResults.find(item => String(item.id) === String(id) || String(item.savedAt) === String(id) || savedResults.indexOf(item).toString() === id);
        
        if (foundResult) {
          setResult(foundResult);
        } else {
          setError('Could not find the requested analysis result.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading result...</p>
      </Container>
    );
  }

  if (error || !result) {
    return (
      <Container className="text-center py-5">
        <Card className="p-5 shadow-sm d-inline-block">
          <Card.Body>
             <h2 className="h3">Result Not Found</h2>
             <p className="text-muted my-3">{error}</p>
             <Button as={Link} to="/history" variant="primary">Return to History</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold h2 mb-0">Analysis Result</h1>
            <Button as={Link} to="/history" variant="outline-secondary">Back to History</Button>
          </div>
          
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4 p-md-5">
              <AnalysisResult result={result} />
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header as="h3" className="py-3 h5">Download Options</Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-3">
                Export your analysis result in various formats.
              </p>
              <div className="d-flex gap-2">
                <Button variant="outline-primary">Download PDF</Button>
                <Button variant="outline-primary">Export JSON</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultsPage;