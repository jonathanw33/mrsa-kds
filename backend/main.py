from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging
from dotenv import load_dotenv
from api.routes import resistance_analysis, auth, blast
from utils.config import Settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize settings
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

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(resistance_analysis.router, prefix="/api", tags=["Resistance Analysis"])
app.include_router(blast.router, prefix="/api", tags=["BLAST"])

@app.get("/")
def read_root():
    return {"message": "Welcome to MRSA Resistance Gene Detector API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
