from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
import uuid
from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService
from models.resistance_model import ResistanceAnalysisResult
from utils.config import Settings

# Load settings
settings = Settings()

# Create FastAPI app
app = FastAPI(
    title="MRSA Resistance Gene Detector",
    description="API for detecting antibiotic resistance genes in Staphylococcus aureus",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
blast_service = BlastService()
analysis_service = ResistanceAnalysisService()

@app.get("/")
def read_root():
    return {"message": "Welcome to MRSA Resistance Gene Detector API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_sequence(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    threshold: float = 0.75
):
    """
    Analyze a DNA sequence for antibiotic resistance genes
    
    - **file**: FASTA file containing the bacterial DNA sequence
    - **threshold**: Minimum alignment score threshold (0-1)
    """
    # Validate file is FASTA
    if not file.filename.endswith(('.fasta', '.fa', '.fna')):
        raise HTTPException(status_code=400, detail="File must be in FASTA format (.fasta, .fa, or .fna)")
    
    # Create a temporary file to store the uploaded content
    temp_dir = tempfile.gettempdir()
    temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}.fasta")
    
    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Run BLAST alignment
        blast_results = blast_service.run_blast(temp_file_path)
        
        # Analyze resistance
        analysis_results = analysis_service.analyze_resistance(
            blast_results,
            threshold=threshold
        )
        
        # Clean up temporary file in the background
        background_tasks.add_task(os.remove, temp_file_path)
        
        return analysis_results
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing sequence: {str(e)}")

@app.get("/api/reference-genes")
async def get_reference_genes():
    """Get a list of available reference resistance genes"""
    try:
        return blast_service.get_available_reference_genes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reference genes: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main_simplified:app", host="0.0.0.0", port=8000, reload=True)
