
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthResponse {
    user: User | null;
    status: 'success' | 'invalid' | 'needs_setup';
}

export const authService = {
  /**
   * Authenticates user against provided credentials.
   * Specific logic for Pita Domingos included as System Admin.
   */
  async authenticate(username: string, password?: string): Promise<AuthResponse> {
    // 1. HARDCODED SYSTEM ADMIN CHECK (The Master Override)
    if (username === "Pita Domingos" && password === "native@13035") {
      return {
        user: {
            id: 1337,
            name: "Pita Domingos",
            email: "p.domingos@vulcan.com",
            role: UserRole.SYSTEM_ADMIN,
            status: 'Active',
            company: 'Vulcan',
            jobTitle: 'Lead System Architect',
            siteId: 'all'
        },
        status: 'success'
      };
    }

    // 2. SUPABASE DB CHECK (Live Users Table)
    if (isSupabaseConfigured && supabase) {
        try {
            // Find the user by name
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('name', username)
                .maybeSingle();

            if (error) throw error;
            if (!data) return { user: null, status: 'invalid' };

            // DETECT FIRST TIME LOGIN
            // If password column is NULL or empty string, trigger setup workflow
            if (!data.password || data.password.trim() === '') {
                return {
                    user: data as User,
                    status: 'needs_setup'
                };
            }

            // Normal authentication
            if (data.password === password) {
                return {
                    user: data as User,
                    status: 'success'
                };
            }
        } catch (e) {
            console.warn("DB Auth not available. Using fallback logic.");
        }
    }

    return { user: null, status: 'invalid' };
  }
};
