from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
import tempfile
from services.blast_service import BlastService
from models.blast_model import BlastResult
from utils.config import Settings

router = APIRouter()
settings = Settings()

@router.post("/blast", response_model=List[BlastResult])
async def run_blast(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    evalue: float = 1e-10,
    max_hits: int = 10
):
    """
    Run BLAST alignment on a DNA sequence
    
    - **file**: FASTA file containing the bacterial DNA sequence
    - **evalue**: E-value threshold for BLAST
    - **max_hits**: Maximum number of hits to return
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
        
        # Run BLAST
        blast_service = BlastService()
        blast_results = blast_service.run_blast(
            temp_file_path,
            evalue=evalue,
            max_hits=max_hits
        )
        
        # Clean up temporary file in the background
        background_tasks.add_task(os.remove, temp_file_path)
        
        return blast_results
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error running BLAST: {str(e)}")

@router.get("/reference-genes", response_model=List[str])
async def get_reference_genes():
    """Get a list of available reference resistance genes"""
    try:
        blast_service = BlastService()
        return blast_service.get_available_reference_genes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reference genes: {str(e)}")
