# Type-Secure

Sensitive Data Detection and Encryption Security System

## Overview
An AI-powered system that automatically identifies and protects sensitive data in real-time communications, featuring hybrid encryption and seamless email client integration.

## Features
- 🤖 AI-based sensitive data detection (95% accuracy)
- 🔐 Hybrid encryption (AES-GCM + RSA)
- ⚡ Real-time monitoring (<50ms processing)
- 🎯 Low resource usage (<5% CPU)
- 🌐 Web-based dashboard
- 📊 Performance analytics

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **Database**: Supabase (PostgreSQL)
- **ML**: scikit-learn Random Forest
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)
- **Domain**: type-secure.online

## Quick Start (Windows)

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://python.org/))
- Git ([Download](https://git-scm.com/))

### Installation
`powershell
# Install all dependencies
npm run install:all

# Or install separately:
npm run frontend:install
npm run backend:install

# Set up environment
copy .env.example .env
# Edit .env with your configuration

# Run development servers
npm run dev
`

### Manual Setup
`powershell
# Frontend
cd frontend
npm install
npm run dev

# Backend (in new terminal)
cd backend
pip install -r requirements.txt
python main.py
`

## Project Structure
`
type-secure/
├── frontend/              # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # FastAPI backend
│   ├── app/              # API routes and services
│   ├── ml_model/         # ML model and training
│   └── main.py
├── database/             # Database schema
└── .env.example         # Environment template
`

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set build command: cd frontend && npm run build
3. Set output directory: rontend/dist
4. Add environment variables

### Backend (Railway/Heroku)
1. Deploy backend directory
2. Set Python buildpack
3. Configure environment variables
4. Connect to Supabase database

### Database (Supabase)
1. Create new Supabase project
2. Import schema from database/ folder
3. Configure environment variables

## Development

### Frontend Development
`powershell
cd frontend
npm run dev
# Opens http://localhost:5173
`

### Backend Development
`powershell
cd backend
python main.py
# API at http://localhost:8000
`

### Environment Variables
Copy .env.example to .env and configure:
- Supabase credentials
- JWT secrets
- API endpoints

## License
MIT License

## Contributors
- Omar Husam
- Amr Mohamed  
- Ahmed Ali
- Marwan Mohamed

Supervised by Prof. Hany Ammar
