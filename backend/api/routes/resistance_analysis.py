from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
import tempfile
from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService
from models.resistance_model import ResistanceAnalysisResult, ResistanceStatus
from utils.config import Settings

router = APIRouter()
settings = Settings()

@router.post("/analyze", response_model=ResistanceAnalysisResult)
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
        
        # Process the sequence
        blast_service = BlastService()
        analysis_service = ResistanceAnalysisService()
        
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
