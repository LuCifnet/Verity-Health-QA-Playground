import dotenv from 'dotenv'
import path from 'path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import ws from 'ws'

// Explicitly load .env from backend directory or project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Node.js < 22 WebSocket transport compatibility for Supabase Realtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const websocketTransport = ws as unknown as any

let cachedAdmin: SupabaseClient | null = null
let cachedAuth: SupabaseClient | null = null

export function checkSupabaseConfig() {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })

  const url = process.env.SUPABASE_URL?.trim()
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  const missingKeys: string[] = []
  if (!url || url.includes('your-project')) missingKeys.push('SUPABASE_URL')
  if (!anonKey || anonKey.includes('your-publishable-anon-key')) missingKeys.push('SUPABASE_ANON_KEY')
  if (!serviceRoleKey || serviceRoleKey.includes('your-service-role-secret-key')) missingKeys.push('SUPABASE_SERVICE_ROLE_KEY')

  const isConfigured = missingKeys.length === 0

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured,
    missingKeys
  }
}

export function isSupabaseConfigured(): boolean {
  return checkSupabaseConfig().isConfigured
}

export function getSupabaseAdmin(): SupabaseClient {
  const { url, serviceRoleKey, isConfigured, missingKeys } = checkSupabaseConfig()
  if (!isConfigured || !url || !serviceRoleKey) {
    throw new Error(`Supabase Admin is not configured. Missing: ${missingKeys.join(', ')}`)
  }
  if (!cachedAdmin) {
    cachedAdmin = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: websocketTransport }
    })
  }
  return cachedAdmin
}

export function getSupabaseAuth(): SupabaseClient {
  const { url, anonKey, isConfigured, missingKeys } = checkSupabaseConfig()
  if (!isConfigured || !url || !anonKey) {
    throw new Error(`Supabase Auth is not configured. Missing: ${missingKeys.join(', ')}`)
  }
  if (!cachedAuth) {
    cachedAuth = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: websocketTransport }
    })
  }
  return cachedAuth
}

export const supabaseAdmin = {
  get auth() {
    return getSupabaseAdmin().auth
  },
  from(relation: string) {
    return getSupabaseAdmin().from(relation)
  }
} as unknown as SupabaseClient

export const supabaseAuth = {
  get auth() {
    return getSupabaseAuth().auth
  }
} as unknown as SupabaseClient
