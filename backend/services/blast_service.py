import os
import subprocess
import tempfile
import uuid
from typing import List, Dict, Any, Optional
import logging
from Bio.Blast.Applications import NcbiblastnCommandline
from Bio.Blast import NCBIXML
from Bio import SeqIO
from Bio import pairwise2
from Bio.Seq import Seq
from models.blast_model import BlastResult, BlastHit
from utils.config import Settings
from debug_logging import info_log

class BlastService:
    """Service for running BLAST alignments"""
    
    def __init__(self):
        self.settings = Settings()
        self.blast_db_path = self.settings.BLAST_DB_PATH
        
        # Ensure required directories exist
        os.makedirs(self.blast_db_path, exist_ok=True)
        os.makedirs(self.settings.TEMP_UPLOADS_DIR, exist_ok=True)
        
        # Initialize logger
        self.logger = logging.getLogger(__name__)
        
        # Set up BLAST path - always use system commands in Docker
        self.blastn_cmd = "blastn"
        self.makeblastdb_cmd = "makeblastdb"
        self.blastdbcmd = "blastdbcmd"
    
    def run_blast(self, query_file_path: str, evalue: float = 1e-10, max_hits: int = 10) -> List[BlastResult]:
        """
        Run BLAST alignment on a query sequence
        
        Args:
            query_file_path: Path to the FASTA file containing the query sequence
            evalue: E-value threshold
            max_hits: Maximum number of hits to return
            
        Returns:
            List of BlastResult objects
        """
        try:
            info_log("===== BLAST ANALYSIS STARTING =====")
            info_log(f"Query file: {query_file_path}")
            info_log(f"E-value threshold: {evalue}")
            info_log(f"Max hits: {max_hits}")
            
            # Check if BLAST database exists
            db_path = os.path.join(self.blast_db_path, "resistance_genes")
            fasta_path = f"{db_path}.fasta"
            
            # Log the query file contents for debugging
            info_log(f"Processing query file: {query_file_path}")
            with open(query_file_path, 'r') as f:
                query_content = f.read()
                info_log(f"Query file content (first 100 chars): {query_content[:100]}...")
                
                # Count sequences in the file
                seq_count = query_content.count('>')
                info_log(f"Number of sequences in query file: {seq_count}")
            
            # Log the reference database info
            if os.path.exists(fasta_path):
                info_log(f"Reference database exists at: {fasta_path}")
                with open(fasta_path, 'r') as f:
                    ref_content = f.read()
                    ref_seq_count = ref_content.count('>')
                    info_log(f"Reference database contains {ref_seq_count} sequences")
                    info_log(f"First 100 chars of reference DB: {ref_content[:100]}...")
            else:
                info_log(f"WARNING: Reference database file not found at: {fasta_path}")
            
            # If BLAST database doesn't exist but we have a FASTA file, use direct comparison
            if not (os.path.exists(f"{db_path}.nin") or os.path.exists(f"{db_path}.nsq")) and os.path.exists(fasta_path):
                self.logger.info("BLAST database not found, using direct sequence comparison")
                return self._run_direct_comparison(query_file_path, fasta_path, evalue, max_hits)
            
            # Otherwise, try to use BLAST
            # Create a temporary file for BLAST output
            output_file = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}.xml")
            
            # Prepare the BLAST command
            blast_cmd = NcbiblastnCommandline(
                cmd=self.blastn_cmd,
                query=query_file_path,
                subject=fasta_path,  # Use subject instead of db
                evalue=evalue,
                outfmt=5,  # XML output format
                max_target_seqs=max_hits,
                out=output_file
            )
            
            # Run BLAST
            self.logger.info(f"Running BLAST with command: {blast_cmd}")
            stdout, stderr = blast_cmd()
            
            self.logger.info("BLAST command completed")
            if stdout:
                self.logger.info(f"BLAST stdout: {stdout}")
            if stderr:
                self.logger.warning(f"BLAST stderr: {stderr}")
            
            # Parse BLAST results
            results = []
            with open(output_file) as result_handle:
                info_log(f"Parsing BLAST results from: {output_file}")
                blast_records = NCBIXML.parse(result_handle)
                record_count = 0
                
                for record in blast_records:
                    record_count += 1
                    query_id = record.query
                    query_length = record.query_length
                    info_log(f"Processing BLAST record {record_count}: Query ID={query_id}, Length={query_length}")
                    
                    hits = []
                    hit_count = 0
                    for alignment in record.alignments:
                        info_log(f"  Found alignment to: {alignment.hit_id}, length: {alignment.length}")
                        for hsp in alignment.hsps:
                            hit_count += 1
                            percent_identity = (hsp.identities / hsp.align_length) * 100
                            info_log(f"    HSP {hit_count}: Identity={percent_identity:.2f}%, E-value={hsp.expect}, Align length={hsp.align_length}")
                            info_log(f"    Query range: {hsp.query_start}-{hsp.query_end}, Subject range: {hsp.sbjct_start}-{hsp.sbjct_end}")
                            
                            hit = BlastHit(
                                query_id=query_id,
                                subject_id=alignment.hit_id,
                                percent_identity=percent_identity,
                                alignment_length=hsp.align_length,
                                mismatches=hsp.align_length - hsp.identities,
                                gap_opens=hsp.gaps,
                                query_start=hsp.query_start,
                                query_end=hsp.query_end,
                                subject_start=hsp.sbjct_start,
                                subject_end=hsp.sbjct_end,
                                evalue=hsp.expect,
                                bit_score=hsp.bits
                            )
                            hits.append(hit)
                    
                    info_log(f"Total of {hit_count} hits found for query {query_id}")
                    
                    result = BlastResult(
                        query_id=query_id,
                        query_length=query_length,
                        hits=hits
                    )
                    results.append(result)
                
                info_log(f"BLAST analysis complete: {record_count} records processed with a total of {sum(len(r.hits) for r in results)} hits")
                info_log("===== BLAST ANALYSIS FINISHED =====")
            
            # Clean up temporary file
            if os.path.exists(output_file):
                os.remove(output_file)
                
            return results
            
        except Exception as e:
            self.logger.error(f"Error running BLAST: {str(e)}")
            # If BLAST fails, try direct comparison as a fallback
            self.logger.info("Falling back to direct sequence comparison")
            fasta_path = os.path.join(self.blast_db_path, "resistance_genes.fasta")
            if os.path.exists(fasta_path):
                return self._run_direct_comparison(query_file_path, fasta_path, evalue, max_hits)
            else:
                raise
    
    def _run_direct_comparison(self, query_file_path: str, reference_fasta_path: str, evalue: float = 1e-10, max_hits: int = 10) -> List[BlastResult]:
        """
        Run direct sequence comparison using BioPython's pairwise alignment
        
        Args:
            query_file_path: Path to the FASTA file with query sequence
            reference_fasta_path: Path to the FASTA file with reference sequences
            evalue: E-value threshold (not directly used but kept for API consistency)
            max_hits: Maximum number of hits to return
            
        Returns:
            List of BlastResult objects that emulate BLAST outputs
        """
        self.logger.info(f"Running direct sequence comparison between {query_file_path} and {reference_fasta_path}")
        
        try:
            # Load query sequences
            query_records = list(SeqIO.parse(query_file_path, "fasta"))
            
            # Load reference sequences
            reference_records = list(SeqIO.parse(reference_fasta_path, "fasta"))
            
            results = []
            for query_record in query_records:
                query_id = query_record.id
                query_length = len(query_record.seq)
                query_seq = query_record.seq
                
                hits = []
                for ref_record in reference_records:
                    # Perform global alignment
                    # This is a simplified alternative to BLAST but will work for our demo
                    alignments = pairwise2.align.localms(
                        query_seq, 
                        ref_record.seq,
                        2,    # match score
                        -1,   # mismatch penalty
                        -2,   # gap open penalty
                        -0.5  # gap extension penalty
                    )
                    
                    # Take the best alignment
                    if alignments:
                        best_align = alignments[0]
                        
                        # Calculate alignment statistics
                        align_len = 0
                        identities = 0
                        gaps = 0
                        
                        # Find the start and end of the alignment in the sequences
                        q_start = 0
                        s_start = 0
                        
                        for i, (q, s) in enumerate(zip(best_align[0], best_align[1])):
                            if q != '-' and s != '-':
                                align_len += 1
                                if q == s:
                                    identities += 1
                            if q == '-' or s == '-':
                                gaps += 1
                        
                        # Find the actual alignment coordinates
                        q_start = best_align[0].find(next(ch for ch in best_align[0] if ch != '-'))
                        q_end = len(best_align[0]) - best_align[0][::-1].find(next(ch for ch in best_align[0][::-1] if ch != '-'))
                        
                        s_start = best_align[1].find(next(ch for ch in best_align[1] if ch != '-'))
                        s_end = len(best_align[1]) - best_align[1][::-1].find(next(ch for ch in best_align[1][::-1] if ch != '-'))
                        
                        # Calculate other BLAST-like statistics
                        percent_identity = (identities / align_len) * 100 if align_len > 0 else 0
                        
                        # Only include hits above a certain identity threshold
                        if percent_identity >= 70:  # Arbitrary threshold
                            hit = BlastHit(
                                query_id=query_id,
                                subject_id=ref_record.id,
                                percent_identity=percent_identity,
                                alignment_length=align_len,
                                mismatches=align_len - identities,
                                gap_opens=gaps,
                                query_start=q_start,
                                query_end=q_end,
                                subject_start=s_start,
                                subject_end=s_end,
                                evalue=0.001,  # Placeholder value
                                bit_score=best_align[2]  # Score of the alignment
                            )
                            hits.append(hit)
                
                # Sort hits by percent identity (descending)
                hits.sort(key=lambda h: h.percent_identity, reverse=True)
                
                # Limit to max_hits
                hits = hits[:max_hits]
                
                result = BlastResult(
                    query_id=query_id,
                    query_length=query_length,
                    hits=hits
                )
                results.append(result)
            
            return results
            
        except Exception as e:
            self.logger.error(f"Error in direct sequence comparison: {str(e)}")
            raise
    
    def get_available_reference_genes(self) -> List[str]:
        """
        Get a list of available reference resistance genes
        
        Returns:
            List of gene names
        """
        try:
            # Get list of sequences in BLAST database or FASTA file
            gene_list = []
            db_path = os.path.join(self.blast_db_path, "resistance_genes")
            
            # If we're using a local FASTA file as the database
            if os.path.exists(f"{db_path}.fasta"):
                for record in SeqIO.parse(f"{db_path}.fasta", "fasta"):
                    gene_list.append(record.id)
                return gene_list
                
            # Otherwise, use BLAST database information if available
            elif os.path.exists(f"{db_path}.nin") or os.path.exists(f"{db_path}.nsq"):
                try:
                    # Use blastdbcmd to get sequence info
                    cmd = f'"{self.blastdbcmd}" -db "{db_path}" -entry all -outfmt "%t"'
                    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
                    stdout, stderr = process.communicate()
                    
                    if process.returncode == 0:
                        gene_list = stdout.decode().strip().split('\n')
                    else:
                        self.logger.warning(f"Error retrieving sequences with blastdbcmd: {stderr}")
                        # Fall back to using the FASTA file if available
                        if os.path.exists(f"{db_path}.fasta"):
                            return self.get_available_reference_genes()
                except Exception as e:
                    self.logger.warning(f"Error using blastdbcmd: {str(e)}")
                    # Fall back to using the FASTA file if available
                    if os.path.exists(f"{db_path}.fasta"):
                        return self.get_available_reference_genes()
            
            return gene_list
            
        except Exception as e:
            self.logger.error(f"Error getting reference genes: {str(e)}")
            return []
    
    def create_blast_db(self, fasta_file_path: str, db_name: str = "resistance_genes") -> bool:
        """
        Create a BLAST database from a FASTA file
        
        Args:
            fasta_file_path: Path to the FASTA file containing reference sequences
            db_name: Name of the database to create
            
        Returns:
            True if successful, False otherwise
        """
        try:
            db_path = os.path.join(self.blast_db_path, db_name)
            
            # Create BLAST database
            cmd = f'"{self.makeblastdb_cmd}" -in "{fasta_file_path}" -dbtype nucl -out "{db_path}"'
            self.logger.info(f"Creating BLAST database with command: {cmd}")
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            
            if process.returncode == 0:
                self.logger.info(f"BLAST database created successfully: {db_path}")
                return True
            else:
                self.logger.error(f"Error creating BLAST database: {stderr.decode() if stderr else 'Unknown error'}")
                
                # Copy the FASTA file to the database location as a fallback
                self.logger.info(f"Falling back to using FASTA file directly: {fasta_file_path}")
                import shutil
                shutil.copy2(fasta_file_path, f"{db_path}.fasta")
                return True
                
        except Exception as e:
            self.logger.error(f"Error creating BLAST database: {str(e)}")
            return False
    
    def download_reference_genes(self, accession_list: List[str], output_file: str) -> bool:
        """
        Download reference genes from NCBI
        
        Args:
            accession_list: List of NCBI accession numbers
            output_file: Path to save the downloaded sequences
            
        Returns:
            True if successful, False otherwise
        """
        try:
            from Bio import Entrez
            
            # Set Entrez email and API key
            Entrez.email = self.settings.NCBI_EMAIL
            if self.settings.NCBI_API_KEY:
                Entrez.api_key = self.settings.NCBI_API_KEY
            
            # Download sequences
            self.logger.info(f"Downloading {len(accession_list)} sequences from NCBI...")
            handle = Entrez.efetch(db="nucleotide", id=",".join(accession_list), rettype="fasta", retmode="text")
            sequences = handle.read()
            
            # Save to file
            with open(output_file, "w") as f:
                f.write(sequences)
            
            self.logger.info(f"Downloaded sequences saved to {output_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error downloading reference genes: {str(e)}")
            return False
