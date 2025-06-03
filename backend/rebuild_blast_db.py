#!/usr/bin/env python3
"""
Script to rebuild the BLAST database after adding mecC gene
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.blast_service import BlastService

def rebuild_blast_database():
    """Rebuild the BLAST database with the updated resistance genes"""
    
    blast_service = BlastService()
    
    # Path to the resistance genes FASTA file
    fasta_file = os.path.join(blast_service.blast_db_path, "resistance_genes.fasta")
    
    if not os.path.exists(fasta_file):
        print(f"❌ Error: resistance_genes.fasta not found at {fasta_file}")
        return False
    
    print("🔄 Rebuilding BLAST database with updated resistance genes...")
    print(f"📂 Source file: {fasta_file}")
    
    # Create the BLAST database
    success = blast_service.create_blast_db(fasta_file, "resistance_genes")
    
    if success:
        print("✅ BLAST database rebuilt successfully!")
        
        # Test that mecC is now in the database
        available_genes = blast_service.get_available_reference_genes()
        mecc_found = any('mecC' in gene for gene in available_genes)
        
        if mecc_found:
            print("✅ mecC gene is now available in the database!")
        else:
            print("⚠️  mecC gene may not be properly indexed")
            
        print(f"📊 Total genes in database: {len(available_genes)}")
        
    else:
        print("❌ Failed to rebuild BLAST database")
    
    return success

if __name__ == "__main__":
    rebuild_blast_database()
