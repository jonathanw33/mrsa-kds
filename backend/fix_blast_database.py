#!/usr/bin/env python3
"""
Fix the BLAST database to include proper reference sequences
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.blast_service import BlastService

def fix_blast_database():
    """Add proper reference sequences and rebuild database"""
    
    # Path to resistance genes file
    blast_service = BlastService()
    fasta_file = os.path.join(blast_service.blast_db_path, "resistance_genes.fasta")
    
    print("🔧 Fixing BLAST database with proper reference sequences...")
    
    # Add a different mecC reference (not identical to sample)
    mecC_reference = """
>mecC_LN865141.1_reference
ATGAATAAGAACAATATCGTAAATAATTTAATTGCATTGTTATTTTCAGGTTTCGGCATATTTTTCA
CAAAGGCAGATAGTTATGGCAGTAGTAGATATTAATGAACGCCCAATAAAACTACTTAGAAACGAGA
GGGCGGCTCCATTATTTTTACCACGATTTCACGCTTTTTATATCAACAAAACTAGATAAGATTGTTA
TTGGATTTATAGGTCAACATTCAAGTATTTATTATTTCGTCTATTGTTTACGAGGATCTTGCTGAAA
GATTGTCAGACTATCATTTAGTGAACGTGTTCATTTATTTATGATAACATCAAATTAATAACACCTG
CAGCTACTATGCCTAAGCCAAGTATGTTTCAAAGTTTTATGATTGATACTTTTATTGCGGAAGTTTC
TGGTGTTCCTATTCTATATACAGTTGTAAATATACGATTAAATGGTATAAATCTTGAAGATGTACTT
CAAACCCAAGAAACTATAAAATTTTCAATTTACCTTGGTCAAATGGTTTGTCAAAGCACGTGAAGCA
CTCGAAAAGATGCTATCAATAATGCTGGCAATGCACATGCTTGCTTTTTTAATGTTTCACAATATGG
TATATGGAAAGATTTTTCTTTCAACTGTCCTTTCAATTGCAATTGCACATTGTACAGATAAGTAAAA
AAAGAACGTATTCGTAATAACATGAAAATTGATAAAGCAACTGGTACTGTGTGGTCATTCTTTACCT
ATATGGTAATAGCGTAGACTTAGGCGTCGAAGAAGGAACAATGGGTACGGGTCATACTTCAACTAAA
TTATTCAACCTAGAAAATAGCCTAATGGCAAAATATGTGGATAAAAAATTGGCTTTCGTTCAAGAGA
CTTTTGATCTGAATAAAAATCAAGAAGCACCGAAACATTATTTTGAGAAAAAAAAGATTAATATGAC
AGCGGAAGAACCAAACCTTAAAAACAAAGATGGTAAGGATCTTCAGCAAGAAAATGGACAAGCCATT
AACAAAATATTGGGTAAAGAAACCTCTCAACTTAAAGCAATATATCAAGAAAACACCCAAGCAAGTA
ACAAACAAGGTCCTGATATAGTAGGTTATGCAGACAATACACAAGAACTAAATTATGACAAAAACGA
TTTATCTGGAAAAGGGTATTTAGATGAATTATGGGGTGAAGATTACGGTTGGTTTGCAAAAAAAACT
TTCGCATATGATGATTCAGCAAACTTAGTTTATAGTGCTCAGAGTGTTATTCCTTTATTTACTACAG
TTCGTGAACATAATGATGCAGTTCTTATTCGTAAAAAAATTATTAGTGATAATAGTAATAATAATGC
TCATAGTCATATCTACACAGAAAATTATTTTAATCATAGTTTAAATTCGTCTTCGTGTAAGCGACGA
CGTGTACACTTTTAAAAAGGATGTAATTAATTATAAGAAAAACAAACAAGGTTCTGATTTTAAAGCT
TACAAAACCGATTTTAAAACCCCTAAAAAACACTTGAAGGATATTAAATCACTGGAAAAGAGAAATA
TTAAAAAATTAACAGCTACTCCAGACAATTTTGTATTAAATTTGTCACAATTGAATATAAATGGTAT
TGATTACACAGGATGTTCAAATTATGAACCTGCAATTACAGTAGTCTTGTTTGGTGTAACTTTTATT
TGGGGTTATGAAAAGAGAGTAAGTTCCAGTATTATGTCAAAATGACTACGGCCATATGAACATACTT
AGTATTATTAATGACTAA
"""
    
    # Remove the duplicate mecC that was identical to sample
    print("📝 Reading current database...")
    with open(fasta_file, 'r') as f:
        content = f.read()
    
    # Remove the problematic mecC entry
    lines = content.split('\n')
    new_lines = []
    skip_until_next_gene = False
    
    for line in lines:
        if line.startswith('>mecC_gene_variant_LGA251'):
            skip_until_next_gene = True
            continue
        elif line.startswith('>') and skip_until_next_gene:
            skip_until_next_gene = False
        
        if not skip_until_next_gene:
            new_lines.append(line)
    
    # Write back without the problematic mecC
    with open(fasta_file, 'w') as f:
        f.write('\n'.join(new_lines))
    
    # Add the better mecC reference
    with open(fasta_file, 'a') as f:
        f.write(mecC_reference)
    
    print("✅ Updated database with proper reference sequences")
    
    # Rebuild database
    success = blast_service.create_blast_db(fasta_file, "resistance_genes")
    
    if success:
        print("✅ BLAST database rebuilt successfully!")
        return True
    else:
        print("❌ Failed to rebuild database")
        return False

if __name__ == "__main__":
    fix_blast_database()
