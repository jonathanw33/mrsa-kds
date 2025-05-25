import os
import sys
import logging
from pathlib import Path
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import services
from services.blast_service import BlastService
from services.resistance_analysis_service import ResistanceAnalysisService
from utils.config import Settings

def generate_sample_sequence(output_path):
    """Generate a sample sequence for testing"""
    logger.info("Generating sample sequence...")
    
    # Create a sample MRSA sequence with mecA gene inserted
    # This is a simplified example - in reality, you would use a real MRSA sample
    
    # Generate a random background sequence
    background_seq = "".join(["ATGC"[i % 4] for i in range(5000)])
    
    # Read the mecA gene from our database
    settings = Settings()
    blast_db_path = settings.BLAST_DB_PATH
    reference_path = os.path.join(blast_db_path, "resistance_genes.fasta")
    
    mec_a_seq = None
    
    if os.path.exists(reference_path):
        # Find mecA gene in the reference file
        for record in SeqIO.parse(reference_path, "fasta"):
            if "mecA" in record.id:
                mec_a_seq = str(record.seq)
                logger.info(f"Found mecA gene: {record.id}")
                break
    
    if not mec_a_seq:
        # Use a short dummy mecA sequence if we can't find the real one
        logger.warning("mecA gene not found in reference, using dummy sequence")
        mec_a_seq = "ATGAAAAAGATAAAAATTGTTCCACTATTAATTGTCATAGCATGCGATAACGACGTACGTA"
    
    # Insert mecA gene in the middle of the background sequence
    insert_pos = len(background_seq) // 2
    full_seq = background_seq[:insert_pos] + mec_a_seq + background_seq[insert_pos:]
    
    # Create a FASTA record
    sample_record = SeqRecord(
        Seq(full_seq),
        id="sample_mrsa_1",
        description="Sample MRSA sequence with mecA gene"
    )
    
    # Write to FASTA file
    SeqIO.write(sample_record, output_path, "fasta")
    logger.info(f"Sample sequence generated and saved to {output_path}")
    
    return output_path

def test_sequence_analysis():
    """Test the sequence analysis pipeline"""
    logger.info("Testing sequence analysis...")
    
    try:
        # Generate a sample sequence
        sample_path = "sample_mrsa.fasta"
        generate_sample_sequence(sample_path)
        
        # Initialize services
        blast_service = BlastService()
        analysis_service = ResistanceAnalysisService()
        
        # Run BLAST
        logger.info("Running BLAST...")
        blast_results = blast_service.run_blast(sample_path)
        
        # Print BLAST hits
        for result in blast_results:
            logger.info(f"Query: {result.query_id} (length: {result.query_length})")
            logger.info(f"Found {len(result.hits)} hits")
            
            for i, hit in enumerate(result.hits):
                logger.info(f"  Hit {i+1}: {hit.subject_id}")
                logger.info(f"    Identity: {hit.percent_identity:.2f}%")
                logger.info(f"    Alignment length: {hit.alignment_length}")
                logger.info(f"    Query region: {hit.query_start}-{hit.query_end}")
                logger.info(f"    Subject region: {hit.subject_start}-{hit.subject_end}")
        
        # Analyze resistance
        logger.info("Analyzing resistance...")
        analysis_result = analysis_service.analyze_resistance(blast_results)
        
        # Print analysis result
        logger.info(f"Resistance status: {analysis_result.resistance_status}")
        logger.info(f"Confidence score: {analysis_result.confidence_score:.2f}%")
        logger.info(f"Identified genes: {', '.join(analysis_result.identified_genes)}")
        
        if analysis_result.treatment_recommendations:
            rec = analysis_result.treatment_recommendations
            logger.info("Treatment recommendations:")
            logger.info(f"  Recommended antibiotics: {', '.join(rec.recommended_antibiotics)}")
            logger.info(f"  Antibiotics to avoid: {', '.join(rec.avoid_antibiotics)}")
            if rec.notes:
                logger.info(f"  Notes: {rec.notes}")
        
        logger.info("Test completed successfully")
        
    except Exception as e:
        logger.error(f"Error in test: {str(e)}")
        raise

if __name__ == "__main__":
    test_sequence_analysis()
