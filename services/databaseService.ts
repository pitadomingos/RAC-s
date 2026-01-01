
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Booking, Employee, TrainingSession, EmployeeRequirement, Site, Company, BookingStatus, User, UserRole } from '../types';
import { MOCK_EMPLOYEES, MOCK_BOOKINGS, MOCK_SESSIONS, MOCK_REQUIREMENTS, INITIAL_RAC_DEFINITIONS } from '../constants';

// Seed data for the requested System Admin
const FALLBACK_USERS: User[] = [
    {
        id: 1337,
        name: "Pita Domingos",
        email: "p.domingos@vulcan.com",
        role: UserRole.SYSTEM_ADMIN,
        status: 'Active',
        company: 'Vulcan',
        jobTitle: 'Lead System Architect',
        siteId: 'all'
    }
];

/**
 * Robust Database Service
 * Automatically detects missing tables (42P01) and falls back to local data.
 */
export const db = {
    // Helper to safely execute Supabase queries
    async safeQuery<T>(tableName: string, query: any, fallback: T): Promise<T> {
        if (!isSupabaseConfigured || !supabase) return fallback;
        try {
            const { data, error } = await query;
            if (error) {
                // 42P01 = Table/Relation does not exist in Postgres
                if (error.code === '42P01') {
                    console.warn(`[Supabase] Table "${tableName}" not found. Falling back to local mock data.`);
                    return fallback;
                }
                throw error;
            }
            return data as T;
        } catch (e: any) {
            console.error(`[Supabase] Error fetching ${tableName}:`, e?.message || e);
            return fallback;
        }
    },

    async getCompanies(): Promise<Company[]> {
        const fallback = [{ id: 'c1', name: 'Vulcan', appName: 'CARS Manager', status: 'Active', features: { alcohol: true } }] as Company[];
        return this.safeQuery('companies', supabase?.from('companies').select('*'), fallback);
    },

    async getSites(): Promise<Site[]> {
        const fallback = [{ id: 's1', companyId: 'c1', name: 'Moatize Site', location: 'Tete' }] as Site[];
        return this.safeQuery('sites', supabase?.from('sites').select('*'), fallback);
    },

    async getUsers(): Promise<User[]> {
        return this.safeQuery('users', supabase?.from('users').select('*').order('name', { ascending: true }), FALLBACK_USERS);
    },

    async getEmployees(): Promise<Employee[]> {
        return this.safeQuery('employees', supabase?.from('employees').select('*'), MOCK_EMPLOYEES);
    },

    async getSessions(): Promise<TrainingSession[]> {
        return this.safeQuery('training_sessions', supabase?.from('training_sessions').select('*').order('date', { ascending: true }), MOCK_SESSIONS);
    },

    async getBookings(): Promise<Booking[]> {
        // Complex query for bookings with join
        if (!isSupabaseConfigured || !supabase) return MOCK_BOOKINGS;
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`*, employee:employees(*)`);
            
            if (error && error.code === '42P01') return MOCK_BOOKINGS;
            if (error) throw error;
            return (data as any[]) || MOCK_BOOKINGS;
        } catch (e: any) {
            console.error("[Supabase] Booking Load Error:", e?.message || e);
            return MOCK_BOOKINGS;
        }
    },

    async getRequirements(): Promise<EmployeeRequirement[]> {
        return this.safeQuery('employee_requirements', supabase?.from('employee_requirements').select('*'), MOCK_REQUIREMENTS);
    },

    // --- MUTATIONS ---
    async upsertUser(user: Partial<User>) {
        if (!isSupabaseConfigured || !supabase) return user;
        try {
            // Upsert by ID if exists, otherwise try to match on email to prevent unique constraint errors
            const { data, error } = await supabase.from('users').upsert(user, { onConflict: 'email' }).select();
            if (error) throw error;
            return data[0];
        } catch (e: any) {
            console.error("Failed to save user to cloud:", e?.message || e);
            return user;
        }
    },

    async deleteUser(id: number) {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            const { error } = await supabase.from('users').delete().eq('id', id);
            if (error) throw error;
        } catch (e: any) { 
            console.warn("Delete User Failed:", e?.message || e); 
        }
    },

    async upsertEmployee(emp: Partial<Employee>) {
        if (!isSupabaseConfigured || !supabase) return emp;
        try {
            const { data, error } = await supabase.from('employees').upsert(emp).select();
            if (error) throw error;
            return data[0];
        } catch (e: any) { 
            console.error("Employee Upsert Failed:", e?.message || e);
            return emp; 
        }
    },

    async saveBooking(booking: Partial<Booking>) {
        if (!isSupabaseConfigured || !supabase) return booking;
        try {
            const payload = { ...booking };
            if (booking.employee) {
                // @ts-ignore
                payload.employee_id = booking.employee.id;
                delete payload.employee;
            }
            const { data, error } = await supabase.from('bookings').upsert(payload).select();
            if (error) throw error;
            return data[0];
        } catch (e: any) { 
            console.error("Booking Save Failed:", e?.message || e);
            return booking; 
        }
    },

    async updateRequirement(req: EmployeeRequirement) {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            const { error } = await supabase.from('employee_requirements').upsert(req);
            if (error) throw error;
        } catch (e: any) { 
            console.error("Requirement Update Failed:", e?.message || e);
        }
    },

    async addLog(level: string, key: string, user: string, meta?: any) {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            await supabase.from('system_logs').insert({
                level,
                message_key: key,
                user_name: user,
                metadata: meta
            });
        } catch (e: any) { 
            /* ignore silent but log for developer */
            console.warn("Log creation suppressed:", e?.message || e);
        }
    }
};
