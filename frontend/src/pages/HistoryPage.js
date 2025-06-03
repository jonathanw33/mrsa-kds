import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { analysisService } from '../services/apiService';
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Trash2, 
  Eye, 
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpDown,
  History,
  Database
} from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
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

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...history];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sample_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getItemStatus(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resistance_genes?.some(gene => 
          gene.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        item.identified_genes?.some(gene => 
          gene.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        getItemStatus(item).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.savedAt || a.timestamp || a.analysis_timestamp || 0);
      const dateB = new Date(b.savedAt || b.timestamp || b.analysis_timestamp || 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredHistory(filtered);
  }, [history, searchTerm, statusFilter, sortOrder]);

  const handleDelete = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem('analysisResults', JSON.stringify(updatedHistory));
  };
  
  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return <XCircle className="h-4 w-4" />;
    if (s === 'susceptible') return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusVariant = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return 'destructive';
    if (s === 'susceptible') return 'default';
    return 'secondary';
  };

  // Helper function to get the correct status field
  const getItemStatus = (item) => {
    return item.resistance_status || item.status || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bio-500 mx-auto"></div>
              <p className="text-muted-foreground">Loading analysis history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <History className="h-8 w-8 text-bio-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Analysis History</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review your previous DNA sequence analyses and track resistance patterns over time
          </p>
        </div>

        {error && (
          <Alert className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters and Search */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search analyses..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="px-3 py-2 border border-input rounded-md bg-background"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="resistant">Resistant</option>
                <option value="susceptible">Susceptible</option>
                <option value="inconclusive">Inconclusive</option>
              </select>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {history.length} analyses
          </p>
        </div>

        {/* History List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredHistory.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                <p className="text-muted-foreground mb-4">
                  {history.length === 0 
                    ? "You haven't run any analyses yet. Start by uploading a DNA sequence."
                    : "No analyses match your current filters."
                  }
                </p>
                {history.length === 0 && (
                  <Button asChild>
                    <Link to="/analysis">Start First Analysis</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-bio-500" />
                          <h3 className="font-semibold text-lg">
                            {item.filename || item.sample_id || `Analysis ${index + 1}`}
                          </h3>
                          <Badge 
                            variant={getStatusVariant(getItemStatus(item))}
                            className="flex items-center space-x-1"
                          >
                            {getStatusIcon(getItemStatus(item))}
                            <span>{getItemStatus(item)}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {getRelativeTime(item.savedAt || item.timestamp || item.analysis_timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Resistance Genes: </span>
                          <span className="font-medium">
                            {(item.resistance_genes?.length > 0 || item.identified_genes?.length > 0)
                              ? `${(item.resistance_genes || item.identified_genes || []).length} found`
                              : 'None detected'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="font-medium">
                            {item.confidence ? `${Math.round(item.confidence * 100)}%` : 
                             item.confidence_score ? `${Math.round(item.confidence_score)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Genes Tags */}
                      {((item.resistance_genes && item.resistance_genes.length > 0) || 
                        (item.identified_genes && item.identified_genes.length > 0)) && (
                        <div className="flex flex-wrap gap-2">
                          {(item.resistance_genes || item.identified_genes || []).slice(0, 3).map((gene, gIndex) => (
                            <Badge key={gIndex} variant="outline" className="text-xs">
                              {gene}
                            </Badge>
                          ))}
                          {(item.resistance_genes || item.identified_genes || []).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(item.resistance_genes || item.identified_genes || []).length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-6">
                      {item.id && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/results/${item.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;