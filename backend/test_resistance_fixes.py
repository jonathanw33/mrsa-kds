#!/usr/bin/env python3
"""
Test script to verify that the BLAST and resistance analysis fixes work correctly
"""

import sys
import os
sys.path.append('/mnt/g/Documents/AA ITB/mrsa-kds/backend')

from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService

def test_samples():
    """Test both resistant and susceptible samples"""
    
    blast_service = BlastService()
    analysis_service = ResistanceAnalysisService()
    
    # Test samples
    samples = [
        {
            'name': 'mecA_gene_sample.fasta',
            'path': '/mnt/g/Documents/AA ITB/mrsa-kds/mecA_gene_sample.fasta',
            'expected': 'RESISTANT'
        },
        {
            'name': 'e_coli_sample.fasta', 
            'path': '/mnt/g/Documents/AA ITB/mrsa-kds/e_coli_sample.fasta',
            'expected': 'SUSCEPTIBLE'
        },
        {
            'name': 'ermA_gene_sample.fasta',
            'path': '/mnt/g/Documents/AA ITB/mrsa-kds/ermA_gene_sample.fasta', 
            'expected': 'RESISTANT'
        },
        {
            'name': 'random_dna_sample.fasta',
            'path': '/mnt/g/Documents/AA ITB/mrsa-kds/random_dna_sample.fasta',
            'expected': 'SUSCEPTIBLE'
        }
    ]
    
    print("=== MRSA Resistance Analysis Test ===\n")
    
    for sample in samples:
        print(f"Testing: {sample['name']}")
        print(f"Expected: {sample['expected']}")
        
        try:
            # Run BLAST
            blast_results = blast_service.run_blast(sample['path'])
            print(f"BLAST hits found: {len(blast_results[0].hits) if blast_results else 0}")
            
            # Run resistance analysis  
            analysis = analysis_service.analyze_resistance(blast_results)
            
            print(f"Result: {analysis.resistance_status}")
            print(f"Confidence: {analysis.confidence_score}%")
            print(f"Identified genes: {analysis.identified_genes}")
            
            # Check if result matches expectation
            status_match = analysis.resistance_status.value.upper() == sample['expected']
            print(f"✓ Correct result: {status_match}")
            
            if analysis.matching_regions:
                print("Matching regions:")
                for region in analysis.matching_regions:
                    print(f"  - {region.gene_name}: {region.percent_identity:.1f}% identity")
            
            print("-" * 50)
            
        except Exception as e:
            print(f"❌ Error testing {sample['name']}: {str(e)}")
            import traceback
            traceback.print_exc()
            print("-" * 50)

if __name__ == "__main__":
    test_samples()
