
import { createClient } from 'https://jspm.dev/@supabase/supabase-js';

/**
 * PROJECT CREDENTIALS
 * Used as fallback if environment variables are not injected.
 */
const DEFAULT_URL = 'https://pkcqbxokokunlqminqur.supabase.co';
const DEFAULT_KEY = 'sb_publishable_mCWzXYVCuKgZto1Mn6qr0w_orZ5TgOM';

// Try to get from process.env first (standard practice)
const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || DEFAULT_KEY;

/**
 * Validates the credentials. 
 * Note: 'undefined' as a string is a common environment bug.
 */
export const isSupabaseConfigured = !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== "" && 
    supabaseUrl !== "undefined" &&
    supabaseAnonKey !== "" && 
    supabaseAnonKey !== "undefined"
);

/**
 * Safe client initialization.
 * Only calls createClient if credentials are valid to prevent library-level crashes.
 */
const getSafeClient = () => {
    if (!isSupabaseConfigured) {
        return null;
    }
    try {
        // @ts-ignore
        return createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.error("Critical: Supabase library failed to initialize:", err);
        return null;
    }
};

export const supabase = getSafeClient();

if (!isSupabaseConfigured) {
    console.warn("⚠️ DATABASE CONNECTION PREVENTED: SUPABASE_URL is missing. Operating in offline/mock mode.");
}
