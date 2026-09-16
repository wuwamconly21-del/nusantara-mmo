import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL & Key di-hardcode terus untuk mengelakkan ralat bundler Expo Web
const SUPABASE_URL = 'https://quouvzuorkxnrlfkslne.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WpPZJEFRXQGfcn6X5SIvHA_7B8DoFFG';

const CustomStorage = Platform.OS === 'web'
  ? {
      getItem: (key: string) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null),
      setItem: (key: string, value: string) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.setItem(key, value) : undefined),
      removeItem: (key: string) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.removeItem(key) : undefined),
    }
  : AsyncStorage;

const globalRef = globalThis as unknown as { __supabaseInstance?: SupabaseClient };

export const supabase: SupabaseClient =
  globalRef.__supabaseInstance ||
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: CustomStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalRef.__supabaseInstance = supabase;
}
