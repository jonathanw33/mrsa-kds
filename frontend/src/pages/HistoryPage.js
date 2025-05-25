import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/apiService';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
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

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true); setError(null);
      try {
        const response = await analysisService.getAnalysisHistory();
        setHistory(response.data || []);
      } catch (err) {
        const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
        setHistory(savedResults);
        if (err.response?.status !== 404 || savedResults.length === 0) {
           setError('Could not fetch analysis history from server. Displaying locally saved data if available.');
        }
      } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  const handleDelete = (index) => {
    const itemToDelete = history[index]; 
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    // Hapus juga dari local storage
    const localHistory = JSON.parse(localStorage.getItem('analysisResults') || '[]');
    const updatedLocalHistory = localHistory.filter(h => 
        !( (itemToDelete.id && h.id === itemToDelete.id) || 
           (itemToDelete.savedAt && h.savedAt === itemToDelete.savedAt) )
    );
    localStorage.setItem('analysisResults', JSON.stringify(updatedLocalHistory));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 lead text-muted">Loading analysis history...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 fw-bold text-center">Analysis History</h1>
      
      {error && <Alert variant="warning" className="shadow-sm">{error}</Alert>} {/* shadow-sm dari index.css alert style */}
      
      {history.length === 0 && !loading ? (
        <Card className="text-center p-4 p-md-5 mt-4 shadow-sm"> {/* shadow-sm untuk card kosong */}
          <Card.Body>
            {/* Bisa tambahkan elemen visual dari Bootstrap jika ada, misal ikon teks atau SVG sederhana */}
            <Card.Title as="h3" className="mb-3">No Analysis History Found</Card.Title>
            <Card.Text className="text-muted mb-4">
              It looks like you haven't performed any sequence analyses yet, or your history is empty.
            </Card.Text>
            <Button as={Link} to="/analysis" variant="primary" size="lg" className="px-4">
              Start Your First Analysis
            </Button>
          </Card.Body>
        </Card>
      ) : (
        // Table akan otomatis mendapat style dari .table-responsive dan .table di index.css
        <div className="table-responsive"> 
          <Table hover striped className="align-middle"> {/* striped dari bootstrap, hover dari index.css */}
            {/* thead akan mendapat style dari .table thead th */}
            <thead>
              <tr>
                <th className="px-3">Date</th>
                <th className="px-3">Sample ID</th>
                <th className="px-3">Status</th>
                <th className="px-3">Confidence</th>
                <th className="px-3">Identified Genes</th>
                <th className="px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id || item.savedAt || index}> {/* pastikan key unik */}
                  <td className="px-3">{formatDate(item.analysis_timestamp || item.savedAt)}</td>
                  <td className="px-3 text-truncate" style={{maxWidth: '150px'}} title={item.sample_id}>{item.sample_id || 'N/A'}</td>
                  <td className="px-3">
                    <Badge pill bg={getStatusBadge(item.resistance_status)} className="px-2 py-1 fs-small"> {/* fs-small untuk ukuran font badge */}
                      {item.resistance_status ? item.resistance_status.charAt(0).toUpperCase() + item.resistance_status.slice(1) : 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-3">{item.confidence_score?.toFixed(1) || 'N/A'}%</td>
                  <td className="px-3">
                    {item.identified_genes && item.identified_genes.length > 0 ? (
                      <span className="d-inline-block text-truncate" style={{maxWidth: '200px'}} title={item.identified_genes.join(', ')}>{item.identified_genes.join(', ')}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td className="px-3 text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button 
                        as={Link} 
                        to={`/results/${item.id || item.savedAt || index}`} // Gunakan ID yang lebih robust jika ada
                        variant="outline-primary"
                        size="sm"
                        title="View Details"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        title="Delete Analysis"
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