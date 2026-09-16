import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://quouvzuorkxnrlfkslne.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WpPZJEFRXQGfcn6X5SIvHA_7B8DoFFG';

// Gunakan globalThis yang serasi dengan standard TypeScript
const globalRef = globalThis as unknown as { __supabaseInstance?: SupabaseClient };

export const supabase: SupabaseClient =
  globalRef.__supabaseInstance ||
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalRef.__supabaseInstance = supabase;
}