@echo off
echo Initializing MRSA Resistance Gene Detector...

REM Create necessary directories
echo Creating directories...
mkdir backend\database\blast_db 2>nul
mkdir backend\temp_uploads 2>nul
mkdir frontend\public\images 2>nul

REM Set up virtual environment for backend
echo Setting up Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

REM Initialize BLAST database
echo Initializing BLAST database (downloading reference genes)...
python scripts\init_blast_db.py

REM Initialize Supabase schema
echo Initializing database schema...
python -m utils.db_init

REM Set up frontend
echo Setting up frontend...
cd ..\frontend
call npm install

echo.
echo Initialization complete!
echo.
echo To start the backend server:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload
echo.
echo To start the frontend server:
echo   cd frontend
echo   npm start
echo.
echo Or use Docker Compose to start everything:
echo   docker-compose up -d

cd ..
pause
