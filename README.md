# MRSA Resistance Gene Detector

A tool for detecting antibiotic resistance genes in Staphylococcus aureus (MRSA) bacterial samples by analyzing DNA sequences.

## 📋 Project Overview

This application identifies antibiotic resistance in bacterial samples by analyzing DNA sequences for the presence of resistance genes, focusing primarily on MRSA (Methicillin-Resistant Staphylococcus aureus).

### Features

- Upload and analyze DNA sequences in FASTA format
- Identify resistance genes using the BLAST algorithm
- Determine resistance status with confidence scores
- Provide treatment recommendations based on identified resistance genes
- Store and retrieve analysis history

## 🔧 Tech Stack

### Backend
- **Python with FastAPI**: Web framework for building APIs
- **Biopython**: For sequence analysis and BLAST operations
- **Supabase**: For authentication and database storage
- **Groq**: For AI-powered treatment recommendations

### Frontend
- **React**: Frontend framework
- **React Bootstrap**: UI components
- **Chart.js**: For data visualization
- **Supabase JS Client**: For authentication and data storage

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR Python 3.9+ and Node.js 16+ (for manual setup)
- Supabase account
- Groq API key (optional for AI recommendations)

### Quick Setup (Docker - Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonathanw33/mrsa-kds.git
   cd mrsa-kds
   ```

2. **Initialize the project (this downloads BLAST databases):**
   ```bash
   # Windows
   init.bat
   
   # Linux/Mac
   chmod +x init.sh
   ./init.sh
   ```
   ⏳ *This will take several minutes as it downloads resistance gene databases from NCBI*

3. **Edit environment files with your credentials:**
   - Edit `backend/.env` with your Supabase credentials
   - Edit `frontend/.env` with your API URLs
   - See `ENV_SETUP.md` for detailed configuration

4. **Start the application:**
   ```bash
   docker-compose up -d
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Alternative: Environment Setup Only

If you only need to set up environment files without full initialization:

```bash
# Windows
setup.bat

# Linux/Mac  
chmod +x setup.sh
./setup.sh
```

**Note:** You'll still need to run the full `init.bat`/`init.sh` script to download BLAST databases before the app will work properly.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

6. Edit the `.env` file with your Supabase credentials and other settings

7. Initialize Supabase schema:
   ```
   python -m utils.db_init
   ```

8. Run the server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```
   npm start
   ```

## 📊 Sequence Analysis Workflow

1. User uploads a FASTA file containing a bacterial DNA sequence
2. The backend performs BLAST alignment against known resistance genes
3. The system analyzes the alignment results to determine resistance status
4. Results are displayed with confidence scores and treatment recommendations
5. Analysis results are saved to the user's history

## 👥 Team

- Jonathan Wiguna (18222019)
- Harry Truman Suhalim (18222081)
- Steven Adrian Corne (18222101)

## 📚 References

- NCBI GenBank: Source of reference sequences for resistance genes
- BLAST Algorithm: Used for sequence alignment
- CDC - MRSA Information: Background on MRSA
- Biopython: Python tools for computational molecular biology
