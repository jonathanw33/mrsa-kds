#!/usr/bin/env python3
"""
Debug script to check why ermA, ermC, and mecC samples are showing as susceptible
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService

def debug_sample(sample_name, sample_path):
    """Debug a specific sample"""
    print(f"\n{'='*60}")
    print(f"DEBUGGING: {sample_name}")
    print(f"{'='*60}")
    
    try:
        blast_service = BlastService()
        analysis_service = ResistanceAnalysisService()
        
        # Run BLAST
        print("Running BLAST...")
        blast_results = blast_service.run_blast(sample_path)
        
        if not blast_results:
            print("❌ No BLAST results returned!")
            return
            
        print(f"Query: {blast_results[0].query_id}")
        print(f"Query length: {blast_results[0].query_length}")
        print(f"Number of hits: {len(blast_results[0].hits)}")
        
        # Show top hits
        print(f"\nTop 5 BLAST hits:")
        for i, hit in enumerate(blast_results[0].hits[:5]):
            gene_name = analysis_service._extract_gene_name(hit.subject_id)
            print(f"  {i+1}. Subject: {hit.subject_id}")
            print(f"     Extracted gene: {gene_name}")
            print(f"     Identity: {hit.percent_identity:.1f}%")
            print(f"     E-value: {hit.evalue}")
            print(f"     Alignment length: {hit.alignment_length}")
            
            # Check if it's a known resistance gene
            if gene_name in analysis_service.resistance_genes:
                threshold = analysis_service.resistance_genes[gene_name]["significance_threshold"]
                meets_threshold = hit.percent_identity >= threshold
                print(f"     Threshold: {threshold}% | Meets threshold: {meets_threshold}")
            print()
        
        # Run resistance analysis
        print("Running resistance analysis...")
        analysis = analysis_service.analyze_resistance(blast_results)
        
        print(f"\nRESULT:")
        print(f"  Status: {analysis.resistance_status}")
        print(f"  Confidence: {analysis.confidence_score}%")
        print(f"  Identified genes: {analysis.identified_genes}")
        print(f"  Matching regions: {len(analysis.matching_regions)}")
        
        return analysis
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """Debug all problematic samples"""
    
    # Docker container paths (mounted from host)
    samples = [
        ("ermA_gene_sample.fasta", "/app/../ermA_gene_sample.fasta"),
        ("ermC_gene_sample.fasta", "/app/../ermC_gene_sample.fasta"), 
        ("mecC_gene_sample.fasta", "/app/../mecC_gene_sample.fasta"),
        ("mecA_gene_sample.fasta", "/app/../mecA_gene_sample.fasta")  # For comparison
    ]
    
    for sample_name, sample_path in samples:
        if os.path.exists(sample_path):
            debug_sample(sample_name, sample_path)
        else:
            print(f"❌ Sample not found: {sample_path}")

if __name__ == "__main__":
    main()
