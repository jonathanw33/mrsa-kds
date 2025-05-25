#!/bin/bash

# MRSA-KDS Quick Setup Script for New Users

echo "🧬 Setting up MRSA Resistance Gene Detector..."

# Function to check if file exists
check_env_file() {
    if [ ! -f "$1" ]; then
        echo "⚠️  Missing: $1"
        if [ -f "$1.example" ]; then
            echo "📝 Copying $1.example to $1"
            cp "$1.example" "$1"
            echo "✅ Created $1 - Please edit with your credentials!"
        else
            echo "❌ No example file found for $1"
            return 1
        fi
    else
        echo "✅ Found: $1"
    fi
}

# Check and create environment files
echo "\n🔧 Checking environment files..."
check_env_file "backend/.env"
check_env_file "frontend/.env"

# Create necessary directories
echo "\n📁 Creating directories..."
mkdir -p backend/database/blast_db
mkdir -p backend/temp_uploads
mkdir -p frontend/public/images

echo "\n🐳 Ready to run with Docker!"
echo "Run: docker-compose up -d"

echo "\n⚠️  IMPORTANT: Edit your .env files with actual credentials before running!"
echo "📖 See ENV_SETUP.md for detailed instructions"
