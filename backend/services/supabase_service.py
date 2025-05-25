import os
import logging
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from utils.config import Settings

class SupabaseService:
    """Service for interacting with Supabase"""
    
    def __init__(self):
        self.settings = Settings()
        self.logger = logging.getLogger(__name__)
        
        # Initialize Supabase client
        if self.settings.SUPABASE_URL and self.settings.SUPABASE_KEY:
            self.supabase = create_client(
                self.settings.SUPABASE_URL,
                self.settings.SUPABASE_KEY
            )
        else:
            self.logger.warning("Supabase URL or key not set. Supabase functionality will be limited.")
            self.supabase = None
    
    def register_user(self, email: str, password: str, user_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Register a new user
        
        Args:
            email: User's email
            password: User's password
            user_data: Additional user data
            
        Returns:
            User data
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Register user
            data = self.supabase.auth.sign_up({
                "email": email,
                "password": password
            })
            
            user_id = data.user.id if data.user else None
            
            # If additional user data provided, store it in the profiles table
            if user_data and user_id:
                profile_data = {
                    "id": user_id,
                    "email": email,
                    **user_data
                }
                
                self.supabase.table("profiles").insert(profile_data).execute()
            
            return {
                "email": email,
                "full_name": user_data.get("full_name") if user_data else None,
                "institution": user_data.get("institution") if user_data else None,
                "is_active": True
            }
            
        except Exception as e:
            self.logger.error(f"Error registering user: {str(e)}")
            raise
    
    def login_user(self, email: str, password: str) -> str:
        """
        Login a user
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            Access token
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Login user
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            return response.session.access_token if response.session else ""
            
        except Exception as e:
            self.logger.error(f"Error logging in user: {str(e)}")
            raise
    
    def get_user_from_token(self, token: str) -> Dict[str, Any]:
        """
        Get user data from access token
        
        Args:
            token: Access token
            
        Returns:
            User data
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Get user from token
            response = self.supabase.auth.get_user(token)
            user = response.user
            
            # Get additional user data from profiles table
            user_id = user.id
            profile = self.supabase.table("profiles").select("*").eq("id", user_id).execute()
            
            profile_data = profile.data[0] if profile.data else {}
            
            return {
                "email": user.email,
                "full_name": profile_data.get("full_name"),
                "institution": profile_data.get("institution"),
                "is_active": True
            }
            
        except Exception as e:
            self.logger.error(f"Error getting user from token: {str(e)}")
            raise
    
    def save_analysis_result(self, user_id: str, analysis_result: Dict[str, Any]) -> str:
        """
        Save analysis result to database
        
        Args:
            user_id: User ID
            analysis_result: Analysis result data
            
        Returns:
            ID of the saved result
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Convert any non-serializable objects to strings
            serialized_result = self._prepare_for_storage(analysis_result)
            
            # Save analysis result
            data = {
                "user_id": user_id,
                **serialized_result
            }
            
            response = self.supabase.table("analysis_results").insert(data).execute()
            
            return response.data[0]["id"] if response.data else ""
            
        except Exception as e:
            self.logger.error(f"Error saving analysis result: {str(e)}")
            raise
    
    def get_user_analysis_results(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get analysis results for a user
        
        Args:
            user_id: User ID
            
        Returns:
            List of analysis results
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Get analysis results
            response = self.supabase.table("analysis_results").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            
            return response.data
            
        except Exception as e:
            self.logger.error(f"Error getting analysis results: {str(e)}")
            raise
    
    def get_analysis_result(self, result_id: str) -> Dict[str, Any]:
        """
        Get a specific analysis result
        
        Args:
            result_id: Result ID
            
        Returns:
            Analysis result
        """
        if not self.supabase:
            raise Exception("Supabase client not initialized")
        
        try:
            # Get analysis result
            response = self.supabase.table("analysis_results").select("*").eq("id", result_id).execute()
            
            if not response.data:
                raise Exception(f"Analysis result with ID {result_id} not found")
            
            return response.data[0]
            
        except Exception as e:
            self.logger.error(f"Error getting analysis result: {str(e)}")
            raise
    
    def _prepare_for_storage(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare data for storage in Supabase by converting non-serializable objects to strings
        
        Args:
            data: Data to prepare
            
        Returns:
            Prepared data
        """
        import json
        from datetime import datetime
        
        def json_serializer(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            return str(obj)
        
        # Convert the entire object to JSON and back to handle nested objects
        try:
            json_str = json.dumps(data, default=json_serializer)
            prepared_data = json.loads(json_str)
            return prepared_data
        except Exception as e:
            self.logger.error(f"Error preparing data for storage: {str(e)}")
            # If conversion fails, return a simplified version
            return {
                "sample_id": data.get("sample_id", "Unknown"),
                "resistance_status": str(data.get("resistance_status", "Unknown")),
                "confidence_score": float(data.get("confidence_score", 0.0)),
                "identified_genes": list(data.get("identified_genes", [])),
                "raw_data": str(data)
            }
