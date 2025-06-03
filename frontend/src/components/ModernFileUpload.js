import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatFileSize } from '../lib/utils'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Dna
} from 'lucide-react'

const ModernFileUpload = ({ 
  onFileSelect, 
  acceptedTypes = '.fasta,.fa,.fas,.txt',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className 
}) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const validateFastaFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const isFasta = content.startsWith('>') || content.includes('>')
        resolve(isFasta)
      }
      reader.readAsText(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError('')
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File too large. Maximum size is ${formatFileSize(maxFileSize)}.`)
      } else {
        setError('Invalid file type. Please upload a FASTA file.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setIsValidating(true)

      // Validate FASTA format
      const isValidFasta = await validateFastaFile(file)
      
      setIsValidating(false)

      if (!isValidFasta) {
        setError('Invalid FASTA format. File must contain sequence data starting with ">".')
        return
      }

      setUploadedFile(file)
      if (onFileSelect) {
        onFileSelect(file)
      }
    }
  }, [maxFileSize, onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.fasta', '.fa', '.fas', '.txt']
    },
    maxSize: maxFileSize,
    multiple: false
  })

  const removeFile = () => {
    setUploadedFile(null)
    setError('')
    if (onFileSelect) {
      onFileSelect(null)
    }
  }

  const dropzoneClass = cn(
    "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
    "hover:border-primary/50 hover:bg-accent/50",
    isDragActive && "border-primary bg-primary/5",
    isDragAccept && "border-bio-500 bg-bio-500/5",
    isDragReject && "border-destructive bg-destructive/5",
    uploadedFile && "border-bio-500 bg-bio-500/5"
  )

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-0">
          <div {...getRootProps()} className={dropzoneClass}>
            <input {...getInputProps()} />
            
            <motion.div
              initial={{ scale: 1 }}
              animate={{ 
                scale: isDragActive ? 1.05 : 1,
                rotateY: isDragActive ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {uploadedFile ? (
                <CheckCircle className="mx-auto h-12 w-12 text-bio-500" />
              ) : (
                <Upload className={cn(
                  "mx-auto h-12 w-12 transition-colors",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
              )}

              <div className="space-y-2">
                {uploadedFile ? (
                  <>
                    <h3 className="text-lg font-semibold text-bio-600">
                      File Selected
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click "Start Analysis" below to process your sequence
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">
                      {isDragActive ? "Drop your FASTA file here" : "Upload FASTA File"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to select a FASTA sequence file
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  .fasta
                </Badge>
                <Badge variant="outline" className="text-xs">
                  .fa
                </Badge>
                <Badge variant="outline" className="text-xs">
                  .fas
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Max {formatFileSize(maxFileSize)}
                </Badge>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* File Details */}
      <AnimatePresence>
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-bio-500/10 rounded-lg">
                      <Dna className="h-5 w-5 text-bio-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.size)} • FASTA sequence
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Loading */}
      <AnimatePresence>
        {isValidating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Validating FASTA format...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModernFileUpload
