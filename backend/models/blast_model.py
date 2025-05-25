from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BlastHit(BaseModel):
    """A single BLAST hit"""
    query_id: str
    subject_id: str
    percent_identity: float
    alignment_length: int
    mismatches: int
    gap_opens: int
    query_start: int
    query_end: int
    subject_start: int
    subject_end: int
    evalue: float
    bit_score: float
    
class BlastResult(BaseModel):
    """Result of a BLAST alignment"""
    query_id: str
    query_length: int
    hits: List[BlastHit]
    raw_output: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "query_id": "Sample_MRSA_Isolate",
                "query_length": 2500,
                "hits": [
                    {
                        "query_id": "Sample_MRSA_Isolate",
                        "subject_id": "mecA_reference",
                        "percent_identity": 99.8,
                        "alignment_length": 2000,
                        "mismatches": 4,
                        "gap_opens": 0,
                        "query_start": 101,
                        "query_end": 2100,
                        "subject_start": 1,
                        "subject_end": 2000,
                        "evalue": 0.0,
                        "bit_score": 3698.5
                    }
                ],
                "raw_output": None
            }
        }
