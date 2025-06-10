import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Type declaration for Supabase tables
export type Database = {
  public: {
    tables: {
      detections: {
        Row: {
          id: string
          user_id: string
          input_text: string
          is_sensitive: boolean
          confidence: number
          detected_types: string[]
          processed_at: string
          created_at?: string
        }
        Insert: Omit<DetectionRow, 'id' | 'created_at'>
        Update: Partial<DetectionRow>
      }
    }
  }
}