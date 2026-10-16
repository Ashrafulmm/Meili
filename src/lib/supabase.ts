import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Priority: Environment variables > Hardcoded fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ktfxnbtmuwsqdszciwvg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZnhuYnRtdXdzcWRzemNpd3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDQ3ODEsImV4cCI6MjEwNzcyMDc4MX0.UREkrwlR8-PAl6FunVqIlBXDatgtsMq1KBx_IKSqS68';

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
  fromEnv: Boolean(import.meta.env.VITE_SUPABASE_URL),
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
