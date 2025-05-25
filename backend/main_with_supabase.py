from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import uvicorn
import os
import tempfile
import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService
from services.supabase_service import SupabaseService
from models.resistance_model import ResistanceAnalysisResult, ResistanceStatus
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
supabase_service = SupabaseService()

# Define OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define models for authentication
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    institution: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    email: str
    full_name: Optional[str] = None
    institution: Optional[str] = None
    is_active: bool = True

# Helper function to get the current user
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        user_data = supabase_service.get_user_from_token(token)
        return User(**user_data)
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Basic routes
@app.get("/")
def read_root():
    return {"message": "Welcome to MRSA Resistance Gene Detector API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Authentication routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        token = supabase_service.login_user(form_data.username, form_data.password)
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/register", response_model=User)
async def register_user(user: UserRegister):
    try:
        user_data = supabase_service.register_user(
            email=user.email,
            password=user.password,
            user_data={
                "full_name": user.full_name,
                "institution": user.institution
            }
        )
        return user_data
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Registration failed: {str(e)}"
        )

@app.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Analysis routes
@app.post("/api/analyze", response_model=ResistanceAnalysisResult)
async def analyze_sequence(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    threshold: float = 0.75,
    current_user: User = Depends(get_current_user)
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
        
        # Save results to Supabase if authenticated
        try:
            user_id = supabase_service.get_user_from_token(current_user)["id"]
            supabase_service.save_analysis_result(user_id, analysis_results.dict())
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error saving analysis result: {str(e)}")
        
        # Clean up temporary file in the background
        background_tasks.add_task(os.remove, temp_file_path)
        
        return analysis_results
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing sequence: {str(e)}")

@app.get("/api/reference-genes", response_model=List[str])
async def get_reference_genes():
    """Get a list of available reference resistance genes"""
    try:
        return blast_service.get_available_reference_genes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reference genes: {str(e)}")

@app.get("/api/history", response_model=List[Dict[str, Any]])
async def get_analysis_history(current_user: User = Depends(get_current_user)):
    """Get analysis history for the current user"""
    try:
        user_id = supabase_service.get_user_from_token(current_user)["id"]
        return supabase_service.get_user_analysis_results(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analysis history: {str(e)}")

@app.get("/api/results/{result_id}", response_model=Dict[str, Any])
async def get_analysis_result(result_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific analysis result"""
    try:
        result = supabase_service.get_analysis_result(result_id)
        # Verify that the result belongs to the current user
        user_id = supabase_service.get_user_from_token(current_user)["id"]
        if result.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this result")
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Analysis result not found: {str(e)}")

# Public analysis route (no authentication required)
@app.post("/api/analyze-public", response_model=ResistanceAnalysisResult)
async def analyze_sequence_public(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    threshold: float = 0.75
):
    """
    Analyze a DNA sequence for antibiotic resistance genes (public API, no authentication required)
    
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

if __name__ == "__main__":
    uvicorn.run("main_with_supabase:app", host="0.0.0.0", port=8000, reload=True)
