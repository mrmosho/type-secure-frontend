import { SupabaseClient } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
}

export interface RateLimitConfig {
  maxAttempts: number
  timeWindow: number // in milliseconds
}

export interface DetectionData {
  name: string
  personal: number
  financial: number
}

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

// Supabase related types
export type SupabaseContextType = {
  supabase: SupabaseClient
}

// API Response Types
export interface APIResponse<T> {
  data?: T
  error?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}