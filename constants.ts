
import { TrainingSession, Employee, EmployeeRequirement, Booking, BookingStatus, Feedback, RacDef } from './types';

export const DEPARTMENTS = ['Mine Operations', 'Plant Maintenance', 'HSE', 'Logistics', 'Administration'];
export const ROLES = ['Operator', 'Technician', 'Engineer', 'Supervisor', 'General Helper', 'Driver', 'Mechanic', 'Electrician'];

// --- INTEGRATION SIMULATION DATA ---

export const RAW_HR_SOURCE = [
    { id: '8901', name: 'Jessica Bata', dept: 'HSE', role: 'Safety Officer', email: 'jessica@vulcan.com' },
    { id: '8902', name: 'Kelven Ubisse', dept: 'Mine Operations', role: 'Mining Engineer', email: 'kelven@vulcan.com' },
    { id: '8903', name: 'Latifa Uetela', dept: 'Administration', role: 'HR Specialist', email: 'latifa@vulcan.com' }
];

export const RAW_CONTRACTOR_SOURCE = [
    { id: '9001', name: 'Manuel Xadreque', company: 'Jachris', dept: 'Administration', role: 'Catering Supervisor' },
    { id: '9002', name: 'Nuno Zaqueu', company: 'Jachris', dept: 'Logistics', role: 'General Helper' },
    { id: '9003', name: 'Orlando Yacub', company: 'Mota-Engil', dept: 'Mine Operations', role: 'Excavator Operator' },
    { id: '9004', name: 'Paulo Vombe', company: 'Mota-Engil', dept: 'Mine Operations', role: 'Civil Technician' },
    { id: '9005', name: 'Quim Wate', company: 'Belabel', dept: 'Logistics', role: 'Driver' },
    { id: '9006', name: 'Rui Vilanculos', company: 'Belabel', dept: 'Logistics', role: 'Driver' },
    { id: '9007', name: 'Sara Tamele', company: 'Belabel', dept: 'Logistics', role: 'Driver' },
    { id: '9008', name: 'Telma Sambo', company: 'Escopil', dept: 'Plant Maintenance', role: 'Mechanic' },
    { id: '9009', name: 'Ursio Raposo', company: 'Escopil', dept: 'Plant Maintenance', role: 'Electrician' }
];

export const OPS_KEYS = [
    'EMI_PTS',          
    'APR_ART',          
    'DONO_AREA_PTS',    
    'EXEC'             
];

export const PERMISSION_KEYS = ['EMI_PTS', 'APR_ART', 'DONO_AREA_PTS', 'EXEC'];

// Exporting RAC_KEYS for components that still rely on hardcoded keys for logic
export const RAC_KEYS = ['RAC01', 'RAC02', 'RAC03', 'RAC04', 'RAC05', 'RAC06', 'RAC07', 'RAC08', 'RAC09', 'RAC10', 'PTS', 'ART'];

// Exporting INITIAL_RAC_DEFINITIONS as a fallback for components requiring local defaults
export const INITIAL_RAC_DEFINITIONS: RacDef[] = [
    { id: 'rac1', code: 'RAC01', name: 'RAC 01 - Working at Height', validityMonths: 24, requiresPractical: true },
    { id: 'rac2', code: 'RAC02', name: 'RAC 02 - Vehicles and Mobile Equipment', validityMonths: 24, requiresDriverLicense: true, requiresPractical: true },
    { id: 'rac3', code: 'RAC03', name: 'RAC 03 - Energy Isolation (LOTO)', validityMonths: 24, requiresPractical: true },
    { id: 'rac4', code: 'RAC04', name: 'RAC 04 - Machine Guarding', validityMonths: 24, requiresPractical: true },
    { id: 'rac5', code: 'RAC05', name: 'RAC 05 - Confined Spaces', validityMonths: 24, requiresPractical: true },
    { id: 'rac6', code: 'RAC06', name: 'RAC 06 - Lifting Operations', validityMonths: 24, requiresPractical: true },
    { id: 'rac7', code: 'RAC07', name: 'RAC 07 - Slope Stabilization', validityMonths: 24, requiresPractical: true },
    { id: 'rac8', code: 'RAC08', name: 'RAC 08 - Electrical Safety', validityMonths: 24, requiresPractical: true },
    { id: 'rac9', code: 'RAC09', name: 'RAC 09 - Explosives Control', validityMonths: 24, requiresPractical: true },
    { id: 'rac10', code: 'RAC10', name: 'RAC 10 - Molten Metal Safety', validityMonths: 24, requiresPractical: true },
    { id: 'pts', code: 'PTS', name: 'PTS - Work Permit Issuer', validityMonths: 24, requiresPractical: true },
    { id: 'art', code: 'ART', name: 'ART - Risk Assessment', validityMonths: 24, requiresPractical: true }
];

const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const getPastDate = (daysToSubtract: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysToSubtract);
  return date.toISOString().split('T')[0];
};

export const MOCK_SESSIONS: TrainingSession[] = [
  { id: 'S001', racType: 'RAC 01 - Working at Height', date: '2023-11-15', startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20, sessionLanguage: 'English' },
  { id: 'S002', racType: 'RAC 02 - Vehicles and Mobile Equipment', date: '2023-11-20', startTime: '09:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S003', racType: 'RAC 05 - Confined Space', date: '2023-12-01', startTime: '13:00', location: 'Room C', instructor: 'Mike Brown', capacity: 10, sessionLanguage: 'Portuguese' }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Paulo Manjate', recordId: 'VUL-1001', company: 'Vulcan', department: 'Mine Operations', role: 'Operator', isActive: true, driverLicenseNumber: 'DL-12345', driverLicenseClass: 'Heavy', driverLicenseExpiry: '2025-12-31', siteId: 's1' },
  { id: 'emp2', name: 'Maria Silva', recordId: 'VUL-1002', company: 'Vulcan', department: 'HSE', role: 'Safety Officer', isActive: true, siteId: 's1' }
];

export const MOCK_REQUIREMENTS: EmployeeRequirement[] = [
  { employeeId: 'emp1', asoExpiryDate: getFutureDate(180), requiredRacs: { 'RAC01': true, 'RAC02': true, 'RAC03': true, 'RAC11': true } },
  { employeeId: 'emp2', asoExpiryDate: getFutureDate(200), requiredRacs: { 'RAC01': true, 'RAC05': true, 'PTS': true, 'ART': true } }
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', sessionId: 'S001', employee: MOCK_EMPLOYEES[0], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 85, practicalScore: 90 },
  { id: 'b2', sessionId: 'S002', employee: MOCK_EMPLOYEES[0], status: BookingStatus.PASSED, resultDate: '2023-11-20', expiryDate: getFutureDate(605), attendance: true, theoryScore: 88, practicalScore: 92, driverLicenseVerified: true }
];

export const MOCK_FEEDBACK: Feedback[] = [
    { id: '1', userId: 'user1', userName: 'Paulo Manjate', type: 'Bug', message: 'Unable to select RAC02 on mobile view.', status: 'New', isActionable: true, timestamp: getPastDate(1) + 'T10:00:00' }
];
