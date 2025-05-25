@echo off
REM MRSA-KDS Quick Setup Script for New Users (Windows)

echo 🧬 Setting up MRSA Resistance Gene Detector...

REM Check and create backend .env
if not exist "backend\.env" (
    echo ⚠️  Missing: backend\.env
    if exist "backend\.env.example" (
        echo 📝 Copying backend\.env.example to backend\.env
        copy "backend\.env.example" "backend\.env"
        echo ✅ Created backend\.env - Please edit with your credentials!
    ) else (
        echo ❌ No example file found for backend\.env
    )
) else (
    echo ✅ Found: backend\.env
)

REM Check and create frontend .env
if not exist "frontend\.env" (
    echo ⚠️  Missing: frontend\.env
    if exist "frontend\.env.example" (
        echo 📝 Copying frontend\.env.example to frontend\.env
        copy "frontend\.env.example" "frontend\.env"
        echo ✅ Created frontend\.env - Please edit with your credentials!
    ) else (
        echo ❌ No example file found for frontend\.env
    )
) else (
    echo ✅ Found: frontend\.env
)

REM Create necessary directories
echo.
echo 📁 Creating directories...
mkdir backend\database\blast_db 2>nul
mkdir backend\temp_uploads 2>nul
mkdir frontend\public\images 2>nul

echo.
echo 🐳 Ready to run with Docker!
echo Run: docker-compose up -d
echo.
echo ⚠️  IMPORTANT: Edit your .env files with actual credentials before running!
echo 📖 See ENV_SETUP.md for detailed instructions

pause
