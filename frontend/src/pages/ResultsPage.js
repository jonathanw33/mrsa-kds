import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AnalysisResult from '../components/AnalysisResult';
import { analysisService } from '../services/apiService';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get from API
        const response = await analysisService.getAnalysisResult(id);
        setResult(response.data);
      } catch (err) {
        console.log('Error fetching from API, trying local storage');
        
        // If API fails, try getting from local storage
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        
        // Check if the ID is a number (index in the array)
        const resultIndex = parseInt(id);
        if (!isNaN(resultIndex) && resultIndex >= 0 && resultIndex < savedResults.length) {
          setResult(savedResults[resultIndex]);
        } else {
          // Try to find by ID if it's not an index
          const foundResult = savedResults.find(item => item.id === id);
          if (foundResult) {
            setResult(foundResult);
          } else {
            setError('Could not find the requested analysis result.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" className="mb-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading analysis result...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
        <Button as={Link} to="/history" variant="primary">
          Return to History
        </Button>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Result Not Found</Alert.Heading>
          <p>The analysis result you are looking for could not be found.</p>
        </Alert>
        <Button as={Link} to="/history" variant="primary">
          Return to History
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Analysis Result</h1>
        <div>
          <Button 
            variant="outline-primary" 
            as={Link} 
            to="/history"
            className="me-2"
          >
            Back to History
          </Button>
          <Button 
            variant="primary" 
            as={Link} 
            to="/analysis"
          >
            New Analysis
          </Button>
        </div>
      </div>
      
      <AnalysisResult result={result} />
      
      <div className="mt-5">
        <h3>Download Options</h3>
        <div className="d-flex gap-2 mt-3">
          <Button variant="outline-secondary">
            Download Report (PDF)
          </Button>
          <Button variant="outline-secondary">
            Export JSON
          </Button>
          <Button variant="outline-secondary">
            Export CSV
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ResultsPage;
