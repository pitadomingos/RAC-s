
export enum RAC {
  RAC01 = 'RAC 01 - Working at Height',
  RAC02 = 'RAC 02 - Vehicles and Mobile Equipment',
  RAC03 = 'RAC 03 - Mobile Equipment Lockout',
  RAC04 = 'RAC 04 - Machine Guarding',
  RAC05 = 'RAC 05 - Confined Space',
  RAC06 = 'RAC 06 - Lifting Operations',
  RAC07 = 'RAC 07 - Ground Stability',
  RAC08 = 'RAC 08 - Electricity',
  RAC09 = 'RAC 09 - Explosives',
  RAC10 = 'RAC 10 - Liquid Metal'
}

export interface RacDef {
  id: string;
  code: string;
  name: string;
  validityMonths?: number; // Configurable validity period
  requiresDriverLicense?: boolean;
  requiresPractical?: boolean;
}

export interface Company {
  id: string;
  name: string;
  appName?: string; // Overrides system name (e.g. "Vulcan Safety")
  logoUrl?: string; // Corporate Brand Logo
  safetyLogoUrl?: string; // Specific Safety Logo
  status: 'Active' | 'Inactive';
  defaultLanguage?: 'en' | 'pt';
  features?: {
      alcohol?: boolean;
      // Add other modules here in future
  };
}

export interface Site {
  id: string;
  companyId: string;
  name: string;
  location: string;
  // New: Defines which RACs are mandatory for *everyone* at this site by default
  mandatoryRacs?: string[]; 
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  siteId?: string; // Room belongs to a site
}

export interface Trainer {
  id: string;
  name: string;
  racs: string[];
}

export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',       // SaaS Owner (Manages Companies)
  ENTERPRISE_ADMIN = 'Enterprise Admin', // Client HQ (Manages Sites & Global Standards)
  SITE_ADMIN = 'Site Admin',           // Site Manager (Manages daily ops)
  RAC_ADMIN = 'RAC Admin',
  DEPT_ADMIN = 'Department Admin',
  RAC_TRAINER = 'RAC Trainer',
  USER = 'User'
}

export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string; // New field for SMS
    role: UserRole;
    status: 'Active' | 'Inactive';
    company?: string;
    jobTitle?: string;
    department?: string; // Added for Access Control
    siteId?: string; // New: Context for User Login to filter data
}

export interface Employee {
  id: string;
  name: string;
  recordId: string; // National ID or Company/Contractor ID
  company: string;
  department: string;
  role: string;
  isActive?: boolean;
  siteId?: string; // Multi-site support
  phoneNumber?: string; // New field for SMS alerts
  // Driver License Details (Specific for RAC 02)
  driverLicenseNumber?: string;
  driverLicenseClass?: string;
  driverLicenseExpiry?: string;
}

export interface TrainingSession {
  id: string;
  racType: string;
  date: string;
  startTime: string;
  location: string;
  instructor: string;
  capacity: number;
  sessionLanguage: 'English' | 'Portuguese';
  siteId?: string; // Session belongs to a site
}

export enum BookingStatus {
  PENDING = 'Pending',
  ATTENDED = 'Attended',
  PASSED = 'Passed',
  FAILED = 'Failed',
  EXPIRED = 'Expired'
}

export interface Booking {
  id: string;
  sessionId: string;
  employee: Employee;
  status: BookingStatus;
  resultDate?: string;
  expiryDate?: string; // Valid for 2 years
  attendance?: boolean;
  theoryScore?: number;
  practicalScore?: number;
  driverLicenseVerified?: boolean; // New field for Trainer validation
  isAutoBooked?: boolean;
  comments?: string; // New field for Trainer remarks
}

export interface ChartData {
  name: string;
  value: number;
}

export interface EmployeeRequirement {
  employeeId: string;
  asoExpiryDate: string; // Medical Exam Expiry
  requiredRacs: Record<string, boolean>; // e.g. { 'RAC01': true, 'RAC02': false }
}

export interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// --- NEW TYPES FOR ALCOHOL IOT ---
export interface BreathalyzerTest {
  id: string;
  deviceId: string;
  employeeId: string;
  employeeName: string;
  date: string; // Added Date field
  timestamp: string;
  result: number; // BAC level
  status: 'PASS' | 'FAIL';
  imageUrl?: string; // Face capture placeholder
}

export interface IotDevice {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  lastPing: string;
}

// --- NEW TYPES FOR FEEDBACK SYSTEM ---
export type FeedbackType = 'Bug' | 'Improvement' | 'General';
export type FeedbackStatus = 'New' | 'In Progress' | 'Resolved' | 'Dismissed';

export interface Feedback {
  id: string;
  userId?: string; // Optional if anonymous
  userName: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  isActionable: boolean;
  timestamp: string;
  adminNotes?: string;
}
