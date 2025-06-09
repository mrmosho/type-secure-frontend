import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on mode with prefix VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  // Log environment state for debugging
  console.log('Environment Variables:', {
    hasSupabaseUrl: !!env.VITE_SUPABASE_URL,
    hasSupabaseKey: !!env.VITE_SUPABASE_ANON_KEY
  })

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Use process.env as fallback for Vercel deployment
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env': JSON.stringify({
        ...env,
        VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
        MODE: mode,
        DEV: mode === 'development'
      })
    }
  }
})