import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    def __init__(self):
        self.APP_NAME = "MRSA Resistance Gene Detector"
        self.API_V1_STR = "/api/v1"
        
        # Database settings (Supabase)
        self.SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        self.SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
        
        # BLAST settings
        self.BLAST_DB_PATH = os.getenv("BLAST_DB_PATH", "database/blast_db")
        self.TEMP_UPLOADS_DIR = os.getenv("TEMP_UPLOADS_DIR", "temp_uploads")
        self.BLAST_BIN_PATH = os.getenv("BLAST_BIN_PATH")
        
        # NCBI API settings
        self.NCBI_API_KEY = os.getenv("NCBI_API_KEY")
        self.NCBI_EMAIL = os.getenv("NCBI_EMAIL", "user@example.com")
        
        # Groq API for treatment recommendations
        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        
        # JWT settings for authentication
        self.SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30
