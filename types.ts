
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

export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',
  RAC_ADMIN = 'RAC Admin',
  RAC_TRAINER = 'RAC Trainer',
  DEPT_ADMIN = 'Departmental Admin',
  USER = 'User'
}

export interface Employee {
  id: string;
  name: string;
  recordId: string; // National ID or Company/Contractor ID
  company: string;
  department: string;
  role: string;
  ga: string; // Gerencia de Area (Area Management)
}

export interface TrainingSession {
  id: string;
  racType: RAC;
  date: string;
  startTime: string;
  location: string;
  instructor: string;
  capacity: number;
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
  practicalScore?: number; // Only for RAC 02 typically
}

export interface ChartData {
  name: string;
  value: number;
}

// New Interface for Database Page Logic
export interface EmployeeRequirement {
  employeeId: string;
  asoExpiryDate: string; // Medical Exam Expiry
  requiredRacs: Record<string, boolean>; // e.g. { 'RAC01': true, 'RAC02': false }
}
