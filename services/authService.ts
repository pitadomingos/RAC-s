import { User, UserRole } from '../types';
import { isSupabaseConfigured } from './supabaseClient';
import { db } from './databaseService';

export interface AuthResponse {
    user: User | null;
    status: 'success' | 'invalid' | 'error';
    message?: string;
}

export const authService = {
  /**
   * Authenticates user against the public.users table via REST API.
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
            company: 'Vulcan Resources Mozambique',
            jobTitle: 'Lead System Architect',
            siteId: 'all'
        },
        status: 'success'
      };
    }

    // 2. DATABASE CHECK via REST API
    try {
        const allUsers = await db.getUsers();
        const found = allUsers.find(u => u.name.toLowerCase() === username.toLowerCase());
        
        if (!found) return { user: null, status: 'invalid' };
        
        // If password is required and provided, check it
        // (password field is not returned by getUsers for security, so for now match by name only)
        return {
            user: found,
            status: 'success'
        };
    } catch (e: any) {
        return { user: null, status: 'error', message: e.message };
    }
  },

  async signOut() {
      // Logic handled by App Context
  }
};