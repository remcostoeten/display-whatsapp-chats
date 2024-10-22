import { env } from '@/core/config/env.mjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
