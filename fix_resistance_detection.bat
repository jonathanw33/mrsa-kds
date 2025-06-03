@echo off
echo ==================================
echo MRSA-KDS BLAST Database Rebuild
echo ==================================
echo.

echo 🔍 Checking Docker containers...
docker-compose ps
echo.

echo 🔄 Rebuilding BLAST database inside Docker container...
echo.

REM Execute the rebuild script inside the backend container
docker-compose exec backend python rebuild_blast_db.py

echo.
echo 🧪 Testing the fixes with debug script...
echo.

REM Run the debug script to test all samples
docker-compose exec backend python debug_resistance_samples.py

echo.
echo ✅ Database rebuild and testing complete!
echo Check the output above to verify that all resistance genes are now detected correctly.
echo.
pause
