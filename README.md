# Type-Secure Frontend

React + Vite frontend for the Type-Secure sensitive data detection system.

## Features
- 🎨 Modern React UI with Vite
- 🔐 Real-time sensitive data detection interface
- 📊 Dashboard and analytics
- 🌐 Responsive design
- ⚡ Fast development with HMR

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Deployment

Deploy to Vercel:
1. Connect GitHub repository
2. Vercel will auto-detect Vite configuration
3. Set environment variables in Vercel dashboard
4. Deploy!

## Tech Stack
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS (if configured)
