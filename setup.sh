#!/bin/bash

echo "=================================="
echo "MRSA-KDS Setup & Database Fix"
echo "=================================="
echo

echo "🚀 Starting Docker containers..."
docker-compose up -d

echo
echo "⏳ Waiting for containers to be ready..."
sleep 10

echo "🔧 Rebuilding BLAST database with all resistance genes..."
docker-compose exec backend python rebuild_blast_db.py

echo
echo "✅ Setup complete!"
echo
echo "Your MRSA-KDS system is ready with full resistance gene detection:"
echo "  ✅ mecA - Methicillin resistance"
echo "  ✅ mecC - Alternative methicillin resistance"  
echo "  ✅ ermA - Erythromycin resistance"
echo "  ✅ ermC - Erythromycin resistance"
echo
echo "🌐 Access your application at: http://localhost:3000"
echo
