import React, { useState, useCallback } from 'react';
import { Button, Alert, ProgressBar, Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const ModernFileUpload = ({ onFileUploaded, maxSize = 10485760, acceptedFormats = ['.fasta', '.fa', '.fna'] }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setFile(null);
    
    if (rejectedFiles?.length > 0) {
      const firstError = rejectedFiles[0].errors[0];
      if (firstError.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${maxSize / 1024 / 1024} MB.`);
      } else if (firstError.code === 'file-invalid-type') {
        setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      } else {
        setError(firstError.message || 'File not accepted.');
      }
      return;
    }

    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [maxSize, acceptedFormats]);
  
  const dropzoneAcceptOptions = acceptedFormats.reduce((acc, format) => {
    acc[format.startsWith('.') ? format : `.${format}`] = []; 
    return acc;
  }, {});

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: dropzoneAcceptOptions, 
    maxSize: maxSize,
  });

  const handleUpload = async () => {
    if (!file) { 
      setError('Please select a file first.'); 
      return; 
    }
    
    setUploading(true); 
    setUploadProgress(0); 
    setError(null);
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 95) {
        setUploadProgress(currentProgress);
      } else {
        clearInterval(progressInterval);
      }
    }, 150);
    
    try {
      await onFileUploaded(file);
      setUploadProgress(100);
    } catch (uploadError) {
      setError(`Upload failed: ${uploadError.message || 'Please try again.'}`);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null); 
    setError(null); 
    setUploadProgress(0);
  };

  return (
    <div className="modern-file-upload">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </Alert>
      )}
      
      <Card className="upload-zone-card shadow-sm">
        <div 
          {...getRootProps()} 
          className={`upload-dropzone ${isDragActive || isFocused ? 'active' : ''} ${file ? 'has-file' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="upload-content text-center">
            <div className="upload-icon-container mb-3">
              <div className={`upload-icon ${isDragActive ? 'animate' : ''}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
            </div>
            
            <h5 className="upload-title mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload FASTA File'}
            </h5>
            
            <p className="upload-subtitle text-muted mb-3">
              {isDragActive ? (
                <span className="text-primary fw-medium">Release to upload</span>
              ) : (
                <>
                  Drag & drop your file here, or{' '}
                  <span className="text-primary fw-medium">browse</span>
                </>
              )}
            </p>
            
            <div className="upload-specs">
              <small className="text-muted">
                Supported formats: {acceptedFormats.join(', ')} • 
                Max size: {maxSize / 1024 / 1024} MB
              </small>
            </div>
          </div>
        </div>
      </Card>      
      {file && (
        <Card className="file-preview-card mt-3 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex align-items-start gap-3">
              <div className="file-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 file-name">{file.name}</h6>
                    <small className="text-muted">
                      {(file.size / 1024).toFixed(1)} KB
                    </small>
                  </div>
                  
                  {uploadProgress === 100 && (
                    <div className="success-badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                {uploading && (
                  <ProgressBar 
                    now={uploadProgress} 
                    className="mb-2 modern-progress"
                    animated={uploadProgress < 100}
                    variant={uploadProgress === 100 ? "success" : "primary"}
                  />
                )}
                
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={handleUpload} 
                    disabled={uploading || uploadProgress === 100}
                    className="btn-modern"
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Analyzing...
                      </>
                    ) : uploadProgress === 100 ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        Complete
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={handleClear} 
                    disabled={uploading}
                    className="btn-modern"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <style jsx>{`
        .modern-file-upload {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .upload-zone-card {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .upload-dropzone {
          padding: 3rem 2rem;
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .upload-dropzone::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }
        
        .upload-dropzone.active {
          border-color: var(--primary-color, #6a11cb);
          background: rgba(106, 17, 203, 0.05);
        }
        
        .upload-dropzone.active::before {
          opacity: 0.1;
        }
        
        .upload-content {
          position: relative;
          z-index: 1;
        }
        
        .upload-icon-container {
          position: relative;
        }
        
        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
          color: white;
          transition: transform 0.3s ease;
        }
        
        .upload-icon.animate {
          animation: bounce 0.6s ease-in-out infinite alternate;
        }
        
        @keyframes bounce {
          to {
            transform: translateY(-10px);
          }
        }: 3px;
          overflow: hidden;
        }
        
        .modern-progress .progress-bar {
          border-radius: 3px;
          background: linear-gradient(90deg, var(--primary-color, #6a11cb) 0%, var(--secondary-color, #2575fc) 100%);
        }
      `}</style>
    </div>
  );
};

export default ModernFileUpload;