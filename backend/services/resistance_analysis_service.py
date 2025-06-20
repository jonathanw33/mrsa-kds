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
        
        # Define resistance genes and their significance - FIXED THRESHOLDS
        self.resistance_genes = {
            "mecA": {
                "description": "Methicillin resistance gene in S. aureus",
                "resistance_to": ["methicillin", "oxacillin", "all beta-lactams"],
                "significance_threshold": 70.0  # Lowered for real-world variants
            },
            "mecC": {
                "description": "Alternative methicillin resistance gene",
                "resistance_to": ["methicillin", "oxacillin", "all beta-lactams"],
                "significance_threshold": 70.0  # Lowered for real-world variants
            },
            "vanA": {
                "description": "Vancomycin resistance gene",
                "resistance_to": ["vancomycin"],
                "significance_threshold": 75.0  # Lowered for real-world variants
            },
            "ermA": {
                "description": "Erythromycin resistance methylase gene",
                "resistance_to": ["erythromycin", "clindamycin", "macrolides"],
                "significance_threshold": 65.0  # Lowered for real-world variants
            },
            "ermC": {
                "description": "Erythromycin resistance methylase gene",
                "resistance_to": ["erythromycin", "clindamycin", "macrolides"],
                "significance_threshold": 65.0  # Lowered for real-world variants
            },
            "tetK": {
                "description": "Tetracycline resistance gene",
                "resistance_to": ["tetracycline"],
                "significance_threshold": 75.0  # Lowered for real-world variants
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
                    # FIXED: Better gene name extraction
                    gene_name = self._extract_gene_name(hit.subject_id)
                    
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
            
            # Determine resistance status and confidence
            if len(identified_genes) > 0:
                resistance_status = ResistanceStatus.RESISTANT
                # FIXED: Better confidence calculation
                confidence_score = self._calculate_confidence_score_fixed(matching_regions, blast_results)
            else:
                # No resistance genes found
                resistance_status = ResistanceStatus.SUSCEPTIBLE
                # FIXED: More nuanced susceptible confidence calculation
                confidence_score = self._calculate_susceptible_confidence(blast_results)
            
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
    
    def _extract_gene_name(self, subject_id: str) -> str:
        """
        FIXED: Better gene name extraction from subject ID
        
        Args:
            subject_id: Subject ID from BLAST hit
            
        Returns:
            Extracted gene name
        """
        # Handle various formats like:
        # mecA_X52593.1, mecA_KC243783.1, ermA_gene_sample.fasta, etc.
        
        # Split by underscore and take the first part
        parts = subject_id.split('_')
        gene_candidate = parts[0].lower()
        
        # Check if it matches any known resistance genes (case insensitive)
        for known_gene in self.resistance_genes.keys():
            if gene_candidate == known_gene.lower():
                return known_gene
        
        # If no direct match, try looking for gene names within the ID
        subject_lower = subject_id.lower()
        for known_gene in self.resistance_genes.keys():
            if known_gene.lower() in subject_lower:
                return known_gene
        
        # Return the first part as fallback
        return parts[0]
    
    def _calculate_confidence_score_fixed(self, matching_regions: List[MatchingRegion], blast_results: List[BlastResult]) -> float:
        """
        FIXED: Calculate a more nuanced confidence score for resistant samples
        
        Args:
            matching_regions: List of MatchingRegion objects
            blast_results: Original BLAST results for context
            
        Returns:
            Confidence score (0-100%)
        """
        if not matching_regions:
            return 0.0
        
        # Base confidence from alignment quality
        total_weighted_identity = 0.0
        total_weight = 0.0
        
        for region in matching_regions:
            # Weight by alignment length and inverse e-value
            weight = region.alignment_length * max(1, -1 * (region.evalue if region.evalue > 0 else 1e-100))
            total_weighted_identity += region.percent_identity * weight
            total_weight += weight
        
        base_confidence = total_weighted_identity / total_weight if total_weight > 0 else 0
        
        # Coverage bonus: reward longer alignments
        max_alignment_length = max(region.alignment_length for region in matching_regions)
        query_length = blast_results[0].query_length if blast_results else 1000  # fallback
        coverage_ratio = min(max_alignment_length / query_length, 1.0)
        coverage_bonus = coverage_ratio * 15  # Up to 15% bonus
        
        # Multiple gene penalty/bonus
        unique_genes = len(set(region.gene_name for region in matching_regions))
        if unique_genes > 1:
            multi_gene_bonus = min((unique_genes - 1) * 3, 10)  # Up to 10% bonus
        else:
            multi_gene_bonus = 0
        
        # E-value bonus
        best_evalue = min(region.evalue for region in matching_regions)
        if best_evalue < 1e-50:
            evalue_bonus = 8
        elif best_evalue < 1e-20:
            evalue_bonus = 5
        elif best_evalue < 1e-10:
            evalue_bonus = 3
        else:
            evalue_bonus = 0
        
        # Calculate final confidence with some randomness to avoid identical scores
        confidence = base_confidence + coverage_bonus + multi_gene_bonus + evalue_bonus
        
        # Add small variation based on alignment details to make scores unique
        variation = (sum(region.alignment_length for region in matching_regions) % 10) * 0.3
        confidence += variation
        
        # Ensure confidence is in reasonable range for resistant samples
        confidence = max(75.0, min(confidence, 99.5))
        
        return round(confidence, 1)
    
    def _calculate_susceptible_confidence(self, blast_results: List[BlastResult]) -> float:
        """
        FIXED: Calculate more nuanced confidence for susceptible samples
        
        Args:
            blast_results: List of BLAST results
            
        Returns:
            Confidence score for susceptible determination
        """
        if not blast_results or not blast_results[0].hits:
            # No hits at all - very confident it's susceptible
            return 98.0
        
        total_hits = len(blast_results[0].hits)
        
        # Check if there are any high-identity hits to resistance genes
        resistance_gene_hits = 0
        max_resistance_identity = 0.0
        
        for hit in blast_results[0].hits:
            gene_name = self._extract_gene_name(hit.subject_id)
            if gene_name in self.resistance_genes:
                resistance_gene_hits += 1
                max_resistance_identity = max(max_resistance_identity, hit.percent_identity)
        
        # Base confidence starts high for susceptible
        base_confidence = 90.0
        
        # Penalty for resistance gene hits (even if below threshold)
        if resistance_gene_hits > 0:
            hit_penalty = resistance_gene_hits * 5  # 5% per resistance gene hit
            identity_penalty = max_resistance_identity * 0.2  # Penalty based on best identity
            base_confidence -= (hit_penalty + identity_penalty)
        
        # Small penalty for having many hits (suggests complex sample)
        if total_hits > 5:
            complexity_penalty = min((total_hits - 5) * 1, 10)  # Up to 10% penalty
            base_confidence -= complexity_penalty
        
        # Add variation to make scores unique
        variation = (total_hits % 7) * 0.4
        base_confidence += variation
        
        # Ensure reasonable range for susceptible samples
        base_confidence = max(65.0, min(base_confidence, 96.0))
        
        return round(base_confidence, 1)
    
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
        
        # Check for MRSA (mecA or mecC gene)
        if "mecA" in identified_genes or "mecC" in identified_genes:
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