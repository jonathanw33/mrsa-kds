import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Alert } from 'react-bootstrap';

const AnalysisProgress = ({ isAnalyzing, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);

  const steps = [
    { 
      label: "Uploading sequence",
      description: "Validating and preparing your DNA sequence for analysis",
      duration: 500
    },
    { 
      label: "Running BLAST alignment",
      description: "Comparing your sequence against 18 resistance gene references",
      duration: 2000
    },
    { 
      label: "Analyzing resistance patterns",
      description: "Evaluating alignment quality and gene identity thresholds",
      duration: 1000
    },
    { 
      label: "Generating results",
      description: "Calculating confidence scores and treatment recommendations",
      duration: 500
    }
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStep(0);
      setLogs([]);
      return;
    }

    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex >= steps.length) {
        setTimeout(() => {
          setLogs(prev => [...prev, {
            type: 'success',
            message: '✅ Analysis complete! Displaying results...',
            timestamp: new Date().toLocaleTimeString()
          }]);
          if (onComplete) onComplete();
        }, 200);
        return;
      }

      const step = steps[stepIndex];
      setCurrentStep(stepIndex);
      
      // Add step start log
      setLogs(prev => [...prev, {
        type: 'info',
        message: `🔄 ${step.label}...`,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setTimeout(() => {
        // Add step completion log
        setLogs(prev => [...prev, {
          type: 'success',
          message: `✓ ${step.label} completed`,
          description: step.description,
          timestamp: new Date().toLocaleTimeString()
        }]);

        stepIndex++;
        setTimeout(processStep, 200);
      }, step.duration);
    };

    processStep();
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing && currentStep === 0) {
    return null;
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="analysis-progress-card mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">🧬 Resistance Gene Analysis in Progress</h5>
      </Card.Header>
      <Card.Body>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <ProgressBar 
            now={progressPercentage} 
            variant={progressPercentage === 100 ? "success" : "primary"}
            animated={progressPercentage < 100}
          />
        </div>

        {/* Step Indicators */}
        <div className="step-indicators mb-4">
          {steps.map((step, index) => (
            <div key={index} className={`step-indicator ${index <= currentStep ? 'active' : ''}`}>
              <div className="step-circle">
                {index < currentStep ? '✓' : index === currentStep ? '●' : index + 1}
              </div>
              <div className="step-label">
                <strong>{step.label}</strong>
                <br />
                <small className="text-muted">{step.description}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Log */}
        <div className="analysis-log">
          <h6>Analysis Log:</h6>
          <div className="log-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-message">{log.message}</span>
                {log.description && (
                  <div className="log-description text-muted small">
                    {log.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AnalysisProgress;
