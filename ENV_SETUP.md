# MRSA Resistance Gene Detector - Environment Setup

## 🚀 Quick Setup for New Users

### 1. Backend Environment Setup
```bash
cd backend
cp .env.example .env
```

### 2. Frontend Environment Setup  
```bash
cd frontend
cp .env.example .env
```

### 3. Configure Your Environment Variables

Edit the `.env` files with your actual credentials:

#### Backend (.env)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key
- `NCBI_EMAIL` - Your email for NCBI API access
- `GROQ_API_KEY` - Optional: For AI treatment recommendations
- `SECRET_KEY` - Generate a secure secret key

#### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (usually http://localhost:8000/api)
- `REACT_APP_SUPABASE_URL` - Same as backend Supabase URL
- `REACT_APP_SUPABASE_KEY` - Same as backend Supabase key

### 4. Run with Docker
```bash
docker-compose up -d
```

## 🔒 Security Notes

- Never commit actual `.env` files to Git
- The `.env.example` files show the required variables without sensitive values
- Each developer needs to create their own `.env` files with their credentials

## 🆘 Need Help?

If you need access to the shared Supabase project:
1. Contact the team for credentials
2. Or create your own Supabase project at https://supabase.com
3. Follow the database setup instructions in the main README
