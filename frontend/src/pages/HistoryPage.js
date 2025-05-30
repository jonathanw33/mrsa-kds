import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/apiService';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await analysisService.getAnalysisHistory();
        setHistory(response.data || []);
      } catch (err) {
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        setHistory(savedResults);
        if (savedResults.length > 0) {
          setError('Could not fetch history from server. Displaying locally saved data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem('analysisResults', JSON.stringify(updatedHistory));
  };
  
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return 'danger';
    if (s === 'susceptible') return 'success';
    return 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading analysis history...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-5 fw-bold text-center">Analysis History</h1>
      {error && <Alert variant="warning" className="shadow-sm">{error}</Alert>}
      
      {history.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <h2 className="h3 mb-3">No History Found</h2>
            <p className="text-muted mb-4">You haven't performed any analyses yet.</p>
            <Button as={Link} to="/analysis" variant="primary" size="lg">
              Start Your First Analysis
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sample ID</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item.id || item.savedAt || index}>
                    <td>{formatDate(item.analysis_timestamp || item.savedAt)}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{item.sample_id || 'N/A'}</td>
                    <td>
                      <Badge pill bg={getStatusBadge(item.resistance_status)}>
                        {item.resistance_status || 'N/A'}
                      </Badge>
                    </td>
                    <td>{item.confidence_score ? `${item.confidence_score.toFixed(1)}%` : 'N/A'}</td>
                    <td className="text-center">
                        <Button as={Link} to={`/results/${item.id || item.savedAt || index}`} variant="outline-primary" size="sm" className="me-2">View</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(index)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default HistoryPage;