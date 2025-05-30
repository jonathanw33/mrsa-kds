#!/usr/bin/env python3
"""
Integration test script to verify authentication and database operations
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from services.supabase_service import SupabaseService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_supabase_connection():
    """Test basic Supabase connection"""
    logger.info("Testing Supabase connection...")
    
    try:
        supabase_service = SupabaseService()
        
        if supabase_service.supabase:
            logger.info("✅ Supabase client initialized successfully")
            return True
        else:
            logger.error("❌ Failed to initialize Supabase client")
            return False
    except Exception as e:
        logger.error(f"❌ Error connecting to Supabase: {str(e)}")
        return False

def test_database_tables():
    """Test if database tables exist and are accessible"""
    logger.info("Testing database tables...")
    
    try:
        supabase_service = SupabaseService()
        
        # Test profiles table
        profiles = supabase_service.supabase.table("profiles").select("count", count="exact").execute()
        logger.info(f"✅ Profiles table accessible, count: {profiles.count}")
        
        # Test analysis_results table
        results = supabase_service.supabase.table("analysis_results").select("count", count="exact").execute()
        logger.info(f"✅ Analysis results table accessible, count: {results.count}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Error accessing database tables: {str(e)}")
        return False

def test_existing_users():
    """Test retrieving existing users"""
    logger.info("Testing existing users...")
    
    try:
        supabase_service = SupabaseService()
        
        # Get all profiles
        profiles = supabase_service.supabase.table("profiles").select("*").execute()
        
        logger.info(f"Found {len(profiles.data)} users in profiles table:")
        for profile in profiles.data:
            logger.info(f"  - {profile['email']} (ID: {profile['id']})")
        
        return True
    except Exception as e:
        logger.error(f"❌ Error retrieving users: {str(e)}")
        return False

def main():
    """Run all tests"""
    logger.info("🧪 Starting integration tests...")
    
    tests = [
        test_supabase_connection,
        test_database_tables,
        test_existing_users
    ]
    
    passed = 0
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            logger.error(f"❌ Test {test.__name__} failed: {str(e)}")
    
    logger.info(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        logger.info("🎉 All tests passed! Your setup looks good.")
    else:
        logger.warning("⚠️  Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    main()
