from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
import tempfile
from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService
from services.supabase_service import SupabaseService
from models.resistance_model import ResistanceAnalysisResult, ResistanceStatus
from api.routes.auth import get_current_user_dependency, User, oauth2_scheme
from utils.config import Settings

router = APIRouter()
settings = Settings()
supabase_service = SupabaseService()

@router.post("/analyze", response_model=ResistanceAnalysisResult)
async def analyze_sequence(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    threshold: float = 0.75,
    current_user: User = Depends(get_current_user_dependency)
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
        
        # Save results to Supabase for authenticated user
        try:
            # Add sample_id to analysis results
            analysis_dict = analysis_results.dict()
            analysis_dict['sample_id'] = file.filename or f"sample_{uuid.uuid4()}"
            
            result_id = supabase_service.save_analysis_result(current_user.id, analysis_dict)
            print(f"Analysis result saved with ID: {result_id}")
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error saving analysis result: {str(e)}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
        
        # Clean up temporary file in the background
        background_tasks.add_task(os.remove, temp_file_path)
        
        return analysis_results
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing sequence: {str(e)}")

@router.get("/debug/user")
async def debug_current_user(current_user: User = Depends(get_current_user_dependency)):
    """Debug endpoint to check current user authentication"""
    return {
        "message": "Authentication working",
        "user": current_user,
        "user_id": current_user.id
    }

@router.get("/history")
async def get_analysis_history(current_user: User = Depends(get_current_user_dependency)):
    """Get analysis history for the current user"""
    try:
        # Temporarily use the simple version without auth_token
        return supabase_service.get_user_analysis_results(current_user.id)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Full error: {error_details}")
        raise HTTPException(status_code=500, detail=f"Error fetching analysis history: {str(e)}")

@router.get("/history/{result_id}")
async def get_analysis_result(result_id: str, current_user: User = Depends(get_current_user_dependency)):
    """Get a specific analysis result"""
    try:
        return supabase_service.get_analysis_result(result_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analysis result: {str(e)}")
