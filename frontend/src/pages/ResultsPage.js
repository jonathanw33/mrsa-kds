import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
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
      setLoading(true); setError(null);
      try {
        const response = await analysisService.getAnalysisResult(id);
        setResult(response.data);
      } catch (err) {
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        const resultIndex = parseInt(id);
        const foundResult = (!isNaN(resultIndex) && resultIndex >= 0 && resultIndex < savedResults.length)
          ? savedResults[resultIndex]
          : savedResults.find(item => String(item.id) === String(id) || String(item.savedAt) === String(id));
        
        if (foundResult) { setResult(foundResult); } 
        else { setError('Could not find the requested analysis result.'); }
      } finally { setLoading(false); }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{minHeight: 'calc(100vh - 160px)'}}>
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} className="mb-3" />
        <p className="lead text-muted">Loading analysis result...</p>
      </Container>
    );
  }

  if (error || !result) {
    return (
      <Container className="py-5 d-flex align-items-center justify-content-center" style={{minHeight: 'calc(100vh - 160px)'}}>
        <Row className="justify-content-center w-100">
          <Col md={8} lg={6}>
            <Card className="text-center shadow-sm">
              <Card.Header className="bg-warning text-dark py-3"> {/* Header warning */}
                 <h4 className="mb-0"> {error ? "Error Occurred" : "Result Not Found"}</h4>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                <Card.Text className="text-muted mb-4 fs-5"> {/* fs-5 untuk pesan */}
                  {error || "The analysis result you are looking for could not be found or is unavailable."}
                </Card.Text>
                <Button as={Link} to="/history" variant="primary" className="px-4">
                  Return to History
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  
  const pageTitle = result.sample_id ? `Result: ${result.sample_id}` : "Analysis Result";
  const analysisDate = result.analysis_timestamp || result.savedAt;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}> {/* Batasi lebar konten hasil */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
            <div>
              <h1 className="fw-bold mb-1 h2">{pageTitle}</h1>
              {analysisDate && (
                <p className="text-muted mb-0 small">
                  Analyzed on: {new Date(analysisDate).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <div className="mt-3 mt-md-0 d-flex gap-2 justify-content-start justify-content-md-end flex-wrap"> {/* flex-wrap untuk mobile */}
              <Button variant="outline-secondary" as={Link} to="/history">Back to History</Button>
              <Button variant="primary" as={Link} to="/analysis">New Analysis</Button>
            </div>
          </div>
          
          {/* AnalysisResult dibungkus Card agar konsisten */}
          <Card className="mb-4">
            <Card.Body className="p-3 p-md-4"> {/* Padding disesuaikan */}
                 <AnalysisResult result={result} />
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header as="h5" className="py-3 fw-semibold">Download Options</Card.Header>
            <Card.Body className="p-3 p-md-4">
              <p className="text-muted small mb-3"> {/* text kecil */}
                Export your analysis result in various formats.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2"> {/* Kolom di mobile, baris di sm ke atas */}
                <Button variant="outline-primary" className="flex-sm-grow-1">Download Report (PDF)</Button>
                <Button variant="outline-primary" className="flex-sm-grow-1">Export JSON</Button>
                <Button variant="outline-primary" className="flex-sm-grow-1">Export CSV</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultsPage;