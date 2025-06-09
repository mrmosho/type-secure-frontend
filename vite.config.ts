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
  
  // Verify environment variables
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  for (const envVar of requiredEnvVars) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Explicitly stringify all env variables
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env': JSON.stringify({
        ...env,
        MODE: mode,
        DEV: mode === 'development'
      })
    }
  }
})