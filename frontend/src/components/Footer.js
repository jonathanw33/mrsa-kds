import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { 
  Microscope, 
  Github, 
  ExternalLink,
  Mail,
  BookOpen,
  Users,
  GraduationCap
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Project Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-bio-500/10">
                <Microscope className="h-5 w-5 text-bio-500" />
              </div>
              <h3 className="font-bold text-lg">MRSA-KDS</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A domain-specific computing project for detecting antibiotic resistance genes 
              in bacterial DNA sequences, developed as part of ITB's computer science curriculum.
            </p>
            <Badge variant="outline" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Academic Project 2025
            </Badge>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors"
                >
                  About Project
                </Link>
              </li>
              <li>
                <Link 
                  to="/analysis" 
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors"
                >
                  Try Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.ncbi.nlm.nih.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors inline-flex items-center"
                >
                  NCBI Database
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://blast.ncbi.nlm.nih.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors inline-flex items-center"
                >
                  BLAST Algorithm
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://biopython.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-bio-500 transition-colors inline-flex items-center"
                >
                  Biopython Docs
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Development Team */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Development Team</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Users className="w-3 h-3" />
                <span>Jonathan Wiguna</span>
              </li>
              <li className="text-xs text-muted-foreground/70 ml-5">18222019</li>
              
              <li className="flex items-center space-x-2">
                <Users className="w-3 h-3" />
                <span>Harry Truman Suhalim</span>
              </li>
              <li className="text-xs text-muted-foreground/70 ml-5">18222081</li>
              
              <li className="flex items-center space-x-2">
                <Users className="w-3 h-3" />
                <span>Steven Adrian Corne</span>
              </li>
              <li className="text-xs text-muted-foreground/70 ml-5">18222101</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} MRSA-KDS Project. Created for educational purposes.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Domain-Specific Computing
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Institut Teknologi Bandung
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;