#!/usr/bin/env python3
"""
Simple test to verify resistance detection is working in Docker
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService

def test_docker_samples():
    """Test samples that should be accessible in Docker"""
    
    # Check what files are available in the mounted directory
    print("Available files in parent directory:")
    parent_dir = "/app/.."
    if os.path.exists(parent_dir):
        files = [f for f in os.listdir(parent_dir) if f.endswith('.fasta')]
        for f in files:
            full_path = os.path.join(parent_dir, f)
            print(f"  - {f} ({'exists' if os.path.exists(full_path) else 'missing'})")
    else:
        print(f"  Parent directory {parent_dir} not found")
    
    # Test with files that exist
    blast_service = BlastService()
    analysis_service = ResistanceAnalysisService()
    
    # Test mecA (known working)
    mecA_path = "/app/../mecA_gene_sample.fasta"
    if os.path.exists(mecA_path):
        print(f"\n=== Testing mecA (should be RESISTANT) ===")
        try:
            blast_results = blast_service.run_blast(mecA_path)
            analysis = analysis_service.analyze_resistance(blast_results)
            print(f"Result: {analysis.resistance_status} | Confidence: {analysis.confidence_score}%")
            print(f"Genes: {analysis.identified_genes}")
        except Exception as e:
            print(f"Error: {e}")
    
    # Test mecC (should now work)
    mecC_path = "/app/../mecC_gene_sample.fasta"
    if os.path.exists(mecC_path):
        print(f"\n=== Testing mecC (should be RESISTANT) ===")
        try:
            blast_results = blast_service.run_blast(mecC_path)
            analysis = analysis_service.analyze_resistance(blast_results)
            print(f"Result: {analysis.resistance_status} | Confidence: {analysis.confidence_score}%")
            print(f"Genes: {analysis.identified_genes}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_docker_samples()
