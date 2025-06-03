import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import ModernAnalysisResult from '../components/ModernAnalysisResult';
import { analysisService } from '../services/apiService';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Dna,
  Shield,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

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
        const foundResult = savedResults.find(item => 
          String(item.id) === String(id) || 
          String(item.savedAt) === String(id) || 
          savedResults.indexOf(item).toString() === id
        );
        
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Helper functions to get correct field values
  const getItemStatus = (item) => {
    return item.resistance_status || item.status || 'Unknown';
  };

  const getItemFilename = (item) => {
    return item.filename || item.sample_id || 'Analysis Result';
  };

  const getItemGenes = (item) => {
    return item.identified_genes || item.resistance_genes || [];
  };

  const getItemConfidence = (item) => {
    if (item.confidence_score) return item.confidence_score / 100; // Convert percentage to decimal
    return item.confidence || null;
  };

  const getItemTimestamp = (item) => {
    return item.analysis_timestamp || item.savedAt || item.timestamp;
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return <XCircle className="h-5 w-5" />;
    if (s === 'susceptible') return <CheckCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getStatusVariant = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return 'destructive';
    if (s === 'susceptible') return 'default';
    return 'secondary';
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resistant') return 'text-red-600 dark:text-red-400';
    if (s === 'susceptible') return 'text-green-600 dark:text-green-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bio-500 mx-auto"></div>
              <p className="text-muted-foreground">Loading analysis result...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto py-20">
          <Card className="text-center">
            <CardContent className="p-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Analysis Result Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || 'The requested analysis result could not be found or may have been deleted.'}
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <Link to="/history">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analysis History
                  </Link>
                </Button>
                <div>
                  <Button asChild variant="outline">
                    <Link to="/analysis">
                      <Dna className="h-4 w-4 mr-2" />
                      Start New Analysis
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/history" className="hover:text-foreground transition-colors">
              Analysis History
            </Link>
            <span>/</span>
            <span className="text-foreground">Result Details</span>
          </div>

          {/* Main Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(getItemStatus(result))}`}>
                  {getStatusIcon(getItemStatus(result))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {getItemFilename(result)}
                </h1>
                <Badge 
                  variant={getStatusVariant(getItemStatus(result))}
                  className="flex items-center space-x-1"
                >
                  {getStatusIcon(getItemStatus(result))}
                  <span>{getItemStatus(result)}</span>
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Analyzed {formatDate(getItemTimestamp(result))}</span>
                </div>
                {getItemConfidence(result) && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{Math.round(getItemConfidence(result) * 100)}% Confidence</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline">
                <Link to="/history">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to History
                </Link>
              </Button>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-bio-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {getItemGenes(result).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Resistance Genes
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {getItemConfidence(result) ? `${Math.round(getItemConfidence(result) * 100)}%` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                Confidence Score
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {result.processing_time || '< 2m'}
              </div>
              <div className="text-sm text-muted-foreground">
                Processing Time
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {result.sequence_length || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                Sequence Length
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <ModernAnalysisResult result={result} />

        {/* Action Footer */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="font-semibold mb-1">Need to analyze another sequence?</h3>
                <p className="text-sm text-muted-foreground">
                  Start a new analysis or compare with previous results
                </p>
              </div>
              <div className="flex space-x-3">
                <Button asChild variant="outline">
                  <Link to="/history">View All Results</Link>
                </Button>
                <Button asChild>
                  <Link to="/analysis">
                    <Dna className="h-4 w-4 mr-2" />
                    New Analysis
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;