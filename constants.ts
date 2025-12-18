
import { RAC, RacDef, TrainingSession, Employee, EmployeeRequirement, Booking, BookingStatus, Feedback } from './types';
import { v4 as uuidv4 } from 'uuid';

export const COMPANIES = [
    'CARS Solutions', 
    'Global Logistics', 
    'Safety First Contractors', 
    'Jachris', 
    'Mota-Engil', 
    'Belabel', 
    'Escopil'
];

export const DEPARTMENTS = ['Mine Operations', 'Plant Maintenance', 'HSE', 'Logistics', 'Administration'];
export const ROLES = ['Operator', 'Technician', 'Engineer', 'Supervisor', 'General Helper', 'Driver', 'Mechanic', 'Electrician'];

// --- INTEGRATION SIMULATION DATA ---

// Source A: Internal HR System (SAP)
export const RAW_HR_SOURCE = [
    { id: '8901', name: 'Jessica Bata', dept: 'HSE', role: 'Safety Officer', email: 'jessica@cars-solutions.com' },
    { id: '8902', name: 'Kelven Ubisse', dept: 'Mine Operations', role: 'Mining Engineer', email: 'kelven@cars-solutions.com' },
    { id: '8903', name: 'Latifa Uetela', dept: 'Administration', role: 'HR Specialist', email: 'latifa@cars-solutions.com' }
];

// Source B: Contractor System (Célula)
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

export const RAC_LIST = Object.values(RAC);

export const RAC_KEYS = [
  'RAC01', 'RAC02', 'RAC03', 'RAC04', 'RAC05', 
  'RAC06', 'RAC07', 'RAC08', 'RAC09', 'RAC10', 'RAC11',
  'PTS', 'ART', 'LIB_OPS', 'LIB_MOV'
];

export const OPS_KEYS = [
    'EMI_PTS',          
    'APR_ART',          
    'DONO_AREA_PTS',    
    'EXEC'             
];

export const PERMISSION_KEYS = ['EMI_PTS', 'APR_ART', 'DONO_AREA_PTS', 'EXEC'];

