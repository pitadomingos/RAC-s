
import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION CREDENTIALS
 * Set these in a .env file at the project root:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_ANON_KEY=your-anon-key
 *
 * When these are absent the app operates fully in offline/demo mode
 * using the rich mock data in mockData.ts — no network requests are made.
 */
const supabaseUrl     = process.env.SUPABASE_URL     || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

/**
 * Validates the credentials.
 * 'undefined' as a string is a common environment bug — guard against it.
 */
export const isSupabaseConfigured = !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl     !== 'undefined' &&
    supabaseAnonKey !== 'undefined'
);

/**
 * Safe client initialization.
 * Only calls createClient if credentials are valid to prevent library-level crashes.
 */
const getSafeClient = () => {
    if (!isSupabaseConfigured) return null;
    try {
        return createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.error('Critical: Supabase library failed to initialize:', err);
        return null;
    }
};

export const supabase = getSafeClient();

if (!isSupabaseConfigured) {
    console.info('ℹ️  CARS Manager running in offline/demo mode — mock data active. Set SUPABASE_URL + SUPABASE_ANON_KEY to connect.');
}
