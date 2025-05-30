import React, { useState, useCallback } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap'; // Form tidak digunakan secara langsung, tapi mungkin untuk styling internal Dropzone
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUploaded, maxSize = 10485760, acceptedFormats = ['.fasta', '.fa', '.fna'] }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null); setFile(null);
    
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
  
  // Membuat objek 'accept' untuk useDropzone
  const dropzoneAcceptOptions = acceptedFormats.reduce((acc, format) => {
    // Asumsi format adalah ekstensi file seperti '.fasta'
    // Tipe MIME untuk FASTA bisa bervariasi, jadi menggunakan ekstensi lebih aman untuk kasus ini
    // Jika Anda tahu tipe MIME spesifik, Anda bisa menambahkannya di sini
    // Contoh: 'text/plain', 'application/x-fasta', dll.
    // Untuk kesederhanaan, Dropzone akan mencocokkan berdasarkan ekstensi jika ini formatnya
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
    if (!file) { setError('Please select a file first.'); return; }
    setUploading(true); setUploadProgress(0); setError(null);
    
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
    setFile(null); setError(null); setUploadProgress(0);
  };

  const dropzoneClassName = `p-4 p-md-5 border rounded text-center ${
    isDragActive || isFocused ? 'border-primary shadow-sm' : 'border-dashed'
  }`;

  return (
    <div className="mb-3">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      <div {...getRootProps()} className={dropzoneClassName} style={{ cursor: 'pointer', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="mb-0 h5 text-primary">Drop the file here ...</p>
        ) : (
          <div>
            <p className="mb-1 fw-semibold">Drag & drop a FASTA file, or click to select</p>
            <p className="text-muted small mb-0">
              Formats: {acceptedFormats.join(', ')} | Max size: {maxSize / 1024 / 1024} MB
            </p>
          </div>
        )}
      </div>
      
      {file && (
        <div className="mt-3">
          {!uploading && uploadProgress !== 100 && (
            <Alert variant="info" className="py-2 px-3 d-flex justify-content-between align-items-center">
              <span><strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </Alert>
          )}

          {uploading && (
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                className="my-3"
                animated={uploadProgress < 100}
                variant={uploadProgress === 100 ? "success" : "primary"}
              />
          )}
          
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleUpload} disabled={uploading || uploadProgress === 100}>
              {uploading ? 'Uploading...' : (uploadProgress === 100 ? 'Uploaded' : 'Start Analysis')}
            </Button>
            <Button variant="outline-secondary" onClick={handleClear} disabled={uploading}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;