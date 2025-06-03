import os
import uuid
import logging
from typing import List, Dict, Any, Optional
from models.blast_model import BlastResult, BlastHit
from models.resistance_model import (
    ResistanceAnalysisResult,
    ResistanceStatus,
    MatchingRegion,
    TreatmentRecommendation
)
from utils.config import Settings

class ResistanceAnalysisService:
    """Service for analyzing antibiotic resistance based on BLAST results"""
    
    def __init__(self):
        self.settings = Settings()
        self.logger = logging.getLogger(__name__)
        
        # Initialize Groq service if API key is available
        try:
            from services.groq_service import GroqService
            if hasattr(self.settings, 'GROQ_API_KEY') and self.settings.GROQ_API_KEY:
                self.groq_service = GroqService()
            else:
                self.groq_service = None
        except ImportError:
            self.groq_service = None
        
        # Define resistance genes and their significance
        self.resistance_genes = {
            "mecA": {
                "description": "Methicillin resistance gene in S. aureus",
                "resistance_to": ["methicillin", "oxacillin", "all beta-lactams"],
                "significance_threshold": 95.0  # Percent identity threshold
            },
            "vanA": {
                "description": "Vancomycin resistance gene",
                "resistance_to": ["vancomycin"],
                "significance_threshold": 90.0
            },
            "ermA": {
                "description": "Erythromycin resistance methylase gene",
                "resistance_to": ["erythromycin", "clindamycin", "macrolides"],
                "significance_threshold": 90.0
            },
            "ermC": {
                "description": "Erythromycin resistance methylase gene",
                "resistance_to": ["erythromycin", "clindamycin", "macrolides"],
                "significance_threshold": 90.0
            },
            "tetK": {
                "description": "Tetracycline resistance gene",
                "resistance_to": ["tetracycline"],
                "significance_threshold": 90.0
            }
        }
    
    def analyze_resistance(
        self, 
        blast_results: List[BlastResult], 
        threshold: float = 0.75
    ) -> ResistanceAnalysisResult:
        """
        Analyze BLAST results to determine antibiotic resistance
        
        Args:
            blast_results: List of BlastResult objects
            threshold: Minimum alignment score threshold (0-1)
            
        Returns:
            ResistanceAnalysisResult object
        """
        try:
            # Initialize variables
            resistance_status = ResistanceStatus.SUSCEPTIBLE
            confidence_score = 0.0
            matching_regions = []
            identified_genes = []
            sample_id = "unknown"
            
            # Process BLAST hits
            for result in blast_results:
                sample_id = result.query_id  # Use the query ID as the sample ID
                
                for hit in result.hits:
                    # Extract gene name from subject ID
                    gene_name = hit.subject_id.split('_')[0] if '_' in hit.subject_id else hit.subject_id
                    
                    # Check if this is a known resistance gene
                    if gene_name in self.resistance_genes:
                        # Check if the percent identity exceeds the significance threshold
                        if hit.percent_identity >= self.resistance_genes[gene_name]["significance_threshold"]:
                            # Add to identified genes if not already there
                            if gene_name not in identified_genes:
                                identified_genes.append(gene_name)
                            
                            # Add matching region
                            region = MatchingRegion(
                                gene_name=gene_name,
                                query_start=hit.query_start,
                                query_end=hit.query_end,
                                subject_start=hit.subject_start,
                                subject_end=hit.subject_end,
                                percent_identity=hit.percent_identity,
                                alignment_length=hit.alignment_length,
                                evalue=hit.evalue
                            )
                            matching_regions.append(region)
            
            # Determine resistance status
            if len(identified_genes) > 0:
                resistance_status = ResistanceStatus.RESISTANT
                # Calculate confidence based on alignment scores and coverage
                confidence_score = self._calculate_confidence_score(matching_regions)
            else:
                # No resistance genes found
                resistance_status = ResistanceStatus.SUSCEPTIBLE
                confidence_score = 100.0 - (len(blast_results[0].hits) * 5) if blast_results and blast_results[0].hits else 95.0  # Reduce confidence if there were some hits
                confidence_score = max(confidence_score, 70.0)  # Minimum confidence for susceptible
            
            # Get treatment recommendations if resistance genes were found
            treatment_recommendations = None
            if resistance_status == ResistanceStatus.RESISTANT:
                treatment_recommendations = self._get_treatment_recommendations(identified_genes)
            
            # Create analysis result
            return ResistanceAnalysisResult(
                sample_id=sample_id,
                resistance_status=resistance_status,
                confidence_score=confidence_score,
                matching_regions=matching_regions,
                identified_genes=identified_genes,
                treatment_recommendations=treatment_recommendations
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing resistance: {str(e)}")
            raise
    
    def _calculate_confidence_score(self, matching_regions: List[MatchingRegion]) -> float:
        """
        Calculate a confidence score based on matching regions
        
        Args:
            matching_regions: List of MatchingRegion objects
            
        Returns:
            Confidence score (0-100%)
        """
        if not matching_regions:
            return 0.0
        
        # Calculate weighted average of percent identity
        total_score = 0.0
        total_length = 0
        
        for region in matching_regions:
            total_score += region.percent_identity * region.alignment_length
            total_length += region.alignment_length
        
        avg_identity = total_score / total_length if total_length > 0 else 0
        
        # Adjust confidence based on number of matching regions
        region_count_factor = min(len(matching_regions) * 5, 20)  # Up to 20% boost for multiple regions
        
        # Adjust confidence based on e-values
        evalue_factor = 0.0
        for region in matching_regions:
            if region.evalue < 1e-100:
                evalue_factor += 10.0
            elif region.evalue < 1e-50:
                evalue_factor += 5.0
            elif region.evalue < 1e-20:
                evalue_factor += 2.0
        evalue_factor = min(evalue_factor, 10.0)  # Cap at 10%
        
        # Calculate final confidence
        confidence = avg_identity + region_count_factor + evalue_factor
        confidence = min(confidence, 100.0)  # Cap at 100%
        
        return confidence
    
    def _get_treatment_recommendations(self, identified_genes: List[str]) -> TreatmentRecommendation:
        """
        Get treatment recommendations based on identified resistance genes
        
        Args:
            identified_genes: List of identified resistance genes
            
        Returns:
            TreatmentRecommendation object
        """
        # Collect antibiotics to avoid based on identified genes
        avoid_antibiotics = []
        for gene in identified_genes:
            if gene in self.resistance_genes:
                avoid_antibiotics.extend(self.resistance_genes[gene]["resistance_to"])
        
        # Remove duplicates
        avoid_antibiotics = list(set(avoid_antibiotics))
        
        # Define recommended antibiotics based on identified resistance
        recommended_antibiotics = []
        
        # Check for MRSA (mecA gene)
        if "mecA" in identified_genes:
            recommended_antibiotics.extend(["Vancomycin", "Linezolid", "Daptomycin", "Trimethoprim-sulfamethoxazole"])
            
            # If vanA is also present, modify recommendations
            if "vanA" in identified_genes:
                if "Vancomycin" in recommended_antibiotics:
                    recommended_antibiotics.remove("Vancomycin")
                recommended_antibiotics.extend(["Dalbavancin", "Telavancin"])
        else:
            # For non-MRSA S. aureus
            recommended_antibiotics.extend(["Cefazolin", "Oxacillin", "Dicloxacillin"])
        
        # Get AI-generated treatment notes if Groq service is available
        notes = None
        confidence = 95.0
        
        if self.groq_service:
            try:
                notes = self.groq_service.get_treatment_recommendations(
                    identified_genes=identified_genes,
                    recommended_antibiotics=recommended_antibiotics,
                    avoid_antibiotics=avoid_antibiotics
                )
                confidence = 98.0  # Higher confidence with AI-generated recommendations
            except Exception as e:
                self.logger.error(f"Error getting AI treatment recommendations: {str(e)}")
                notes = "Automated recommendations based on detected resistance genes."
        else:
            notes = "Automated recommendations based on detected resistance genes."
        
        return TreatmentRecommendation(
            recommended_antibiotics=recommended_antibiotics,
            avoid_antibiotics=avoid_antibiotics,
            notes=notes,
            confidence=confidence
        )