export const INITIAL_RAC_DEFINITIONS: RacDef[] = [
    { id: '0', code: 'RAC01', name: 'RAC 01 - Working at Height', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '1', code: 'RAC02', name: 'RAC 02 - Vehicles and Mobile Equipment', validityMonths: 24, requiresDriverLicense: true, requiresPractical: true },
    { id: '2', code: 'RAC03', name: 'RAC 03 - Mobile Equipment Lockout', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '3', code: 'RAC04', name: 'RAC 04 - Machine Guarding', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '4', code: 'RAC05', name: 'RAC 05 - Confined Space', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '5', code: 'RAC06', name: 'RAC 06 - Lifting Operations', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '6', code: 'RAC07', name: 'RAC 07 - Ground Stability', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '7', code: 'RAC08', name: 'RAC 08 - Electricity', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '8', code: 'RAC09', name: 'RAC 09 - Explosives', validityMonths: 12, requiresPractical: true, requiresDriverLicense: false },
    { id: '9', code: 'RAC10', name: 'RAC 10 - Liquid Metal', validityMonths: 24, requiresPractical: true, requiresDriverLicense: false },
    { id: '10', code: 'RAC11', name: 'RAC 11 - Mine Traffic & Traffic Rules', validityMonths: 24, requiresPractical: false, requiresDriverLicense: true },
    { id: '11', code: 'PTS', name: 'PTS - Permissão de Trabalho Seguro', validityMonths: 12, requiresPractical: false, requiresDriverLicense: false },
    { id: '12', code: 'ART', name: 'ART - Análise de Risco da Tarefa', validityMonths: 12, requiresPractical: false, requiresDriverLicense: false },
    { id: '13', code: 'LIB_OPS', name: 'LIB-OPS - Liberação Operacional', validityMonths: 12, requiresPractical: false, requiresDriverLicense: false },
    { id: '14', code: 'LIB_MOV', name: 'LIB-MOV - Liberação de Movimentação', validityMonths: 12, requiresPractical: false, requiresDriverLicense: false }
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
  { id: 'S001', racType: 'RAC01 - Working at Height', date: '2023-11-15', startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20, sessionLanguage: 'English' },
  { id: 'S002', racType: 'RAC02 - Vehicles and Mobile Equipment', date: '2023-11-20', startTime: '09:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S003', racType: 'RAC05 - Confined Space', date: '2023-12-01', startTime: '13:00', location: 'Room C', instructor: 'Mike Brown', capacity: 10, sessionLanguage: 'Portuguese' },
  { id: 'S004', racType: 'RAC08 - Electricity', date: getFutureDate(2), startTime: '08:30', location: 'Lab 2', instructor: 'Sarah Connor', capacity: 12, sessionLanguage: 'English' },
  { id: 'S005', racType: 'RAC02 - Vehicles and Mobile Equipment', date: getFutureDate(5), startTime: '08:00', location: 'Field A', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S006', racType: 'RAC01 - Working at Height', date: getFutureDate(10), startTime: '10:00', location: 'Room B', instructor: 'John Doe', capacity: 20, sessionLanguage: 'Portuguese' },
  { id: 'S007', racType: 'RAC10 - Liquid Metal', date: getFutureDate(12), startTime: '14:00', location: 'Room A', instructor: 'Mike Brown', capacity: 25, sessionLanguage: 'English' },
  { id: 'S013', racType: 'RAC11 - Mine Traffic', date: getFutureDate(14), startTime: '09:00', location: 'Simulator Room', instructor: 'Jane Smith', capacity: 10, sessionLanguage: 'Portuguese' },
  { id: 'S008', racType: 'RAC01 - Working at Height', date: getFutureDate(3), startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20, sessionLanguage: 'Portuguese' },
  { id: 'S009', racType: 'RAC05 - Confined Space', date: getFutureDate(4), startTime: '09:00', location: 'Room C', instructor: 'Mike Brown', capacity: 15, sessionLanguage: 'English' },
  { id: 'S010', racType: 'RAC02 - Vehicles and Mobile Equipment', date: getFutureDate(6), startTime: '08:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S011', racType: 'RAC08 - Electricity', date: getFutureDate(8), startTime: '13:00', location: 'Lab 1', instructor: 'Sarah Connor', capacity: 10, sessionLanguage: 'English' },
  { id: 'S012', racType: 'RAC02 - Vehicles and Mobile Equipment', date: getFutureDate(1), startTime: '14:00', location: 'Field Training Area', instructor: 'Jane Smith', capacity: 8, sessionLanguage: 'Portuguese' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Paulo Manjate', recordId: 'CARS-1001', company: 'CARS Solutions', department: 'Mine Operations', role: 'Operator', isActive: true, driverLicenseNumber: 'DL-12345', driverLicenseClass: 'Heavy', driverLicenseExpiry: '2025-12-31', siteId: 's1' },
  { id: 'emp2', name: 'Maria Silva', recordId: 'CARS-1002', company: 'CARS Solutions', department: 'HSE', role: 'Safety Officer', isActive: true, siteId: 's1' },
  { id: 'emp3', name: 'John Doe', recordId: 'CON-5001', company: 'Safety First Contractors', department: 'Plant Maintenance', role: 'Technician', isActive: true, siteId: 's1' },
  { id: 'emp4', name: 'Jose Cossa', recordId: 'CARS-1003', company: 'CARS Solutions', department: 'Logistics', role: 'Driver', isActive: true, driverLicenseNumber: 'DL-98765', driverLicenseClass: 'Light', driverLicenseExpiry: '2023-01-01', siteId: 's1' },
  { id: 'emp5', name: 'Sarah Connor', recordId: 'CARS-1004', company: 'CARS Solutions', department: 'Administration', role: 'Manager', isActive: true, siteId: 's1' },
  { id: 'emp6', name: 'Antonio Sitoe', recordId: 'CARS-1005', company: 'CARS Solutions', department: 'Mine Operations', role: 'General Helper', isActive: true, siteId: 's1' },
  { id: 'emp7', name: 'Luis Tete', recordId: 'CON-5002', company: 'Global Logistics', department: 'Logistics', role: 'Driver', isActive: true, driverLicenseNumber: 'DL-55555', driverLicenseClass: 'Heavy', driverLicenseExpiry: '2026-06-30', siteId: 's1' },
  { id: 'emp8', name: 'Ana Monjane', recordId: 'CARS-1006', company: 'CARS Solutions', department: 'HSE', role: 'HSE Manager', isActive: true, siteId: 's1' },
  { id: 'emp9', name: 'Carlos Macuacua', recordId: 'CARS-1007', company: 'CARS Solutions', department: 'Plant Maintenance', role: 'Engineer', isActive: false, siteId: 's1' },
  { id: 'emp10', name: 'Berta Langa', recordId: 'CON-5003', company: 'Safety First Contractors', department: 'Mine Operations', role: 'Technician', isActive: true, siteId: 's1' },
  { id: 'emp11', name: 'Joao Mutemba', recordId: 'CARS-1008', company: 'CARS Solutions', department: 'Mine Operations', role: 'Operator', isActive: true, siteId: 's1' },
  { id: 'emp12', name: 'Fernando Junior', recordId: 'CON-5004', company: 'Global Logistics', department: 'Logistics', role: 'Driver', isActive: true, driverLicenseNumber: 'DL-44332', driverLicenseClass: 'Light', driverLicenseExpiry: '2026-01-01', siteId: 's1' },
  { id: 'emp13', name: 'Sofia Muianga', recordId: 'CARS-1009', company: 'CARS Solutions', department: 'Administration', role: 'Clerk', isActive: true, siteId: 's1' }
];

export const MOCK_REQUIREMENTS: EmployeeRequirement[] = [
  { employeeId: 'emp1', asoExpiryDate: getFutureDate(180), requiredRacs: { 'RAC01': true, 'RAC02': true, 'RAC03': true, 'RAC11': true } },
  { employeeId: 'emp2', asoExpiryDate: getFutureDate(200), requiredRacs: { 'RAC01': true, 'RAC05': true, 'PTS': true, 'ART': true } },
  { employeeId: 'emp3', asoExpiryDate: getFutureDate(120), requiredRacs: { 'RAC04': true, 'RAC08': true, 'RAC01': true } },
  { employeeId: 'emp4', asoExpiryDate: getFutureDate(300), requiredRacs: { 'RAC02': true, 'RAC11': true, 'LIB_MOV': true } },
  { employeeId: 'emp5', asoExpiryDate: getPastDate(10), requiredRacs: { 'RAC01': true } },
  { employeeId: 'emp6', asoExpiryDate: getFutureDate(365), requiredRacs: { 'RAC01': true, 'RAC03': true } },
  { employeeId: 'emp7', asoExpiryDate: getFutureDate(150), requiredRacs: { 'RAC02': true, 'RAC11': true } },
  { employeeId: 'emp8', asoExpiryDate: getFutureDate(400), requiredRacs: { 'RAC01': true, 'RAC05': true, 'EMI_PTS': true } },
  { employeeId: 'emp9', asoExpiryDate: getFutureDate(100), requiredRacs: { 'RAC01': true } },
  { employeeId: 'emp10', asoExpiryDate: getFutureDate(5), requiredRacs: { 'RAC01': true, 'RAC03': true } },
  { employeeId: 'emp11', asoExpiryDate: getFutureDate(200), requiredRacs: { 'RAC01': true, 'RAC02': true } },
  { employeeId: 'emp12', asoExpiryDate: getFutureDate(180), requiredRacs: { 'RAC02': true, 'RAC11': true } },
  { employeeId: 'emp13', asoExpiryDate: getFutureDate(300), requiredRacs: { 'RAC01': false } } 
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', sessionId: 'S001', employee: MOCK_EMPLOYEES[0], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 85, practicalScore: 90 },
  { id: 'b2', sessionId: 'S002', employee: MOCK_EMPLOYEES[0], status: BookingStatus.PASSED, resultDate: '2023-11-20', expiryDate: getFutureDate(605), attendance: true, theoryScore: 88, practicalScore: 92, driverLicenseVerified: true },
  { id: 'b10', sessionId: 'S013', employee: MOCK_EMPLOYEES[0], status: BookingStatus.PASSED, resultDate: '2023-11-21', expiryDate: getFutureDate(606), attendance: true, theoryScore: 90 },
  { id: 'b3', sessionId: 'S001', employee: MOCK_EMPLOYEES[1], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 95 },
  { id: 'b11', sessionId: 'S003', employee: MOCK_EMPLOYEES[1], status: BookingStatus.PASSED, resultDate: '2023-12-01', expiryDate: getFutureDate(630), attendance: true, theoryScore: 92 },
  { id: 'b4', sessionId: 'S004', employee: MOCK_EMPLOYEES[2], status: BookingStatus.PENDING, attendance: false }, 
  { id: 'b12', sessionId: 'S001', employee: MOCK_EMPLOYEES[2], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 80 },
  { id: 'b5', sessionId: 'S002', employee: MOCK_EMPLOYEES[3], status: BookingStatus.PASSED, resultDate: '2023-05-01', expiryDate: getFutureDate(200), attendance: true, theoryScore: 75, driverLicenseVerified: true },
  { id: 'b6', sessionId: 'S001', employee: MOCK_EMPLOYEES[4], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 88 },
  { id: 'b7', sessionId: 'S001', employee: MOCK_EMPLOYEES[5], status: BookingStatus.PASSED, resultDate: '2022-01-01', expiryDate: getFutureDate(25), attendance: true, theoryScore: 78 },
  { id: 'b8', sessionId: 'S005', employee: MOCK_EMPLOYEES[6], status: BookingStatus.PENDING, attendance: false, isAutoBooked: true },
  { id: 'b9', sessionId: 'S002', employee: MOCK_EMPLOYEES[6], status: BookingStatus.PASSED, resultDate: '2021-01-01', expiryDate: getPastDate(5), attendance: true, theoryScore: 82, driverLicenseVerified: true },
  { id: 'b13', sessionId: 'S001', employee: MOCK_EMPLOYEES[9], status: BookingStatus.PASSED, resultDate: '2023-11-15', expiryDate: getFutureDate(600), attendance: true, theoryScore: 85 },
  { id: 'b14', sessionId: 'S002', employee: MOCK_EMPLOYEES[10], status: BookingStatus.PASSED, resultDate: '2023-11-20', expiryDate: getFutureDate(500), attendance: true, theoryScore: 90, practicalScore: 85, driverLicenseVerified: true },
  { id: 'b15', sessionId: 'S013', employee: MOCK_EMPLOYEES[11], status: BookingStatus.PASSED, resultDate: '2023-11-21', expiryDate: getFutureDate(600), attendance: true, theoryScore: 88 }
];

export const MOCK_FEEDBACK: Feedback[] = [
    { id: '1', userId: 'user1', userName: 'Paulo Manjate', type: 'Bug', message: 'Unable to select RAC02 on mobile view.', status: 'New', isActionable: true, timestamp: getPastDate(1) + 'T10:00:00' },
    { id: '2', userId: 'user2', userName: 'Maria Silva', type: 'Improvement', message: 'Add a dark mode toggle to the dashboard.', status: 'Resolved', isActionable: false, timestamp: getPastDate(3) + 'T14:30:00' },
    { id: '3', userId: 'user3', userName: 'John Doe', type: 'General', message: 'Great new layout!', status: 'Dismissed', isActionable: false, timestamp: getPastDate(5) + 'T09:15:00' },
    { id: '4', userId: 'user4', userName: 'Luis Tete', type: 'Bug', message: 'PDF export fails when filtering by department.', status: 'In Progress', isActionable: true, timestamp: getPastDate(2) + 'T16:45:00' },
];
