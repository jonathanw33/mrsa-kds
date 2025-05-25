from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class ResistanceStatus(str, Enum):
    """Antibiotic resistance status"""
    RESISTANT = "resistant"
    SUSCEPTIBLE = "susceptible"
    INTERMEDIATE = "intermediate"
    UNKNOWN = "unknown"

class MatchingRegion(BaseModel):
    """A region of the sequence that matches a resistance gene"""
    gene_name: str
    query_start: int
    query_end: int
    subject_start: int
    subject_end: int
    percent_identity: float
    alignment_length: int
    evalue: float

class TreatmentRecommendation(BaseModel):
    """Treatment recommendation based on resistance analysis"""
    recommended_antibiotics: List[str]
    avoid_antibiotics: List[str]
    notes: Optional[str] = None
    confidence: float

class ResistanceAnalysisResult(BaseModel):
    """Result of antibiotic resistance analysis"""
    sample_id: str = Field(..., description="Identifier for the analyzed sample")
    resistance_status: ResistanceStatus
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence score (0-100%)")
    matching_regions: List[MatchingRegion]
    identified_genes: List[str]
    treatment_recommendations: Optional[TreatmentRecommendation] = None
    analysis_timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        schema_extra = {
            "example": {
                "sample_id": "MRSA_Sample_001",
                "resistance_status": "resistant",
                "confidence_score": 98.5,
                "matching_regions": [
                    {
                        "gene_name": "mecA",
                        "query_start": 101,
                        "query_end": 2100,
                        "subject_start": 1,
                        "subject_end": 2000,
                        "percent_identity": 99.8,
                        "alignment_length": 2000,
                        "evalue": 0.0
                    }
                ],
                "identified_genes": ["mecA"],
                "treatment_recommendations": {
                    "recommended_antibiotics": ["Vancomycin", "Linezolid", "Daptomycin"],
                    "avoid_antibiotics": ["Beta-lactams", "Methicillin", "Oxacillin"],
                    "notes": "High resistance to beta-lactam antibiotics detected",
                    "confidence": 95.0
                },
                "analysis_timestamp": "2025-04-04T12:30:45.123456"
            }
        }
