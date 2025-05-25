#!/bin/bash

# Initialize MRSA Resistance Gene Detector application

echo "Initializing MRSA Resistance Gene Detector..."

# Create necessary directories
echo "Creating directories..."
mkdir -p backend/database/blast_db
mkdir -p backend/temp_uploads
mkdir -p frontend/public/images

# Set up virtual environment for backend
echo "Setting up Python virtual environment..."
cd backend
python -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Initialize BLAST database
echo "Initializing BLAST database (downloading reference genes)..."
python scripts/init_blast_db.py

# Initialize Supabase schema
echo "Initializing database schema..."
python -m utils.db_init

# Set up frontend
echo "Setting up frontend..."
cd ../frontend
npm install

echo "Initialization complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  uvicorn main:app --reload"
echo ""
echo "To start the frontend server:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Or use Docker Compose to start everything:"
echo "  docker-compose up -d"
