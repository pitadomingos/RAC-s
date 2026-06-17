
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Booking, Employee, TrainingSession, EmployeeRequirement, Site, Company, BookingStatus, User, UserRole, RacDef, Room, Trainer, Feedback, SystemNotification, DataConnector } from '../types';
import { MOCK_EMPLOYEES, MOCK_BOOKINGS, MOCK_SESSIONS, MOCK_REQUIREMENTS } from '../constants';
import {
    DEMO_EMPLOYEES,
    DEMO_BOOKINGS,
    DEMO_SESSIONS,
    DEMO_REQUIREMENTS,
    DEMO_COMPANIES,
    DEMO_SITES,
    DEMO_ROOMS,
    DEMO_TRAINERS,
    DEMO_RAC_DEFINITIONS,
    DEMO_USERS,
} from '../mockData';

// Helper to load/save JSON in localStorage for offline persistence
const getLocalStorageJson = (key: string, defaultVal: any) => {
    try {
        const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
};

const saveLocalStorageJson = (key: string, val: any) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(val));
        }
    } catch (e) {
        console.error("Failed to save to localStorage", e);
    }
};

import { v4 as uuidv4 } from 'uuid';

const initialEmployees = DEMO_EMPLOYEES.length ? DEMO_EMPLOYEES : MOCK_EMPLOYEES;
const initialBookings = DEMO_BOOKINGS.length ? DEMO_BOOKINGS : MOCK_BOOKINGS;
const initialSessions = DEMO_SESSIONS.length ? DEMO_SESSIONS : MOCK_SESSIONS;
const initialRequirements = DEMO_REQUIREMENTS.length ? DEMO_REQUIREMENTS : MOCK_REQUIREMENTS;
const initialCompanies = DEMO_COMPANIES;
const initialSites = DEMO_SITES;
const initialRooms = DEMO_ROOMS;
const initialTrainers = DEMO_TRAINERS;
const initialRacDefs = DEMO_RAC_DEFINITIONS;
const initialUsers: User[] = DEMO_USERS.length ? DEMO_USERS : [
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

let FALLBACK_EMPLOYEES: Employee[] = getLocalStorageJson('fallback_employees', initialEmployees);
let FALLBACK_BOOKINGS: Booking[] = getLocalStorageJson('fallback_bookings', initialBookings);
let FALLBACK_SESSIONS: TrainingSession[] = getLocalStorageJson('fallback_sessions', initialSessions);
let FALLBACK_REQUIREMENTS: EmployeeRequirement[] = getLocalStorageJson('fallback_requirements', initialRequirements);
let FALLBACK_COMPANIES: Company[] = getLocalStorageJson('fallback_companies', initialCompanies);
let FALLBACK_SITES: Site[] = getLocalStorageJson('fallback_sites', initialSites);
let FALLBACK_ROOMS: Room[] = getLocalStorageJson('fallback_rooms', initialRooms);
let FALLBACK_TRAINERS: Trainer[] = getLocalStorageJson('fallback_trainers', initialTrainers);
let FALLBACK_RAC_DEFS: RacDef[] = getLocalStorageJson('fallback_rac_defs', initialRacDefs);
let FALLBACK_USERS: User[] = getLocalStorageJson('fallback_users', initialUsers);


// Helper to validate UUID format to prevent Supabase database crashes
// Standard UUID is 8-4-4-4-12 (36 chars with hyphens)
export const isUUID = (str: string | undefined): boolean => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

export const db = {
    async safeQuery<T>(tableName: string, query: any, fallback: T): Promise<T> {
        if (!isSupabaseConfigured || !supabase) return fallback;
        try {
            const { data, error } = await query;
            if (error) {
                const errorMsg = error.message || '';
                const isSchemaError = error.code === '42P01' || 
                                     error.code === '42703' ||
                                     errorMsg.includes('schema cache') || 
                                     errorMsg.includes('does not exist') ||
                                     error.code === 'PGRST116';
                
                if (isSchemaError) {
                    return fallback;
                }
                throw error;
            }
            return (data as T) || fallback;
        } catch (e: any) {
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
        // @ts-ignore
        if (user.password !== undefined) payload.password = user.password;
        return payload;
    },

    mapCompanyFromDb(c: any): Company {
        return {
            id: c.id,
            name: c.name,
            appName: c.app_name,
            logoUrl: c.logo_url,
            safetyLogoUrl: c.safety_logo_url,
            status: (c.status as 'Active' | 'Inactive') || 'Active',
            defaultLanguage: (c.default_language as 'en' | 'pt') || 'en',
            parentId: c.parent_id || undefined, 
            tier: (c.tier as 'Prime' | 'Sub') || 'Prime',
            features: c.features || { alcohol: false }
        };
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
        if (emp.id !== undefined) payload.id = isUUID(emp.id) ? emp.id : uuidv4();
        if (emp.name !== undefined) payload.name = emp.name;
        if (emp.recordId !== undefined) payload.record_id = emp.recordId;
        if (emp.siteId !== undefined) payload.site_id = isUUID(emp.siteId) ? emp.siteId : null;
        if (emp.phoneNumber !== undefined) payload.phone_number = emp.phoneNumber;
        if (emp.driverLicenseNumber !== undefined) payload.driver_license_number = emp.driverLicenseNumber;
        if (emp.driverLicenseClass !== undefined) payload.driver_license_class = emp.driverLicenseClass;
        if (emp.driverLicenseExpiry !== undefined) payload.driver_license_expiry = emp.driverLicenseExpiry;
        if (emp.isActive !== undefined) payload.is_active = emp.isActive;
        if (emp.company !== undefined) payload.company = emp.company;
        if (emp.department !== undefined) payload.department = emp.department;
        if (emp.role !== undefined) payload.role = emp.role;
        return payload;
    },

    async getCompanies(): Promise<Company[]> {
        const raw = await this.safeQuery('companies', supabase?.from('companies').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return DEMO_COMPANIES;
        return raw.map((c: any) => this.mapCompanyFromDb(c));
    },

    async getSites(): Promise<Site[]> {
        const raw = await this.safeQuery('sites', supabase?.from('sites').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return DEMO_SITES;
        return raw;
    },

    async getUsers(): Promise<User[]> {
        const raw = await this.safeQuery('users', supabase?.from('users').select('*').order('name', { ascending: true }), []);
        if (raw.length === 0 && !isSupabaseConfigured) return DEMO_USERS;
        return raw.map(u => this.mapUserFromDb(u));
    },

    async getEmployees(): Promise<Employee[]> {
        const raw = await this.safeQuery('employees', supabase?.from('employees').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_EMPLOYEES;
        return raw.map(e => this.mapEmployeeFromDb(e));
    },

    async getSessions(): Promise<TrainingSession[]> {
        const raw = await this.safeQuery('training_sessions', supabase?.from('training_sessions').select('*').order('date', { ascending: true }), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_SESSIONS;
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
        if (!isSupabaseConfigured || !supabase) return FALLBACK_BOOKINGS;
        try {
            const [confirmed, queued] = await Promise.all([
                supabase.from('records').select(`*, employee:employees(*)`),
                supabase.from('waiting_list').select(`*, employee:employees(*)`)
            ]);

            const confirmedData = ((confirmed.data as any[]) || []).map(b => this.mapBookingFromDb(b));
            const waitData = ((queued.data as any[]) || []).map(w => ({
                id: w.id,
                sessionId: w.session_id,
                employee: this.mapEmployeeFromDb(w.employee),
                status: BookingStatus.WAITLISTED,
                resultDate: null,
                expiryDate: null,
                theoryScore: 0,
                practicalScore: 0,
                attendance: false
            } as Booking));

            return [...confirmedData, ...waitData];
        } catch (e: any) {
            return MOCK_BOOKINGS;
        }
    },

    async bulkUpsertEmployees(employees: Partial<Employee>[]) {
        if (!isSupabaseConfigured || !supabase) {
            const returnedData: { id: string, record_id: string }[] = [];
            const updatedList = [...FALLBACK_EMPLOYEES];
            
            employees.forEach(emp => {
                const targetId = isUUID(emp.id) ? emp.id : uuidv4();
                const recordId = emp.recordId || '';
                
                const existingIdx = updatedList.findIndex(e => e.recordId === recordId);
                const employeeObj: Employee = {
                    id: targetId,
                    recordId: recordId,
                    name: emp.name || 'Unknown',
                    company: emp.company || 'Unknown',
                    department: emp.department || 'N/A',
                    role: emp.role || 'N/A',
                    siteId: emp.siteId || 's1',
                    isActive: emp.isActive ?? true,
                    phoneNumber: emp.phoneNumber,
                    driverLicenseNumber: emp.driverLicenseNumber,
                    driverLicenseClass: emp.driverLicenseClass,
                    driverLicenseExpiry: emp.driverLicenseExpiry
                };
                
                if (existingIdx >= 0) {
                    employeeObj.id = updatedList[existingIdx].id;
                    updatedList[existingIdx] = {
                        ...updatedList[existingIdx],
                        ...emp,
                        id: employeeObj.id
                    };
                } else {
                    updatedList.push(employeeObj);
                }
                
                returnedData.push({ id: employeeObj.id, record_id: employeeObj.recordId });
            });
            
            FALLBACK_EMPLOYEES = updatedList;
            saveLocalStorageJson('fallback_employees', FALLBACK_EMPLOYEES);
            return returnedData;
        }
        const payload = employees.map(e => this.mapEmployeeToDb(e));
        const { data, error } = await supabase.from('employees').upsert(payload, { onConflict: 'record_id' }).select('id, record_id');
        if (error) throw error;
        return data || [];
    },

    async bulkUpsertBookings(bookings: Partial<Booking>[]) {
        if (!isSupabaseConfigured || !supabase) {
            const updatedList = [...FALLBACK_BOOKINGS];
            bookings.forEach(b => {
                const id = isUUID(b.id) ? b.id : uuidv4();
                const existingIdx = updatedList.findIndex(x => x.id === id);
                
                let empObj = b.employee || FALLBACK_EMPLOYEES.find(e => e.id === b.employee?.id);
                if (!empObj) {
                    empObj = {
                        id: b.employee?.id || uuidv4(),
                        recordId: b.employee?.recordId || 'MOCK-EMP',
                        name: b.employee?.name || 'Unknown',
                        company: b.employee?.company || 'Unknown',
                        department: b.employee?.department || 'N/A',
                        role: b.employee?.role || 'N/A',
                        isActive: true
                    };
                }

                const bookingObj: Booking = {
                    id,
                    sessionId: b.sessionId || '',
                    employee: empObj,
                    status: b.status || BookingStatus.PENDING,
                    resultDate: b.resultDate || null,
                    expiryDate: b.expiryDate || null,
                    theoryScore: b.theoryScore || 0,
                    practicalScore: b.practicalScore || 0,
                    attendance: b.attendance ?? false,
                    trainerName: b.trainerName,
                    comments: b.comments || (!isUUID(b.sessionId) ? `Imported Classroom: ${b.sessionId}` : null)
                };

                if (existingIdx >= 0) {
                    updatedList[existingIdx] = {
                        ...updatedList[existingIdx],
                        ...b,
                        employee: empObj
                    } as Booking;
                } else {
                    updatedList.push(bookingObj);
                }
            });
            FALLBACK_BOOKINGS = updatedList;
            saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            return;
        }
        const payload = bookings.map(b => ({
            id: b.id,
            session_id: isUUID(b.sessionId) ? b.sessionId : null,
            employee_id: b.employee?.id,
            status: b.status,
            result_date: b.resultDate,
            expiry_date: b.expiryDate,
            theory_score: b.theoryScore,
            practical_score: b.practicalScore,
            attendance: b.attendance,
            trainer_name: b.trainerName,
            comments: b.comments || (!isUUID(b.sessionId) ? `Imported Classroom: ${b.sessionId}` : null)
        }));
        const { error } = await supabase.from('records').upsert(payload);
        if (error) throw error;
    },

    async bulkUpsertRequirements(reqs: EmployeeRequirement[]) {
        if (!isSupabaseConfigured || !supabase) {
            const updatedList = [...FALLBACK_REQUIREMENTS];
            reqs.forEach(r => {
                const existingIdx = updatedList.findIndex(x => x.employeeId === r.employeeId);
                if (existingIdx >= 0) {
                    updatedList[existingIdx] = {
                        ...updatedList[existingIdx],
                        asoExpiryDate: r.asoExpiryDate || updatedList[existingIdx].asoExpiryDate,
                        requiredRacs: {
                            ...updatedList[existingIdx].requiredRacs,
                            ...r.requiredRacs
                        }
                    };
                } else {
                    updatedList.push(r);
                }
            });
            FALLBACK_REQUIREMENTS = updatedList;
            saveLocalStorageJson('fallback_requirements', FALLBACK_REQUIREMENTS);
            return;
        }
        const payload = reqs.map(r => ({
            employee_id: r.employeeId,
            aso_expiry_date: r.asoExpiryDate,
            required_racs: r.requiredRacs
        }));
        const { error } = await supabase.from('employee_requirements').upsert(payload);
        if (error) throw error;
    },

    async getConnectors(): Promise<DataConnector[]> {
        const raw = await this.safeQuery('data_connectors', supabase?.from('data_connectors').select('*'), []);
        return raw.map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            lastSync: c.last_sync,
            status: c.status,
            color: c.color,
            source: c.source,
            config: c.config || {},
            mapping: c.mapping || {},
            module_mapping: c.module_mapping || {}
        }));
    },

    async saveConnector(connector: DataConnector): Promise<void> {
        if (!isSupabaseConfigured || !supabase) return;
        const payload = {
            id: connector.id,
            name: connector.name,
            type: connector.type,
            last_sync: connector.lastSync,
            status: connector.status,
            color: connector.color,
            source: connector.source,
            config: connector.config,
            mapping: connector.mapping,
            module_mapping: connector.moduleMapping
        };
        await supabase.from('data_connectors').upsert(payload);
    },

    async syncExternalData(connectorId: string, rawData: any[], includeModules: boolean = false): Promise<{ added: number, updated: number }> {
        if (!isSupabaseConfigured || !supabase) {
            return { added: rawData.length, updated: 0 };
        }

        let added = 0;
        let updated = 0;

        for (const item of rawData) {
            const normalizedEmp: Partial<Employee> = {
                id: uuidv4(),
                recordId: item.id,
                name: item.name,
                company: item.company || (connectorId === 'sf-hr' ? 'Vulcan' : 'Unknown'),
                department: item.dept || 'Operations',
                role: item.role || 'Personnel',
                isActive: true,
                siteId: 's1'
            };

            const { data: existing } = await supabase
                .from('employees')
                .select('id')
                .eq('record_id', normalizedEmp.recordId)
                .maybeSingle();

            let targetEmployeeId = '';

            if (existing) {
                targetEmployeeId = existing.id;
                const { error } = await supabase.from('employees').update(this.mapEmployeeToDb(normalizedEmp)).eq('id', existing.id);
                if (!error) updated++;
            } else {
                const { data: created, error } = await supabase.from('employees').insert(this.mapEmployeeToDb(normalizedEmp)).select('id').single();
                if (!error && created) {
                    targetEmployeeId = created.id;
                    added++;
                }
            }

            if (includeModules && targetEmployeeId && item.aso_expiry) {
                const racMatrix: Record<string, boolean> = {};
                if (Array.isArray(item.rac_flags)) {
                    item.rac_flags.forEach((f: string) => racMatrix[f] = true);
                }

                const requirementPayload = {
                    employee_id: targetEmployeeId,
                    aso_expiry_date: item.aso_expiry,
                    required_racs: racMatrix
                };

                await supabase.from('employee_requirements').upsert(requirementPayload);
            }
        }

        return { added, updated };
    },

    async promoteFromWaitlist(entryId: string, sessionId: string, employeeId: string) {
        if (!isSupabaseConfigured || !supabase) {
            const idx = FALLBACK_BOOKINGS.findIndex(b => b.id === entryId);
            if (idx >= 0) {
                FALLBACK_BOOKINGS[idx].status = BookingStatus.PENDING;
                saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            }
            return;
        }
        const { error: insertErr } = await supabase.from('records').insert({
            session_id: sessionId,
            employee_id: employeeId,
            status: BookingStatus.PENDING
        });
        if (insertErr) throw insertErr;
        const { error: deleteErr } = await supabase.from('waiting_list').delete().eq('id', entryId);
        if (deleteErr) throw deleteErr;
    },

    async saveWaitlistEntry(sessionId: string, employeeId: string) {
        if (!isSupabaseConfigured || !supabase) {
            const emp = FALLBACK_EMPLOYEES.find(e => e.id === employeeId);
            if (emp) {
                const newWaitlistBooking: Booking = {
                    id: uuidv4(),
                    sessionId,
                    employee: emp,
                    status: BookingStatus.WAITLISTED,
                    resultDate: null,
                    expiryDate: null,
                    theoryScore: 0,
                    practicalScore: 0,
                    attendance: false
                };
                FALLBACK_BOOKINGS.push(newWaitlistBooking);
                saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            }
            return;
        }
        const { error } = await supabase.from('waiting_list').insert({
            session_id: sessionId,
            employee_id: employeeId
        });
        if (error) throw error;
    },

    async removeFromWaitlist(entryId: string) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_BOOKINGS = FALLBACK_BOOKINGS.filter(b => b.id !== entryId);
            saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            return;
        }
        await supabase.from('waiting_list').delete().eq('id', entryId);
    },

    async getRequirements(): Promise<EmployeeRequirement[]> {
        const raw = await this.safeQuery('employee_requirements', supabase?.from('employee_requirements').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_REQUIREMENTS;
        return raw.map(r => ({
            ...r,
            employeeId: r.employee_id,
            asoExpiryDate: r.aso_expiry_date,
            requiredRacs: r.required_racs
        }));
    },

    async getRacDefinitions(): Promise<RacDef[]> {
        const raw = await this.safeQuery('rac_definitions', supabase?.from('rac_definitions').select('*').order('code'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_RAC_DEFS;
        return raw;
    },

    async getRooms(): Promise<Room[]> {
        const raw = await this.safeQuery('rooms', supabase?.from('rooms').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_ROOMS;
        return raw;
    },

    async getTrainers(): Promise<Trainer[]> {
        const raw = await this.safeQuery('trainers', supabase?.from('trainers').select('*'), []);
        if (raw.length === 0 && !isSupabaseConfigured) return FALLBACK_TRAINERS;
        return raw.map((t: any) => ({ 
            id: t.id,
            name: t.name,
            racs: t.authorized_racs || [], 
            siteId: t.site_id 
        }));
    },

    async saveCompany(company: Company): Promise<Company> {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = isUUID(company.id) ? company.id : uuidv4();
            const companyObj: Company = {
                id: targetId,
                name: company.name,
                appName: company.appName,
                logoUrl: company.logoUrl,
                safetyLogoUrl: company.safetyLogoUrl,
                status: company.status || 'Active',
                defaultLanguage: company.defaultLanguage || 'en',
                parentId: company.parentId && isUUID(company.parentId) ? company.parentId : undefined,
                tier: company.tier || 'Prime',
                features: company.features || { alcohol: false }
            };
            const idx = FALLBACK_COMPANIES.findIndex(c => c.id === targetId);
            if (idx >= 0) {
                FALLBACK_COMPANIES[idx] = companyObj;
            } else {
                FALLBACK_COMPANIES.push(companyObj);
            }
            saveLocalStorageJson('fallback_companies', FALLBACK_COMPANIES);
            return companyObj;
        }
        
        // Ensure ID is a valid UUID. If it's a mock ID like 'c1', generate a new one.
        const targetId = isUUID(company.id) ? company.id : uuidv4();

        const payload: any = {
            id: targetId,
            name: company.name,
            app_name: company.appName,
            logo_url: company.logoUrl,
            safety_logo_url: company.safetyLogoUrl,
            status: company.status,
            default_language: company.defaultLanguage,
            features: company.features
        };
        
        // Ensure parent_id is valid UUID
        if (company.parentId && isUUID(company.parentId)) {
            payload.parent_id = company.parentId;
        } else {
            payload.parent_id = null;
        }

        if (company.tier) payload.tier = company.tier;

        const { data, error } = await supabase.from('companies').upsert(payload).select();
        if (error) throw error;
        return this.mapCompanyFromDb(data[0]);
    },

    async saveRacDefinition(rac: RacDef) {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = isUUID(rac.id) ? rac.id : uuidv4();
            const racObj: RacDef = {
                id: targetId,
                companyId: rac.companyId || null,
                code: rac.code,
                name: rac.name,
                validityMonths: rac.validityMonths,
                requiresDriverLicense: rac.requiresDriverLicense,
                requiresPractical: rac.requiresPractical
            };
            const idx = FALLBACK_RAC_DEFS.findIndex(r => r.id === targetId);
            if (idx >= 0) {
                FALLBACK_RAC_DEFS[idx] = racObj;
            } else {
                FALLBACK_RAC_DEFS.push(racObj);
            }
            saveLocalStorageJson('fallback_rac_defs', FALLBACK_RAC_DEFS);
            return racObj;
        }
        const payload = {
            id: isUUID(rac.id) ? rac.id : uuidv4(),
            company_id: (rac.companyId && isUUID(rac.companyId)) ? rac.companyId : null,
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
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_RAC_DEFS = FALLBACK_RAC_DEFS.filter(r => r.id !== id);
            saveLocalStorageJson('fallback_rac_defs', FALLBACK_RAC_DEFS);
            return;
        }
        await supabase.from('rac_definitions').delete().eq('id', id);
    },

    async saveSite(site: Site) {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = isUUID(site.id) ? site.id : uuidv4();
            const siteObj: Site = {
                id: targetId,
                companyId: site.companyId || null,
                name: site.name,
                location: site.location,
                mandatoryRacs: site.mandatoryRacs || []
            };
            const idx = FALLBACK_SITES.findIndex(s => s.id === targetId);
            if (idx >= 0) {
                FALLBACK_SITES[idx] = siteObj;
            } else {
                FALLBACK_SITES.push(siteObj);
            }
            saveLocalStorageJson('fallback_sites', FALLBACK_SITES);
            return siteObj;
        }
        const { data, error } = await supabase.from('sites').upsert({
            id: isUUID(site.id) ? site.id : uuidv4(),
            company_id: isUUID(site.companyId) ? site.companyId : null,
            name: site.name,
            location: site.location,
            mandatory_racs: site.mandatoryRacs
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteSite(id: string) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_SITES = FALLBACK_SITES.filter(s => s.id !== id);
            saveLocalStorageJson('fallback_sites', FALLBACK_SITES);
            return;
        }
        await supabase.from('sites').delete().eq('id', id);
    },

    async saveRoom(room: Room) {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = isUUID(room.id) ? room.id : uuidv4();
            const roomObj: Room = {
                id: targetId,
                name: room.name,
                capacity: room.capacity,
                siteId: room.siteId || null
            };
            const idx = FALLBACK_ROOMS.findIndex(r => r.id === targetId);
            if (idx >= 0) {
                FALLBACK_ROOMS[idx] = roomObj;
            } else {
                FALLBACK_ROOMS.push(roomObj);
            }
            saveLocalStorageJson('fallback_rooms', FALLBACK_ROOMS);
            return roomObj;
        }
        const { data, error } = await supabase.from('rooms').upsert({
            id: isUUID(room.id) ? room.id : uuidv4(),
            name: room.name,
            capacity: room.capacity,
            site_id: isUUID(room.siteId) ? room.siteId : null
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteRoom(id: string) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_ROOMS = FALLBACK_ROOMS.filter(r => r.id !== id);
            saveLocalStorageJson('fallback_rooms', FALLBACK_ROOMS);
            return;
        }
        await supabase.from('rooms').delete().eq('id', id);
    },

    async saveTrainer(trainer: Trainer) {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = isUUID(trainer.id) ? trainer.id : uuidv4();
            const trainerObj: Trainer = {
                id: targetId,
                name: trainer.name,
                racs: trainer.racs || [],
                siteId: trainer.siteId || null
            };
            const idx = FALLBACK_TRAINERS.findIndex(t => t.id === targetId);
            if (idx >= 0) {
                FALLBACK_TRAINERS[idx] = trainerObj;
            } else {
                FALLBACK_TRAINERS.push(trainerObj);
            }
            saveLocalStorageJson('fallback_trainers', FALLBACK_TRAINERS);
            return trainerObj;
        }
        const { data, error } = await supabase.from('trainers').upsert({
            id: isUUID(trainer.id) ? trainer.id : uuidv4(),
            name: trainer.name,
            authorized_racs: trainer.racs, 
            site_id: isUUID(trainer.siteId) ? trainer.siteId : null 
        }).select();
        if (error) throw error;
        return data[0];
    },

    async deleteTrainer(id: string) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_TRAINERS = FALLBACK_TRAINERS.filter(t => t.id !== id);
            saveLocalStorageJson('fallback_trainers', FALLBACK_TRAINERS);
            return;
        }
        await supabase.from('trainers').delete().eq('id', id);
    },

    async upsertUser(user: Partial<User>) {
        if (!isSupabaseConfigured || !supabase) {
            const targetId = typeof user.id === 'number' ? user.id : Math.floor(Math.random() * 10000);
            const userObj: User = {
                id: targetId,
                name: user.name || 'Unknown',
                email: user.email || '',
                role: user.role || UserRole.USER,
                status: user.status || 'Active',
                company: user.company || 'Unknown',
                jobTitle: user.jobTitle || 'N/A',
                siteId: user.siteId || 'all'
            };
            const idx = FALLBACK_USERS.findIndex(u => u.email === user.email || u.id === targetId);
            if (idx >= 0) {
                FALLBACK_USERS[idx] = { ...FALLBACK_USERS[idx], ...userObj };
            } else {
                FALLBACK_USERS.push(userObj);
            }
            saveLocalStorageJson('fallback_users', FALLBACK_USERS);
            return userObj;
        }
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

    async deleteUser(id: number) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_USERS = FALLBACK_USERS.filter(u => u.id !== id);
            saveLocalStorageJson('fallback_users', FALLBACK_USERS);
            return;
        }
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
    },

    async upsertEmployee(emp: Partial<Employee>) {
        if (!isSupabaseConfigured || !supabase) {
            const recordId = emp.recordId || '';
            const existingIdx = FALLBACK_EMPLOYEES.findIndex(e => e.recordId === recordId || (isUUID(emp.id) && e.id === emp.id));
            let employeeObj: Employee;
            if (existingIdx >= 0) {
                employeeObj = {
                    ...FALLBACK_EMPLOYEES[existingIdx],
                    ...emp
                } as Employee;
                FALLBACK_EMPLOYEES[existingIdx] = employeeObj;
            } else {
                employeeObj = {
                    id: isUUID(emp.id) ? emp.id : uuidv4(),
                    recordId: recordId,
                    name: emp.name || 'Unknown',
                    company: emp.company || 'Unknown',
                    department: emp.department || 'N/A',
                    role: emp.role || 'N/A',
                    siteId: emp.siteId || 's1',
                    isActive: emp.isActive ?? true,
                    phoneNumber: emp.phoneNumber,
                    driverLicenseNumber: emp.driverLicenseNumber,
                    driverLicenseClass: emp.driverLicenseClass,
                    driverLicenseExpiry: emp.driverLicenseExpiry
                };
                FALLBACK_EMPLOYEES.push(employeeObj);
            }
            saveLocalStorageJson('fallback_employees', FALLBACK_EMPLOYEES);
            return employeeObj;
        }
        const payload = this.mapEmployeeToDb(emp);
        const { data, error } = await supabase.from('employees').upsert(payload, { onConflict: 'record_id' }).select();
        if (error) throw error;
        return this.mapEmployeeFromDb(data[0]);
    },

    async deleteEmployee(id: string) {
        if (!isSupabaseConfigured || !supabase) {
            FALLBACK_EMPLOYEES = FALLBACK_EMPLOYEES.filter(e => e.id !== id);
            saveLocalStorageJson('fallback_employees', FALLBACK_EMPLOYEES);
            FALLBACK_REQUIREMENTS = FALLBACK_REQUIREMENTS.filter(r => r.employeeId !== id);
            saveLocalStorageJson('fallback_requirements', FALLBACK_REQUIREMENTS);
            FALLBACK_BOOKINGS = FALLBACK_BOOKINGS.filter(b => b.employee?.id !== id);
            saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            return;
        }
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
    },

    async saveBooking(booking: Partial<Booking>) {
        if (!isSupabaseConfigured || !supabase) {
            if (booking.status === BookingStatus.WAITLISTED) {
                await this.saveWaitlistEntry(booking.sessionId!, booking.employee!.id);
                return booking;
            }
            const targetId = isUUID(booking.id) ? booking.id : uuidv4();
            const existingIdx = FALLBACK_BOOKINGS.findIndex(b => b.id === targetId);
            
            let empObj = booking.employee || FALLBACK_EMPLOYEES.find(e => e.id === booking.employee?.id);
            if (!empObj) {
                empObj = {
                    id: booking.employee?.id || uuidv4(),
                    recordId: booking.employee?.recordId || 'MOCK-EMP',
                    name: booking.employee?.name || 'Unknown',
                    company: booking.employee?.company || 'Unknown',
                    department: booking.employee?.department || 'N/A',
                    role: booking.employee?.role || 'N/A',
                    isActive: true
                };
            }
            const bookingObj: Booking = {
                id: targetId,
                sessionId: booking.sessionId || '',
                employee: empObj,
                status: booking.status || BookingStatus.PENDING,
                resultDate: booking.resultDate || null,
                expiryDate: booking.expiryDate || null,
                theoryScore: booking.theoryScore || 0,
                practicalScore: booking.practicalScore || 0,
                attendance: booking.attendance ?? false,
                trainerName: booking.trainerName,
                comments: booking.comments || (!isUUID(booking.sessionId) ? `Virtual Session: ${booking.sessionId}` : null)
            };
            if (existingIdx >= 0) {
                FALLBACK_BOOKINGS[existingIdx] = {
                    ...FALLBACK_BOOKINGS[existingIdx],
                    ...booking,
                    employee: empObj
                } as Booking;
            } else {
                FALLBACK_BOOKINGS.push(bookingObj);
            }
            saveLocalStorageJson('fallback_bookings', FALLBACK_BOOKINGS);
            return bookingObj;
        }
        
        if (booking.status === BookingStatus.WAITLISTED) {
            await this.saveWaitlistEntry(booking.sessionId!, booking.employee!.id);
            return booking;
        }

        const payload: any = { ...booking };
        if (booking.employee) payload.employee_id = booking.employee.id;
        delete payload.employee;
        
        const dbPayload = {
            id: isUUID(payload.id) ? payload.id : uuidv4(),
            session_id: isUUID(payload.sessionId) ? payload.sessionId : null,
            employee_id: payload.employee_id,
            status: payload.status,
            result_date: payload.resultDate,
            expiry_date: payload.expiryDate,
            theory_score: payload.theoryScore,
            practical_score: payload.practicalScore,
            attendance: payload.attendance,
            driver_license_verified: payload.driver_license_verified,
            is_auto_booked: payload.isAutoBooked,
            comments: payload.comments || (!isUUID(payload.sessionId) ? `Virtual Session: ${payload.sessionId}` : null),
            trainer_name: payload.trainerName
        };

        const { data, error } = await supabase.from('records').upsert(dbPayload).select();
        if (error) throw error;
        return data[0];
    },

    async updateRequirement(req: EmployeeRequirement) {
        if (!isSupabaseConfigured || !supabase) {
            const existingIdx = FALLBACK_REQUIREMENTS.findIndex(r => r.employeeId === req.employeeId);
            if (existingIdx >= 0) {
                FALLBACK_REQUIREMENTS[existingIdx] = req;
            } else {
                FALLBACK_REQUIREMENTS.push(req);
            }
            saveLocalStorageJson('fallback_requirements', FALLBACK_REQUIREMENTS);
            return;
        }
        const payload = { 
            employee_id: req.employeeId, 
            aso_expiry_date: req.asoExpiryDate, 
            required_racs: req.requiredRacs 
        };
        await supabase.from('employee_requirements').upsert(payload);
    },

    async saveFeedback(f: Partial<Feedback>) {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.from('feedback').upsert(f);
    },

    async addLog(level: string, message: string, user: string, metadata?: any) {
        if (!isSupabaseConfigured || !supabase) {
            const logs = getLocalStorageJson('fallback_logs', []);
            logs.unshift({
                id: uuidv4(),
                level,
                message_key: message,
                user_name: user,
                timestamp: new Date().toISOString(),
                metadata: metadata || {}
            });
            if (logs.length > 100) logs.pop();
            saveLocalStorageJson('fallback_logs', logs);
            return;
        }
        await supabase.from('system_logs').insert({
            level,
            message_key: message,
            user_name: user,
            metadata: metadata || {}
        });
    },

    async getLogs(): Promise<any[]> {
        if (!isSupabaseConfigured || !supabase) {
            const logs = getLocalStorageJson('fallback_logs', []);
            return logs.map((l: any) => ({
                id: l.id,
                level: l.level,
                messageKey: l.message_key,
                user: l.user_name,
                timestamp: l.timestamp,
                aiFix: l.metadata?.aiFix || null
            }));
        }
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
        const { employee_id, session_id, result_date, expiry_date, theory_score, practical_score, driver_license_verified, is_auto_booked, employee, trainer_name, ...rest } = data;
        return {
            ...rest,
            sessionId: session_id,
            employee: this.mapEmployeeFromDb(employee),
            resultDate: result_date,
            expiryDate: expiry_date,
            theoryScore: theory_score,
            practicalScore: practical_score,
            driverLicenseVerified: driver_license_verified,
            isAutoBooked: is_auto_booked,
            trainerName: trainer_name
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
