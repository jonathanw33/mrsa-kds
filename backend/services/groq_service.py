import os
import logging
from typing import List, Dict, Any, Optional
import requests
import json
from utils.config import Settings

class GroqService:
    """Service for interacting with Groq AI for treatment recommendations"""
    
    def __init__(self):
        self.settings = Settings()
        self.logger = logging.getLogger(__name__)
        self.api_key = self.settings.GROQ_API_KEY
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    def get_treatment_recommendations(
        self,
        identified_genes: List[str],
        recommended_antibiotics: List[str],
        avoid_antibiotics: List[str]
    ) -> str:
        """
        Get AI-generated treatment recommendations
        
        Args:
            identified_genes: List of identified resistance genes
            recommended_antibiotics: List of recommended antibiotics
            avoid_antibiotics: List of antibiotics to avoid
            
        Returns:
            Treatment recommendations as a string
        """
        if not self.api_key:
            return "AI-powered recommendations not available."
        
        try:
            # Prepare the prompt
            prompt = f"""
            As a clinical microbiology expert, provide concise treatment recommendations for a 
            Staphylococcus aureus infection with the following antibiotic resistance genes:
            {', '.join(identified_genes)}.
            
            Based on the resistance profile, the following antibiotics are likely to be effective:
            {', '.join(recommended_antibiotics)}
            
            The following antibiotics should be avoided due to resistance:
            {', '.join(avoid_antibiotics)}
            
            Please provide:
            1. A brief explanation of the clinical significance of these resistance genes
            2. Any additional considerations for treatment
            3. Alternative treatment options if the first-line recommendations fail
            
            Keep your response under 150 words and focus on practical clinical advice.
            """
            
            # Prepare the API request
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama3-70b-8192",  # Using Llama 3 70B model
                "messages": [
                    {"role": "system", "content": "You are a clinical microbiology expert providing concise treatment recommendations for antibiotic-resistant bacterial infections."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 300
            }
            
            # Make the API call
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            
            # Extract the response
            result = response.json()
            recommendation = result["choices"][0]["message"]["content"].strip()
            
            return recommendation
            
        except Exception as e:
            self.logger.error(f"Error generating treatment recommendations: {str(e)}")
            return f"AI-powered recommendations unavailable: {str(e)}"
