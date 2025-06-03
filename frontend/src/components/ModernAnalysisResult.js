import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  FileText,
  BarChart3,
  Target,
  Pill,
  AlertTriangle
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ModernAnalysisResult = ({ result }) => {
  if (!result) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No analysis result available.</AlertDescription>
      </Alert>
    );
  }

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
    if (item.confidence_score) return item.confidence_score / 100;
    return item.confidence || null;
  };

  const getItemTimestamp = (item) => {
    return item.analysis_timestamp || item.savedAt || item.timestamp;
  };

  const getRecommendations = (item) => {
    return item.treatment_recommendations || item.recommendations || {};
  };

  const getMatchingRegions = (item) => {
    return item.matching_regions || item.results || [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resistant':
        return <XCircle className="h-4 w-4" />;
      case 'susceptible':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'resistant': return 'destructive';
      case 'susceptible': return 'default';
      default: return 'secondary';
    }
  };

  const status = getItemStatus(result);
  const confidence = getItemConfidence(result);
  const genes = getItemGenes(result);
  const recommendations = getRecommendations(result);
  const matchingRegions = getMatchingRegions(result);

  // Chart data for confidence visualization
  const chartData = {
    datasets: [{
      data: [confidence * 100, 100 - (confidence * 100)],
      backgroundColor: [
        status?.toLowerCase() === 'resistant' 
          ? '#ef4444' // red for resistant
          : status?.toLowerCase() === 'susceptible'
          ? '#22c55e' // green for susceptible  
          : '#6b7280', // gray for unknown
        '#e5e7eb' // light gray for remainder
      ],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Main Result Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-bio-500" />
              <CardTitle>Analysis Overview</CardTitle>
            </div>
            <Badge variant={getStatusVariant(status)} className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span>{status}</span>
            </Badge>
          </div>
          <CardDescription>
            Sample: {getItemFilename(result)} • Analyzed: {formatDate(getItemTimestamp(result))}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Resistance Genes Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-bio-500" />
              <h4 className="font-semibold">Identified Resistance Genes</h4>
            </div>
            
            {genes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {genes.map((gene, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                    {gene}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No resistance genes detected</span>
              </div>
            )}
          </div>

          {/* Confidence Score Visualization */}
          {confidence && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-bio-500" />
                <h4 className="font-semibold">Confidence Score</h4>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="relative w-32 h-32">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {Math.round(confidence * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Confidence
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analysis Reliability</span>
                    <span className="font-medium text-foreground">
                      {confidence >= 0.9 ? 'Very High' : 
                       confidence >= 0.7 ? 'High' : 
                       confidence >= 0.5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <Progress value={confidence * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Based on sequence alignment quality and gene database matches
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Recommendations */}
      {recommendations && (recommendations.recommended_antibiotics || recommendations.avoid_antibiotics) && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-bio-500" />
              <CardTitle>Treatment Recommendations</CardTitle>
            </div>
            <CardDescription>
              AI-powered antibiotic recommendations based on detected resistance patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Recommended Antibiotics */}
            {recommendations.recommended_antibiotics && recommendations.recommended_antibiotics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Recommended Antibiotics</h4>
                </div>
                <div className="grid gap-2">
                  {recommendations.recommended_antibiotics.map((antibiotic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                      <span className="font-medium text-green-800 dark:text-green-200">{antibiotic}</span>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                        Effective
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Antibiotics to Avoid */}
            {recommendations.avoid_antibiotics && recommendations.avoid_antibiotics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <h4 className="font-semibold text-red-700 dark:text-red-300">Potentially Avoid</h4>
                </div>
                <div className="grid gap-2">
                  {recommendations.avoid_antibiotics.map((antibiotic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                      <span className="font-medium text-red-800 dark:text-red-200">{antibiotic}</span>
                      <Badge variant="outline" className="bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300">
                        Resistant
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {recommendations.notes && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Clinical Notes</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{recommendations.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sequence Alignment Details */}
      {matchingRegions && matchingRegions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-bio-500" />
              <CardTitle>Sequence Alignment Details</CardTitle>
            </div>
            <CardDescription>
              BLAST alignment results showing gene matches and quality metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium text-foreground">Gene</th>
                    <th className="text-left p-2 font-medium text-foreground">Query Region</th>
                    <th className="text-left p-2 font-medium text-foreground">Subject Region</th>
                    <th className="text-left p-2 font-medium text-foreground">Identity (%)</th>
                    <th className="text-left p-2 font-medium text-foreground">E-Value</th>
                  </tr>
                </thead>
                <tbody>
                  {matchingRegions.map((region, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="p-2">
                        <Badge variant="outline" className="bg-bio-50 dark:bg-bio-950 border-bio-200 dark:border-bio-800 text-bio-700 dark:text-bio-300">
                          {region.gene_name || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono text-xs text-muted-foreground">
                        {region.query_start}-{region.query_end}
                      </td>
                      <td className="p-2 font-mono text-xs text-muted-foreground">
                        {region.subject_start}-{region.subject_end}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-bio-500" 
                              style={{width: `${region.percent_identity || 0}%`}}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {region.percent_identity || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="p-2 font-mono text-xs text-muted-foreground">
                        {region.evalue ? region.evalue.toExponential(2) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModernAnalysisResult;