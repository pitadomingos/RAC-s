
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { db } from './databaseService';

export interface AuthResponse {
    user: User | null;
    status: 'success' | 'invalid' | 'error';
    message?: string;
}

export const authService = {
  /**
   * Authenticates user against the public.users table manually.
   * Reverted from Supabase Auth service to previous logic.
   */
  async authenticate(username: string, password?: string): Promise<AuthResponse> {
    // 1. HARDCODED SYSTEM ADMIN CHECK
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

    // 2. SUPABASE DB CHECK
    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('name', username)
                .maybeSingle();

            if (error) throw error;
            if (!data) return { user: null, status: 'invalid' };

            // Standard check (plaintext comparison as per previous logic)
            if (data.password === password) {
                return {
                    user: db.mapUserFromDb(data),
                    status: 'success'
                };
            }
        } catch (e: any) {
            return { user: null, status: 'error', message: e.message };
        }
    }

    return { user: null, status: 'invalid' };
  },

  async signOut() {
      // No Supabase session to clear in manual mode, just handled by Context
  }
};
