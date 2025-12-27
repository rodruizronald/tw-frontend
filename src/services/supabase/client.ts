import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { Database } from './types/database'

/**
 * Supabase configuration interface
 */
interface SupabaseConfig {
  url: string
  publishableKey: string
}

/**
 * Get Supabase configuration from environment variables
 * Uses Vite's import.meta.env for environment variable access
 */
const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url) {
    throw new Error(
      'Missing VITE_SUPABASE_URL environment variable. ' +
        'Please add it to your .env file.'
    )
  }

  if (!publishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_PUBLISHABLE_KEY environment variable. ' +
        'Please add it to your .env file.'
    )
  }

  return { url, publishableKey }
}

/**
 * Create a typed Supabase client instance
 *
 * The client is configured with:
 * - Type-safe database operations using generated types
 * - Auto-refresh tokens disabled (no auth needed for public queries)
 * - Session persistence disabled (stateless API calls)
 */
const createSupabaseClient = (): SupabaseClient<Database> => {
  const { url, publishableKey } = getSupabaseConfig()

  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  })
}

/**
 * Singleton Supabase client instance
 *
 * Usage:
 * ```typescript
 * import { supabase } from '@/services/supabase/client'
 *
 * // Query data
 * const { data, error } = await supabase.from('jobs').select('*')
 *
 * // Call RPC function
 * const { data, error } = await supabase.rpc('search_jobs', { ... })
 * ```
 */
export const supabase = createSupabaseClient()

/**
 * Type alias for the typed Supabase client
 * Useful for function parameters and return types
 */
export type TypedSupabaseClient = SupabaseClient<Database>
