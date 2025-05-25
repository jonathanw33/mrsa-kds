#!/usr/bin/env python3
"""
Script to download real S. aureus sequences for testing the MRSA-KDS app
"""

import requests
import os
from Bio import Entrez, SeqIO
import time

# Set your email for NCBI (required)
Entrez.email = "jonathanwiguna2004@gmail.com"  # Change this to your email

def download_ncbi_sequence(accession, output_dir="test_sequences"):
    """Download a sequence from NCBI by accession number"""
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        print(f"Downloading {accession}...")
        
        # Fetch the sequence
        handle = Entrez.efetch(db="nucleotide", id=accession, rettype="fasta", retmode="text")
        record = SeqIO.read(handle, "fasta")
        handle.close()
        
        # Save to file
        filename = f"{output_dir}/{accession.replace('.', '_')}.fasta"
        with open(filename, "w") as f:
            SeqIO.write(record, f, "fasta")
        
        print(f"✅ Saved: {filename}")
        return filename
        
    except Exception as e:
        print(f"❌ Error downloading {accession}: {e}")
        return None

def create_test_sequences():
    """Create a set of real test sequences"""
    
    print("🧬 Downloading real S. aureus sequences for testing...")
    
    # Real S. aureus sequences with different resistance patterns
    test_sequences = {
        # MRSA strains (should detect mecA)
        "MRSA_USA300": "CP000255.1",      # MRSA USA300 complete genome
        "MRSA_N315": "BA000018.3",        # MRSA N315 complete genome
        
        # MSSA strains (should NOT detect mecA)
        "MSSA_8325": "CP000253.1",        # MSSA strain 8325-4 complete genome
        
        # Individual resistance genes for targeted testing
        "mecA_gene": "X52593.1",          # mecA gene sequence
        "vanA_gene": "M97297.1",          # vanA gene sequence
        "ermC_gene": "M19652.1",          # ermC gene sequence
    }
    
    results = {}
    
    for name, accession in test_sequences.items():
        print(f"\n📥 {name} ({accession})")
        filename = download_ncbi_sequence(accession)
        if filename:
            results[name] = filename
        
        # Be nice to NCBI servers
        time.sleep(1)
    
    print(f"\n✅ Downloaded {len(results)} test sequences!")
    print("\n📋 Test Plan:")
    print("1. MRSA_USA300 & MRSA_N315 → Should detect mecA (RESISTANT)")
    print("2. MSSA_8325 → Should NOT detect mecA (SUSCEPTIBLE)")  
    print("3. Individual genes → Should detect respective resistance")
    
    return results

if __name__ == "__main__":
    # Change the email first!
    if "your.email@example.com" in Entrez.email:
        print("⚠️  Please change the email address in the script first!")
        print("   Set Entrez.email to your actual email address")
        exit(1)
    
    test_files = create_test_sequences()
    
    print(f"\n🎯 Ready to test! Upload these files to your MRSA-KDS app:")
    for name, filepath in test_files.items():
        print(f"   • {name}: {filepath}")
