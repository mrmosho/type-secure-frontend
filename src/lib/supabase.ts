import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) { 
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'type-secure-auth', // Add unique storage key
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
      files: {
        Row: {
          id: string
          user_id: string
          filename: string
          file_type: string
          size: number
          detection_results: {
            is_sensitive: boolean
            confidence: number
            detected_types: string[]
          }
          uploaded_at: string
          created_at?: string
        }
        Insert: Omit<FileRow, 'id' | 'created_at'>
        Update: Partial<FileRow>
      }
    }
  }
}

export type Tables = Database['public']['tables']
export type DetectionRow = Tables['detections']['Row']
export type FileRow = Tables['files']['Row']