import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ChevronRight, 
  Zap, 
  BarChart3, 
  Brain, 
  Upload, 
  Search, 
  ShieldCheck, 
  TrendingUp,
  Users,
  Clock,
  Award,
  ArrowRight,
  Microscope,
  Dna,
  Database
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { 
      icon: Zap,
      title: "Rapid Detection", 
      description: "Quickly identify antibiotic resistance genes in bacterial DNA sequences using advanced alignment algorithms.",
      color: "text-yellow-500"
    },
    { 
      icon: BarChart3,
      title: "Comprehensive Analysis", 
      description: "Get detailed reports including resistance status, confidence scores, and matching regions within the genome.",
      color: "text-blue-500"
    },
    { 
      icon: Brain,
      title: "Smart Recommendations", 
      description: "Receive AI-powered treatment suggestions based on the identified resistance genes and current best practices.",
      color: "text-purple-500"
    }
  ];

  const steps = [
    { 
      icon: Upload,
      title: "Upload DNA Sequence", 
      description: "Upload your bacterial DNA sequence in FASTA format.",
      step: "01"
    },
    { 
      icon: Search,
      title: "Sequence Analysis", 
      description: "Our system aligns your sequence against a database of known resistance genes using the BLAST algorithm.",
      step: "02"
    },
    { 
      icon: ShieldCheck,
      title: "Resistance Assessment", 
      description: "The system evaluates the alignment results to determine the presence of resistance genes.",
      step: "03"
    },
    { 
      icon: TrendingUp,
      title: "Get Results & Recommendations", 
      description: "Receive comprehensive results including treatment recommendations based on the identified resistance profile.",
      step: "04"
    }
  ];

  const stats = [
    { label: "Sample Sequences", value: "6", icon: Dna },
    { label: "Team Members", value: "3", icon: Users },
    { label: "Average Analysis Time", value: "< 2 mins", icon: Clock },
    { label: "Course Project", value: "ITB 2025", icon: Award }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bio-500/20 to-purple-500/20 dark:from-bio-500/10 dark:to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Microscope className="w-4 h-4 mr-2" />
              Advanced MRSA Detection System
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-bio-600 to-purple-600 bg-clip-text text-transparent">
              MRSA Resistance
              <br />
              Gene Detector
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A domain-specific computing project demonstrating how bioinformatics algorithms can detect 
              antibiotic resistance genes in bacterial DNA sequences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/analysis">
                    Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/register">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/about">
                  Learn More <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-b bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <Icon className="h-8 w-8 text-bio-500 mx-auto" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Project Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exploring the intersection of biology and computer science
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/50">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-bio-500/10 to-purple-500/10 w-16 h-16 flex items-center justify-center">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple workflow for complex genomic analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full border-0 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-bio-500 to-purple-500 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-bio-500 rounded-full flex items-center justify-center text-sm font-bold text-bio-500">
                          {step.step}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-sm leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-bio-500 to-purple-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Try Our Demo?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our implementation of domain-specific computing for bioinformatics analysis.
              Test the system with sample DNA sequences or upload your own FASTA files.
            </p>
          </div>
          
          <Card className="p-8 bg-gradient-to-r from-bio-500/10 to-purple-500/10 border-bio-200 dark:border-bio-800">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Database className="h-6 w-6 text-bio-500" />
              <span className="text-sm font-medium text-bio-600 dark:text-bio-400">
                Academic project demonstrating practical bioinformatics applications
              </span>
            </div>
            
            {isAuthenticated ? (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/analysis">
                  Try Demo Analysis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="space-y-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/register">
                    Create Account to Try <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Free demo account • Test with sample sequences
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;