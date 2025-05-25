import os
import sys
import subprocess
import logging
from pathlib import Path
import requests
from Bio import Entrez, SeqIO

# Add parent directory to path so we can import from parent modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.config import Settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('init_blast_db.log')
    ]
)
logger = logging.getLogger(__name__)

# Load settings
settings = Settings()

# MRSA resistance genes accession numbers
RESISTANCE_GENES = {
    # mecA genes (methicillin resistance)
    "mecA": ["X52593.1", "KC243783.1", "Y00688.1", "AB505628.1", "AB033763.2"],
    
    # vanA genes (vancomycin resistance)
    "vanA": ["M97297.1", "AY486242.1", "AY743421.1"],
    
    # ermA genes (erythromycin resistance)
    "ermA": ["M17990.1", "X03216.1", "AB563188.1"],
    
    # ermC genes (erythromycin resistance)
    "ermC": ["M19652.1", "V01278.1", "AB089503.1"],
    
    # tetK genes (tetracycline resistance)
    "tetK": ["J01830.1", "M16217.1", "U38428.1"]
}

def download_resistance_genes():
    """Download resistance genes from NCBI"""
    logger.info("Downloading resistance genes from NCBI")
    
    # Set Entrez email and API key
    Entrez.email = settings.NCBI_EMAIL
    if settings.NCBI_API_KEY:
        Entrez.api_key = settings.NCBI_API_KEY
    
    # Get absolute path to backend dir
    backend_dir = Path(__file__).parent.parent.absolute()
    
    # Create output directory with absolute path
    blast_db_path = backend_dir / settings.BLAST_DB_PATH
    os.makedirs(blast_db_path, exist_ok=True)
    
    # Output FASTA file with absolute path
    output_file = blast_db_path / "resistance_genes.fasta"
    
    # Download and save sequences
    with open(output_file, "w") as f:
        for gene_name, accessions in RESISTANCE_GENES.items():
            logger.info(f"Downloading {gene_name} sequences: {', '.join(accessions)}")
            
            # Download sequences in batches
            try:
                handle = Entrez.efetch(db="nucleotide", id=",".join(accessions), rettype="fasta", retmode="text")
                records = SeqIO.parse(handle, "fasta")
                
                # Rename sequences to include gene name
                for i, record in enumerate(records):
                    # Modify sequence ID to include gene name
                    record.id = f"{gene_name}_{record.id}"
                    record.description = f"{gene_name} {record.description}"
                    
                    # Write to file
                    SeqIO.write(record, f, "fasta")
            except Exception as e:
                logger.error(f"Error downloading {gene_name} sequences: {str(e)}")
    
    logger.info(f"Downloaded resistance genes saved to {output_file}")
    return str(output_file)

def create_blast_db(fasta_file):
    """Create BLAST database from FASTA file"""
    logger.info("Creating BLAST database")
    
    # Get absolute path to backend dir
    backend_dir = Path(__file__).parent.parent.absolute()
    
    # Get absolute path to db
    blast_db_path = backend_dir / settings.BLAST_DB_PATH
    db_path = blast_db_path / "resistance_genes"
    
    # Get makeblastdb command path
    makeblastdb_cmd = "makeblastdb"
    if settings.BLAST_BIN_PATH:
        makeblastdb_cmd = Path(settings.BLAST_BIN_PATH) / "makeblastdb.exe"
    
    # Create BLAST database with proper paths
    # Note: Windows paths need double quotes to handle spaces
    cmd = f'"{makeblastdb_cmd}" -in "{fasta_file}" -dbtype nucl -out "{db_path}" -title "MRSA_Resistance_Genes"'
    logger.info(f"Running command: {cmd}")
    
    try:
        process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            logger.info(f"BLAST database created successfully: {db_path}")
            logger.info(f"Output: {stdout.decode() if stdout else ''}")
            return True
        else:
            logger.error(f"Error creating BLAST database: {stderr.decode() if stderr else 'Unknown error'}")
            return False
    except Exception as e:
        logger.error(f"Error creating BLAST database: {e}")
        return False

def main():
    """Main function to initialize BLAST database"""
    logger.info("Initializing BLAST database")
    
    try:
        # Download resistance genes
        fasta_file = download_resistance_genes()
        
        # Create BLAST database
        if create_blast_db(fasta_file):
            logger.info("BLAST database initialization successful")
        else:
            logger.error("BLAST database initialization failed")
            
    except Exception as e:
        logger.error(f"Error initializing BLAST database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
