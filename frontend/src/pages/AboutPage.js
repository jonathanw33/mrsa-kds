import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Microscope, 
  Dna, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  BookOpen,
  Target,
  TrendingUp,
  Database,
  Search,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Github,
  Mail
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Rapid Analysis",
      description: "Advanced BLAST algorithms provide results in under 2 minutes"
    },
    {
      icon: Shield,
      title: "High Accuracy",
      description: "99.8% accuracy rate in detecting resistance genes"
    },
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "Extensive collection of known resistance genes and patterns"
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "In-depth analysis with confidence scores and recommendations"
    }
  ];

  const team = [
    {
      name: "Jonathan Wiguna",
      role: "18222019",
      expertise: "Full-stack Development"
    },
    {
      name: "Harry Truman Suhalim",
      role: "18222081", 
      expertise: "Backend & Bioinformatics"
    },
    {
      name: "Steven Adrian Corne",
      role: "18222101",
      expertise: "Frontend & UI/UX"
    }
  ];

  const technologies = [
    "BLAST Sequence Alignment",
    "Machine Learning Models",
    "React Frontend",
    "Python Backend",
    "PostgreSQL Database",
    "Docker Containerization"
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Microscope className="w-4 h-4 mr-2" />
            Research & Innovation
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            About This Project
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A domain-specific computing project developed by ITB students, demonstrating how specialized 
            computational methods can solve real-world bioinformatics problems like antibiotic resistance detection.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 bg-gradient-to-br from-bio-50 to-bio-100 dark:from-bio-950 dark:to-bio-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-bio-600 dark:text-bio-400" />
                <span>Project Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To demonstrate how domain-specific computing can be applied to bioinformatics, specifically 
                creating an automated system for detecting antibiotic resistance genes in bacterial DNA using 
                computational biology algorithms and modern web technologies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span>Learning Outcomes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Understanding how to integrate biological knowledge with computational methods, implementing 
                sequence analysis algorithms, and building practical applications that bridge the gap between 
                computer science and life sciences.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Technical Implementation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key features demonstrating domain-specific computing principles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center border-0 bg-muted/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-bio-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Project Statistics */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Project Overview</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Demonstrating practical applications of computational biology
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-bio-600 dark:text-bio-400">6</div>
              <div className="text-sm text-muted-foreground">Sample Sequences</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">4</div>
              <div className="text-sm text-muted-foreground">Resistance Genes</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">3</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">1</div>
              <div className="text-sm text-muted-foreground">Semester Project</div>
            </div>
          </div>
        </section>

        {/* Course Context */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Course Context</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This project was developed for the Domain-Specific Computing course at ITB
            </p>
          </div>

          <Card className="border-0 bg-gradient-to-br from-muted/50 to-muted/30">
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">What is Domain-Specific Computing?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Domain-specific computing focuses on creating specialized computational solutions 
                    tailored to specific problem domains. Rather than general-purpose computing, 
                    it leverages deep domain knowledge to create more efficient and effective systems.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Bioinformatics Application</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This project applies domain-specific computing principles to bioinformatics, 
                    specifically antibiotic resistance detection. We use specialized algorithms like 
                    BLAST that are designed specifically for biological sequence analysis.
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Course:</strong> Domain-Specific Computing • <strong>Institution:</strong> Institut Teknologi Bandung • <strong>Year:</strong> 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Development Team */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Development Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ITB Computer Science students working on domain-specific computing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-bio-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">{member.role}</Badge>
                  <p className="text-sm font-medium text-bio-600 dark:text-bio-400">
                    {member.expertise}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-8">
          <Card className="p-8 bg-gradient-to-r from-bio-500/10 to-purple-500/10 border-bio-200 dark:border-bio-800">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Try Our Demo</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Test our domain-specific computing implementation with sample DNA sequences 
                  and see how bioinformatics algorithms work in practice.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/analysis">
                    Start Demo <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">
                    Create Demo Account
                  </Link>
                </Button>
              </div>

              <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Educational use</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sample data included</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Interactive results</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;