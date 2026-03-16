import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sencxpavqlahqvvbojzv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbmN4cGF2cWxhaHF2dmJvanp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTY5ODIsImV4cCI6MjA4OTE5Mjk4Mn0.TUyVn_AFwM-uoOm8wuSgTchm65AdrqwGoHU2bLjJd6I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
