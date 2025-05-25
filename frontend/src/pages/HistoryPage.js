import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/apiService';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date string
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

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      
      try {
        // First try to get history from the API
        const response = await analysisService.getAnalysisHistory();
        setHistory(response.data);
      } catch (err) {
        console.log('Error fetching from API, using local storage instead');
        
        // Fall back to local storage if API fails
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        setHistory(savedResults);
        
        if (err.response?.status !== 404) {
          // Show error only if it's not a 404 (empty history)
          setError('Could not fetch analysis history from server.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Handle delete analysis (local storage only for demo)
  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem('analysisResults', JSON.stringify(updatedHistory));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading analysis history...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Analysis History</h1>
      
      {error && <Alert variant="warning">{error}</Alert>}
      
      {history.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h3>No Analysis History</h3>
            <p className="mb-4">You haven't performed any sequence analyses yet.</p>
            <Button as={Link} to="/analysis" variant="primary">
              Start Your First Analysis
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>
          <p className="mb-4">View your previous sequence analyses and their results.</p>
          
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Sample ID</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Identified Genes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.analysis_timestamp || item.savedAt)}</td>
                  <td>{item.sample_id}</td>
                  <td>
                    <Badge bg={getStatusBadge(item.resistance_status)}>
                      {item.resistance_status.charAt(0).toUpperCase() + item.resistance_status.slice(1)}
                    </Badge>
                  </td>
                  <td>{item.confidence_score.toFixed(1)}%</td>
                  <td>
                    {item.identified_genes && item.identified_genes.length > 0 ? (
                      <span>{item.identified_genes.join(', ')}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/results/${item.id || index}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default HistoryPage;
