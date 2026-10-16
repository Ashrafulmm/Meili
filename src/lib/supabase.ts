import { createClient } from '@supabase/supabase-js';

// These environment variables must be set in Vercel dashboard:
// VITE_SUPABASE_URL - Your Supabase project URL
// VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase environment variables not set. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel environment variables.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};
