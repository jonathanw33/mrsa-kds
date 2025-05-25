import os
import logging
from utils.config import Settings
from services.supabase_service import SupabaseService

logger = logging.getLogger(__name__)

def init_supabase_schema():
    """
    Initialize Supabase schema with required tables
    
    This should be run once when setting up the application
    """
    try:
        settings = Settings()
        supabase_service = SupabaseService()
        
        if not supabase_service.supabase:
            logger.error("Supabase client not initialized. Cannot initialize schema.")
            return False
        
        # SQL for creating profiles table
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
        analysis_results_sql = """
        CREATE TABLE IF NOT EXISTS analysis_results (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            sample_id TEXT NOT NULL,
            resistance_status TEXT NOT NULL,
            confidence_score FLOAT NOT NULL,
            identified_genes JSONB,
            matching_regions JSONB,
            treatment_recommendations JSONB,
            analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        # Execute SQL
        supabase_service.supabase.postgrest.query(profiles_sql).execute()
        supabase_service.supabase.postgrest.query(analysis_results_sql).execute()
        
        logger.info("Supabase schema initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing Supabase schema: {str(e)}")
        return False

def init_row_level_security():
    """
    Initialize row level security policies for Supabase
    
    This should be run once when setting up the application
    """
    try:
        settings = Settings()
        supabase_service = SupabaseService()
        
        if not supabase_service.supabase:
            logger.error("Supabase client not initialized. Cannot initialize RLS policies.")
            return False
        
        # SQL for enabling RLS on profiles table
        profiles_rls_sql = """
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY profiles_select_policy ON profiles
            FOR SELECT
            USING (auth.uid() = id);
            
        CREATE POLICY profiles_insert_policy ON profiles
            FOR INSERT
            WITH CHECK (auth.uid() = id);
            
        CREATE POLICY profiles_update_policy ON profiles
            FOR UPDATE
            USING (auth.uid() = id);
        """
        
        # SQL for enabling RLS on analysis_results table
        analysis_results_rls_sql = """
        ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY analysis_results_select_policy ON analysis_results
            FOR SELECT
            USING (auth.uid() = user_id);
            
        CREATE POLICY analysis_results_insert_policy ON analysis_results
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY analysis_results_update_policy ON analysis_results
            FOR UPDATE
            USING (auth.uid() = user_id);
            
        CREATE POLICY analysis_results_delete_policy ON analysis_results
            FOR DELETE
            USING (auth.uid() = user_id);
        """
        
        # Execute SQL
        supabase_service.supabase.postgrest.query(profiles_rls_sql).execute()
        supabase_service.supabase.postgrest.query(analysis_results_rls_sql).execute()
        
        logger.info("Row level security policies initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing row level security policies: {str(e)}")
        return False

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Initialize schema
    logger.info("Initializing Supabase schema...")
    schema_init = init_supabase_schema()
    
    if schema_init:
        # Initialize RLS policies
        logger.info("Initializing row level security policies...")
        rls_init = init_row_level_security()
        
        if rls_init:
            logger.info("Supabase initialization completed successfully")
        else:
            logger.error("Failed to initialize row level security policies")
    else:
        logger.error("Failed to initialize Supabase schema")
