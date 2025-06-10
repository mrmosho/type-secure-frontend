const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...')

    // Create detections table
    console.log('Creating detections table...')
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.detections (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        input_text TEXT NOT NULL,
        is_sensitive BOOLEAN NOT NULL,
        confidence FLOAT NOT NULL,
        detected_types TEXT[] NOT NULL,
        processed_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // Create files table
    console.log('Creating files table...')
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.files (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        filename TEXT NOT NULL,
        file_type TEXT,
        size INTEGER,
        detection_results JSONB,
        uploaded_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    console.log('✅ Database setup completed successfully')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()