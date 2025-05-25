import React, { useState, useCallback } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUploaded, maxSize = 10485760, acceptedFormats = ['.fasta', '.fa', '.fna'] }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    
    // Check if file exists
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Check file size
      if (selectedFile.size > maxSize) {
        setError(`File size exceeds the maximum allowed size (${maxSize / 1024 / 1024} MB)`);
        return;
      }
      
      // Check file extension
      const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
      if (!acceptedFormats.includes(fileExt)) {
        setError(`Only ${acceptedFormats.join(', ')} files are accepted`);
        return;
      }
      
      // Set the file
      setFile(selectedFile);
    }
  }, [maxSize, acceptedFormats]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 100);
    
    try {
      // Call the onFileUploaded callback with the file
      await onFileUploaded(file);
      setUploadProgress(100);
    } catch (error) {
      setError('Error uploading file: ' + error.message);
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
    <div className="mb-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div
        {...getRootProps()}
        className={`p-5 border rounded text-center ${
          isDragActive ? 'bg-light border-primary' : 'border-dashed'
        }`}
        style={{ cursor: 'pointer', borderStyle: isDragActive ? 'solid' : 'dashed' }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="mb-0">Drop the file here...</p>
        ) : (
          <div>
            <p className="mb-2">Drag and drop a FASTA file here, or click to select a file</p>
            <p className="text-muted small mb-0">
              Accepted formats: {acceptedFormats.join(', ')} | Max size: {maxSize / 1024 / 1024} MB
            </p>
          </div>
        )}
      </div>
      
      {file && (
        <div className="mt-3">
          <p className="mb-2">
            <strong>Selected file:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
          
          {uploadProgress > 0 && (
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`} 
              className="mb-3" 
            />
          )}
          
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleUpload} 
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={handleClear}
              disabled={uploading}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
