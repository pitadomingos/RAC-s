
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Booking, Employee, TrainingSession, EmployeeRequirement, Site, Company, BookingStatus, User, UserRole, RacDef, Room, Trainer, Feedback, SystemNotification } from '../types';
import { MOCK_EMPLOYEES, MOCK_BOOKINGS, MOCK_SESSIONS, MOCK_REQUIREMENTS } from '../constants';

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

export const db = {
    async safeQuery<T>(tableName: string, query: any, fallback: T): Promise<T> {
        if (!isSupabaseConfigured || !supabase) return fallback;
        try {
            const { data, error } = await query;
            if (error) {
                if (error.code === '42P01') {
                    console.warn(`[Supabase] Table "${tableName}" not found. Falling back to mock data.`);
                    return fallback;
                }
                throw error;
            }
            return (data as T) || fallback;
        } catch (e: any) {
            console.error(`[Supabase] Error fetching ${tableName}:`, e?.message || e);
            return fallback;
        }
    },

    mapUserFromDb(data: any): User {
        if (!data) return data;
        const { job_title, phone_number, site_id, ...rest } = data;
        return {
            ...rest,
            jobTitle: job_title || '',
            phoneNumber: phone_number || '',
            siteId: site_id || 'all'
        };
    },

    mapUserToDb(user: Partial<User>): any {
        const payload: any = {};
        if (user.id !== undefined) payload.id = user.id;
        if (user.name !== undefined) payload.name = user.name;
        if (user.email !== undefined) payload.email = user.email;
        if (user.role !== undefined) payload.role = user.role;
        if (user.status !== undefined) payload.status = user.status;
        if (user.company !== undefined) payload.company = user.company;
        if (user.jobTitle !== undefined) payload.job_title = user.jobTitle;
        if (user.phoneNumber !== undefined) payload.phone_number = user.phoneNumber;
        if (user.siteId !== undefined) payload.site_id = user.siteId;
        return payload;
    },

    mapEmployeeFromDb(data: any): Employee {
        if (!data) return data;
        const { record_id, site_id, phone_number, driver_license_number, driver_license_class, driver_license_expiry, is_active, ...rest } = data;
        return {
            ...rest,
            recordId: record_id,
            siteId: site_id || 's1',
            phoneNumber: phone_number,
            driverLicenseNumber: driver_license_number,
            driverLicenseClass: driver_license_class,
            driverLicenseExpiry: driver_license_expiry,
            isActive: is_active
        };
    },

    mapEmployeeToDb(emp: Partial<Employee>): any {
        const payload: any = {};
        if (emp.id !== undefined) payload.id = emp.id;
        if (emp.name !== undefined) payload.name = emp.name;
        if (emp.recordId !== undefined) payload.record_id = emp.recordId;
        if (emp.siteId !== undefined) payload.site_id = emp.siteId;
        if (emp.phoneNumber !== undefined) payload.phone_number = emp.phoneNumber;
        if (emp.driverLicenseNumber !== undefined) payload.driver_license_number = emp.driverLicenseNumber;
        if (emp.driverLicenseClass !== undefined) payload.driver_license_class = emp.driverLicenseClass;
        if (emp.driverLicenseExpiry !== undefined) payload.driver_license_expiry = emp.driverLicenseExpiry;
        if (emp.isActive !== undefined) payload.is_active = emp.isActive;
        return payload;
    },

    async getCompanies(): Promise<Company[]> {
        const raw = await this.safeQuery('companies', supabase?.from('companies').select('*'), []);
        return raw.map((c: any) => ({
            id: c.id,
            name: c.name,
            appName: c.app_name,
            logo_url: c.logo_url,
            safety_logo_url: c.safety_logo_url,
            status: c.status || 'Active',
            defaultLanguage: c.default_language || 'en',
            features: c.features || { alcohol: false }
        }));
    },

    async getSites(): Promise<Site[]> {
        return this.safeQuery('sites', supabase?.from('sites').select('*'), []);
    },

    async getUsers(): Promise<User[]> {
        const raw = await this.safeQuery('users', supabase?.from('users').select('*').order('name', { ascending: true }), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_USERS;
        return raw.map(u => this.mapUserFromDb(u));
    },

    async getEmployees(): Promise<Employee[]> {
        const raw = await this.safeQuery('employees', supabase?.from('employees').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return MOCK_EMPLOYEES;
        return raw.map(e => this.mapEmployeeFromDb(e));
    },

    async getSessions(): Promise<TrainingSession[]> {
        const raw = await this.safeQuery('training_sessions', supabase?.from('training_sessions').select('*').order('date', { ascending: true }), []);
        if (raw.length === 0 && !isSupabaseConfigured) return MOCK_SESSIONS;
        return raw.map(s => ({
            ...s,
            id: s.id,
            racType: s.rac_type,
            startTime: s.start_time,
            sessionLanguage: s.session_language,
            siteId: s.site_id
        }));
    },

    async getBookings(): Promise<Booking[]> {
        if (!isSupabaseConfigured || !supabase) return MOCK_BOOKINGS;
        try {
            const { data, error } = await supabase.from('bookings').select(`*, employee:employees(*)`);
            if (error) throw error;
            return ((data as any[]) || []).map(b => this.mapBookingFromDb(b));
        } catch (e: any) {
            return MOCK_BOOKINGS;
        }
    },

    async getRequirements(): Promise<EmployeeRequirement[]> {
        const raw = await this.safeQuery('employee_requirements', supabase?.from('employee_requirements').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return MOCK_REQUIREMENTS;
        return raw.map(r => ({
            ...r,
            employeeId: r.employee_id,
            aso_expiry_date: r.aso_expiry_date,
            requiredRacs: r.required_racs
        }));
    },

    async getRacDefinitions(): Promise<RacDef[]> {
        return this.safeQuery('rac_definitions', supabase?.from('rac_definitions').select('*').order('code'), []);
    },

    async getRooms(): Promise<Room[]> {
        return this.safeQuery('rooms', supabase?.from('rooms').select('*'), []);
    },

    async getTrainers(): Promise<Trainer[]> {
        const raw = await this.safeQuery('trainers', supabase?.from('trainers').select('*'), []);
        return raw.map((t: any) => ({ 
            id: t.id,
            name: t.name,
            racs: t.authorized_racs || [], // Maps text[] column
            siteId: t.site_id // Maps uuid column
        }));
    },

    async getFeedback(): Promise<Feedback[]> {
        return this.safeQuery('feedback', supabase?.from('feedback').select('*').order('timestamp', { ascending: false }), []);
    },

    async getNotifications(): Promise<SystemNotification[]> {
        return this.safeQuery('notifications', supabase?.from('notifications').select('*').order('timestamp', { ascending: false }), []);
    },

    async saveCompany(company: Company) {
        if (!isSupabaseConfigured || !supabase) return company;
        const payload = {
            id: company.id,
            name: company.name,
            app_name: company.appName,
            logo_url: company.logoUrl,
            safety_logo_url: company.safetyLogoUrl,
            status: company.status,
            default_language: company.defaultLanguage,
            features: company.features
        };
        const { data, error } = await supabase.from('companies').upsert(payload).select();
        if (error) throw error;
        return data[0];
    },

    async saveRacDefinition(rac: RacDef) {
        if (!isSupabaseConfigured || !supabase) return rac;
        const payload = {
            id: rac.id,
            company_id: rac.companyId,
            code: rac.code,
            name: rac.name,
            validity_months: rac.validityMonths,
            requires_driver_license: rac.requiresDriverLicense,
            requires_practical: rac.requiresPractical
        };
        const { data, error } = await supabase.from('rac_definitions').upsert(payload).select();
        if (error) throw error;
        return data[0];
    },

    async deleteRacDefinition(id: string) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('rac_definitions').delete().eq('id', id);
    },

    async saveSite(site: Site) {
        if (!isSupabaseConfigured || !supabase) return site;
        const { data, error } = await supabase.from('sites').upsert({
            id: site.id,
            company_id: site.companyId,
            name: site.name,
            location: site.location,
            mandatory_racs: site.mandatoryRacs
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteSite(id: string) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('sites').delete().eq('id', id);
    },

    async saveRoom(room: Room) {
        if (!isSupabaseConfigured || !supabase) return room;
        const { data, error } = await supabase.from('rooms').upsert({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            site_id: room.siteId
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteRoom(id: string) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('rooms').delete().eq('id', id);
    },

    async saveTrainer(trainer: Trainer) {
        if (!isSupabaseConfigured || !supabase) return trainer;
        const { data, error } = await supabase.from('trainers').upsert({
            id: trainer.id,
            name: trainer.name,
            authorized_racs: trainer.racs, // Maps to text[]
            site_id: trainer.siteId // Maps to uuid
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteTrainer(id: string) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('trainers').delete().eq('id', id);
    },

    async upsertUser(user: Partial<User>) {
        if (!isSupabaseConfigured || !supabase) return user;
        const payload = this.mapUserToDb(user);
        const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();
        if (error) throw error;
        return this.mapUserFromDb(data[0]);
    },

    async updateUserPassword(id: number, password: string) {
        if (!isSupabaseConfigured || !supabase) return;
        const { error } = await supabase.from('users').update({ password }).eq('id', id);
        if (error) throw error;
    },

    async upsertEmployee(emp: Partial<Employee>) {
        if (!isSupabaseConfigured || !supabase) return emp;
        const payload = this.mapEmployeeToDb(emp);
        const { data, error } = await supabase.from('employees').upsert(payload, { onConflict: 'record_id' }).select();
        if (error) throw error;
        return this.mapEmployeeFromDb(data[0]);
    },

    async saveBooking(booking: Partial<Booking>) {
        if (!isSupabaseConfigured || !supabase) return booking;
        const payload: any = { ...booking };
        if (booking.employee) payload.employee_id = booking.employee.id;
        delete payload.employee;
        const { data, error } = await supabase.from('bookings').upsert(payload).select();
        if (error) throw error;
        return data[0];
    },

    async updateRequirement(req: EmployeeRequirement) {
        if (!isSupabaseConfigured || !supabase) return;
        const payload = { employee_id: req.employeeId, aso_expiry_date: req.asoExpiryDate, required_racs: req.requiredRacs };
        await supabase.from('employee_requirements').upsert(payload);
    },

    async saveFeedback(f: Partial<Feedback>) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('feedback').upsert(f);
    },

    async addLog(level: string, message: string, user: string, metadata?: any) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('system_logs').insert({
            level,
            message_key: message,
            user_name: user,
            metadata: metadata || {}
        });
    },

    async getLogs(): Promise<any[]> {
        if (!isSupabaseConfigured || !supabase) return [];
        const { data, error } = await supabase
            .from('system_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        return data.map(l => ({
            id: l.id,
            level: l.level,
            messageKey: l.message_key,
            user: l.user_name,
            timestamp: l.timestamp,
            aiFix: l.metadata?.aiFix || null
        }));
    },

    mapBookingFromDb(data: any): Booking {
        const { employee_id, session_id, result_date, expiry_date, theory_score, practical_score, driver_license_verified, is_auto_booked, employee, ...rest } = data;
        return {
            ...rest,
            sessionId: session_id,
            employee: this.mapEmployeeFromDb(employee),
            resultDate: result_date,
            expiryDate: expiry_date,
            theoryScore: theory_score,
            practicalScore: practical_score,
            driverLicenseVerified: driver_license_verified,
            isAutoBooked: is_auto_booked
        };
    },

    mapSessionFromDb(data: any): TrainingSession {
        return {
            id: data.id,
            racType: data.rac_type,
            date: data.date,
            startTime: data.start_time,
            location: data.location,
            instructor: data.instructor,
            capacity: data.capacity,
            sessionLanguage: data.session_language,
            siteId: data.site_id
        };
    }
};
