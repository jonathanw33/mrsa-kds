import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import ModernFileUpload from '../components/ModernFileUpload'; 
import ModernAnalysisResult from '../components/ModernAnalysisResult'; 
import AnalysisProgress from '../components/AnalysisProgress';
import { analysisService } from '../services/apiService';
import { 
  Upload, 
  FileText, 
  Zap, 
  Brain, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Settings,
  HelpCircle,
  Microscope,
  Dna
} from 'lucide-react';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [threshold, setThreshold] = useState(0.75);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    
    setLoading(true);
    setAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const response = await analysisService.analyzeSequence(selectedFile, threshold);
      setResult(response.data);
      
      // Save to local storage
      const savedResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
      const resultWithTimestamp = { ...response.data, savedAt: new Date().toISOString() };
      savedResults.unshift(resultWithTimestamp);
      localStorage.setItem('analysisResults', JSON.stringify(savedResults.slice(0, 10)));
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
    setAnalyzing(false);
    setSelectedFile(null);
  };

  const features = [
    {
      icon: Zap,
      title: "Rapid Processing",
      description: "Advanced BLAST algorithms for fast sequence alignment"
    },
    {
      icon: Brain,
      title: "AI Analysis", 
      description: "Machine learning models for accurate resistance prediction"
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Comprehensive results with confidence scores and recommendations"
    }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {!result ? (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Microscope className="w-4 h-4 mr-2" />
                MRSA Detection Analysis
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                DNA Sequence Analysis
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload your bacterial DNA sequence and get comprehensive antibiotic resistance analysis.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center border-0 bg-muted/30">
                    <CardHeader className="pb-4">
                      <div className="mx-auto mb-2 p-3 rounded-full bg-bio-100 dark:bg-bio-900 w-12 h-12 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-bio-600 dark:text-bio-400" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Upload Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/50">
                <CardHeader className="text-center border-b bg-gradient-to-r from-bio-500 to-purple-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Upload className="h-6 w-6" />
                    <CardTitle className="text-xl">Upload DNA Sequence</CardTitle>
                  </div>
                  <CardDescription className="text-bio-100">
                    Ready to analyze your bacterial DNA sequence for antibiotic resistance
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <ModernFileUpload onFileSelect={handleFileSelect} disabled={loading} />

                  {/* Analysis Button */}
                  {selectedFile && !analyzing && (
                    <div className="flex flex-col items-center space-y-4 pt-4 border-t">
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-bio-600">Ready to Analyze</h3>
                        <p className="text-sm text-muted-foreground">
                          File: {selectedFile.name}
                        </p>
                      </div>
                      <Button 
                        onClick={handleAnalyze} 
                        size="lg" 
                        className="px-8 py-3 text-lg bg-gradient-to-r from-bio-500 to-purple-500 hover:from-bio-600 hover:to-purple-600"
                        disabled={loading}
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Start Analysis
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  )}

                  {/* Progress Section */}
                  {analyzing && (
                    <div className="mt-6">
                      <AnalysisProgress />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Results Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Analysis Complete</h1>
                    <p className="text-muted-foreground">
                      Your DNA sequence has been successfully analyzed
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleNewAnalysis} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>

              <ModernAnalysisResult result={result} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;