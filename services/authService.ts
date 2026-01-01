
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const authService = {
  /**
   * Authenticates user against provided credentials.
   * Specific logic for Pita Domingos included as System Admin.
   */
  async authenticate(username: string, password: string): Promise<User | null> {
    // 1. HARDCODED SYSTEM ADMIN CHECK (The Master Override)
    // This allows access even if the database tables are not yet created.
    if (username === "Pita Domingos" && password === "native@13035") {
      return {
        id: 1337,
        name: "Pita Domingos",
        email: "p.domingos@vulcan.com",
        role: UserRole.SYSTEM_ADMIN,
        status: 'Active',
        company: 'Vulcan',
        jobTitle: 'Lead System Architect',
        siteId: 'all'
      };
    }

    // 2. SUPABASE DB CHECK (Live Users Table)
    if (isSupabaseConfigured && supabase) {
        try {
            // Check the users table. If it's missing, this will fail gracefully.
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('name', username)
                .single();

            // Simple password comparison for the POC/Internal environment
            if (!error && data && data.password === password) {
                return data as User;
            }
        } catch (e) {
            // Table doesn't exist or network error
            console.warn("DB Auth not available. Using fallback logic.");
        }
    }

    return null;
  }
};
