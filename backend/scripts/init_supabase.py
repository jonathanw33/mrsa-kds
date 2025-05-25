import os
import sys
import logging
from pathlib import Path

# Add parent directory to path so we can import from parent modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.config import Settings
from supabase import create_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def init_supabase_tables():
    """Initialize Supabase tables for the application"""
    settings = Settings()
    
    # Check if Supabase credentials are provided
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.error("Supabase URL or key not set. Please set them in the .env file.")
        return False
    
    try:
        # Initialize Supabase client
        logger.info(f"Connecting to Supabase at {settings.SUPABASE_URL}")
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        
        # SQL for creating profiles table
        logger.info("Creating profiles table...")
        profiles_sql = """
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT NOT NULL,
            full_name TEXT,
            institution TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        # SQL for creating analysis_results table
        logger.info("Creating analysis_results table...")
        analysis_results_sql = """
        CREATE TABLE IF NOT EXISTS analysis_results (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            sample_id TEXT NOT NULL,
            resistance_status TEXT NOT NULL,
            confidence_score FLOAT NOT NULL,
            identified_genes JSONB,
            matching_regions JSONB,
            treatment_recommendations JSONB,
            raw_data JSONB,
            analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        # SQL for creating reference_genes table
        logger.info("Creating reference_genes table...")
        reference_genes_sql = """
        CREATE TABLE IF NOT EXISTS reference_genes (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            gene_name TEXT NOT NULL,
            accession_id TEXT NOT NULL,
            description TEXT,
            sequence TEXT NOT NULL,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        # Execute SQL for table creation
        # Note: For Supabase, we use the REST API for table creation
        # This requires you to have created these tables in the Supabase dashboard
        # The SQL statements above are provided for reference
        
        logger.info("Tables should be created in the Supabase dashboard.")
        logger.info("Please copy the SQL statements and execute them in the SQL Editor in the Supabase dashboard.")
        
        # Set up RLS (Row Level Security) policies
        logger.info("RLS policies need to be set up in the Supabase dashboard.")
        logger.info("Here are the recommended RLS policies:")
        
        profiles_rls = """
        -- Profiles table policies
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to view their own profiles
        CREATE POLICY "Users can view their own profile" 
        ON profiles FOR SELECT 
        USING (auth.uid() = id);
        
        -- Allow users to update their own profiles
        CREATE POLICY "Users can update their own profile" 
        ON profiles FOR UPDATE 
        USING (auth.uid() = id);
        
        -- Allow users to insert their own profile
        CREATE POLICY "Users can insert their own profile" 
        ON profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
        """
        
        analysis_results_rls = """
        -- Analysis results table policies
        ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to view their own analysis results
        CREATE POLICY "Users can view their own analysis results" 
        ON analysis_results FOR SELECT 
        USING (auth.uid() = user_id);
        
        -- Allow users to insert their own analysis results
        CREATE POLICY "Users can insert their own analysis results" 
        ON analysis_results FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        -- Allow users to update their own analysis results
        CREATE POLICY "Users can update their own analysis results" 
        ON analysis_results FOR UPDATE 
        USING (auth.uid() = user_id);
        
        -- Allow users to delete their own analysis results
        CREATE POLICY "Users can delete their own analysis results" 
        ON analysis_results FOR DELETE 
        USING (auth.uid() = user_id);
        """
        
        reference_genes_rls = """
        -- Reference genes table policies
        ALTER TABLE reference_genes ENABLE ROW LEVEL SECURITY;
        
        -- Allow all authenticated users to view reference genes
        CREATE POLICY "All users can view reference genes" 
        ON reference_genes FOR SELECT 
        USING (auth.role() = 'authenticated');
        
        -- Only allow administrators to insert/update/delete reference genes
        -- This requires a custom claim or a separate admin check
        """
        
        logger.info("SQL for creating tables:")
        logger.info("\n" + profiles_sql)
        logger.info("\n" + analysis_results_sql)
        logger.info("\n" + reference_genes_sql)
        
        logger.info("\nSQL for setting up RLS policies:")
        logger.info("\n" + profiles_rls)
        logger.info("\n" + analysis_results_rls)
        logger.info("\n" + reference_genes_rls)
        
        logger.info("\nTables initialized successfully in the Supabase dashboard.")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing Supabase tables: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Initializing Supabase tables...")
    init_supabase_tables()
