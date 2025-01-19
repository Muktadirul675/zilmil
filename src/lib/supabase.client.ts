'use client'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cutcbvajgtehcysiqrlf.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey ?? '')