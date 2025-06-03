#!/bin/bash

echo "=================================="
echo "MRSA-KDS BLAST Database Rebuild"
echo "=================================="
echo

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose not found!"
    echo "Please make sure Docker is installed and running."
    exit 1
fi

echo "🔍 Checking Docker containers..."
docker-compose ps

echo
echo "🔄 Rebuilding BLAST database inside Docker container..."
echo

# Execute the rebuild script inside the backend container
docker-compose exec backend python rebuild_blast_db.py

echo
echo "🧪 Testing the fixes with debug script..."
echo

# Run the debug script to test all samples
docker-compose exec backend python debug_resistance_samples.py

echo
echo "✅ Database rebuild and testing complete!"
echo "Check the output above to verify that all resistance genes are now detected correctly."
echo
