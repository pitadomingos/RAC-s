export interface RacDef {
  id: string;
  companyId?: string;
  code: string;
  name: string;
  validityMonths?: number;
  requiresDriverLicense?: boolean;
  requiresPractical?: boolean;
  passScore?: number;
}

export interface Company {
  id: string;
  name: string;
  appName?: string;
  logoUrl?: string;
  safetyLogoUrl?: string;
  status: 'Active' | 'Inactive';
  defaultLanguage?: 'en' | 'pt';
  parentId?: string; // Reference to Main Contractor
  tier?: 'Prime' | 'Sub'; 
  features?: {
      alcohol?: boolean;
  };
}

export interface Site {
  id: string;
  companyId: string;
  name: string;
  location: string;
  mandatoryRacs?: string[]; 
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  siteId?: string;
}

export interface Trainer {
  id: string;
  name: string;
  racs: string[];
  siteId?: string;
}

export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',
  ENTERPRISE_ADMIN = 'Enterprise Admin',
  SITE_ADMIN = 'Site Admin',
  RAC_ADMIN = 'RAC Admin',
  DEPT_ADMIN = 'Department Admin',
  RAC_TRAINER = 'RAC Trainer',
  USER = 'User'
}

export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: UserRole;
    status: 'Active' | 'Inactive';
    company?: string;
    jobTitle?: string;
    department?: string;
    siteId?: string;
}

export interface Employee {
  id: string;
  name: string;
  recordId: string;
  company: string;
  department: string;
  role: string;
  isActive?: boolean;
  siteId?: string;
  phoneNumber?: string;
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
  siteId?: string;
}

export enum BookingStatus {
  PENDING = 'Pending',
  ATTENDED = 'Attended',
  PASSED = 'Passed',
  FAILED = 'Failed',
  EXPIRED = 'Expired',
  ABSENT = 'Absent',
  WAITLISTED = 'Waitlisted'
}

export interface Booking {
  id: string;
  sessionId: string;
  employee: Employee;
  status: BookingStatus;
  resultDate?: string;
  expiryDate?: string;
  attendance?: boolean;
  theoryScore?: number;
  practicalScore?: number;
  driverLicenseVerified?: boolean;
  isAutoBooked?: boolean;
  comments?: string;
  trainerName?: string;
}

export interface EmployeeRequirement {
  employeeId: string;
  asoExpiryDate: string;
  requiredRacs: Record<string, boolean>;
}

export interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface BreathalyzerTest {
  id: string;
  deviceId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  timestamp: string;
  result: number;
  status: 'PASS' | 'FAIL';
  imageUrl?: string;
}

export interface IotDevice {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  lastPing: string;
}

export type FeedbackType = 'Bug' | 'Improvement' | 'General';
export type FeedbackStatus = 'New' | 'In Progress' | 'Resolved' | 'Dismissed';

export interface Feedback {
  id: string;
  userId?: string;
  userName: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  isActionable: boolean;
  timestamp: string;
  adminNotes?: string;
}

export type ConnectorType = 'Excel' | 'Database' | 'API' | 'Webhook' | 'Consumer';

export interface DataConnector {
  id: string;
  name: string;
  type: ConnectorType;
  lastSync?: string;
  status: 'Healthy' | 'Error' | 'Idle' | 'Authorized';
  color: string;
  source: string;
  config: {
    baseUrl?: string;
    apiKey?: string;
    authHeader?: string;
    syncFrequency?: 'Hourly' | 'Daily' | 'Weekly';
  };
  mapping: Record<string, string>; 
  moduleMapping?: Record<string, string>;
}

export interface AppGateway {
    id: string;
    name: string;
    type: string;
    lastActive: string;
    status: 'Authorized' | 'Revoked' | 'Pending';
    key: string;
    description: string;
}

export interface SyncResult {
  id: string;
  connectorId: string;
  timestamp: string;
  added: number;
  updated: number;
  errors: number;
  status: 'Success' | 'Partial' | 'Failed';
  log: string[];
}

export enum RecruitmentStatus {
  AM_REQUESTED = 'AM Requested',
  HR_PENDING = 'HR Pending',
  SECURITY_PENDING = 'Security Pending',
  CLINIC_PENDING = 'Clinic Pending',
  INDUCTION_PENDING = 'Induction Pending',
  TRAINING_PENDING = 'Training Pending',
  COMPLETED = 'Completed',
  RECEIVED = 'Received'
}

export interface RecruitDocument {
  name: string;
  type: 'ID' | 'Passport' | 'Work Permit';
  uploadedAt: string;
  fileSize: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

export interface MedicalExam {
  bloodPressure: string;
  heartRate: number;
  visionTest: 'Pass' | 'Fail';
  drugScreen: 'Negative' | 'Positive';
  fitForWork: boolean;
  checkedAt?: string;
  comments?: string;
}

export interface RecruitmentProcess {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  company: string;
  department: string;
  role: string;
  requiredRacs: string[];
  status: RecruitmentStatus;
  requestedBy: string;
  requestedAt: string;
  documents: RecruitDocument[];
  temporaryBadgeNumber?: string;
  medicalExam?: MedicalExam;
  inductionDate?: string;
  inductionConfirmed?: boolean;
  trainingCompletedAt?: string;
  receivedAt?: string;
  nudgeCount?: number;
  lastNudgeAt?: string;
  employeeId?: string;
  recordId?: string;
}