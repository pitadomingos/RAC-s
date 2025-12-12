
import { RAC, RacDef, TrainingSession } from './types';

export const COMPANIES = ['Vulcan Mining', 'Global Logistics', 'Safety First Contractors'];
export const DEPARTMENTS = ['Mine Operations', 'Plant Maintenance', 'HSE', 'Logistics', 'Administration'];
export const ROLES = ['Operator', 'Technician', 'Engineer', 'Supervisor', 'General Helper'];

export const RAC_LIST = Object.values(RAC);

// Helper to iterate RAC keys programmatically
// Now includes PTS, ART, and LIBs so they appear in the RAC Matrix and Settings
export const RAC_KEYS = [
  'RAC01', 'RAC02', 'RAC03', 'RAC04', 'RAC05', 
  'RAC06', 'RAC07', 'RAC08', 'RAC09', 'RAC10',
  'PTS', 'ART', 'LIB_OPS', 'LIB_MOV'
];

// Operational Keys for Appointed Roles (Boolean/Permission based)
export const OPS_KEYS = [
    'EMI_PTS',          
    'APR_ART',          
    'DONO_AREA_PTS',    
    'EXEC'             
];

// Keys that are boolean permissions (Manager Designated) -> Display "-SIM-"
// Keys NOT in this list are treated as Trainings (require a valid date in DB)
export const PERMISSION_KEYS = ['EMI_PTS', 'APR_ART', 'DONO_AREA_PTS', 'EXEC'];

// Explicitly define RACs + The new Operational Trainings
export const INITIAL_RAC_DEFINITIONS: RacDef[] = [
    { id: '0', code: 'RAC01', name: 'RAC 01 - Working at Height' },
    { id: '1', code: 'RAC02', name: 'RAC 02 - Vehicles and Mobile Equipment' },
    { id: '2', code: 'RAC03', name: 'RAC 03 - Mobile Equipment Lockout' },
    { id: '3', code: 'RAC04', name: 'RAC 04 - Machine Guarding' },
    { id: '4', code: 'RAC05', name: 'RAC 05 - Confined Space' },
    { id: '5', code: 'RAC06', name: 'RAC 06 - Lifting Operations' },
    { id: '6', code: 'RAC07', name: 'RAC 07 - Ground Stability' },
    { id: '7', code: 'RAC08', name: 'RAC 08 - Electricity' },
    { id: '8', code: 'RAC09', name: 'RAC 09 - Explosives' },
    { id: '9', code: 'RAC10', name: 'RAC 10 - Liquid Metal' },
    { id: '10', code: 'PTS', name: 'PTS - Permissão de Trabalho Seguro' },
    { id: '11', code: 'ART', name: 'ART - Análise de Risco da Tarefa' },
    { id: '12', code: 'LIB_OPS', name: 'LIB-OPS - Liberação Operacional' },
    { id: '13', code: 'LIB_MOV', name: 'LIB-MOV - Liberação de Movimentação' }
];

// Calculate generic future dates for demo purposes
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

// Mock Initial Data
export const MOCK_SESSIONS: TrainingSession[] = [
  // Past sessions
  { id: 'S001', racType: 'RAC01 - Working at Height', date: '2023-11-15', startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20, sessionLanguage: 'English' },
  { id: 'S002', racType: 'RAC02 - Vehicles', date: '2023-11-20', startTime: '09:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S003', racType: 'RAC05 - Confined Space', date: '2023-12-01', startTime: '13:00', location: 'Room C', instructor: 'Mike Brown', capacity: 10, sessionLanguage: 'Portuguese' },
  
  // Future sessions for Dashboard "Upcoming" view
  { id: 'S004', racType: 'RAC08 - Electricity', date: getFutureDate(2), startTime: '08:30', location: 'Lab 2', instructor: 'Sarah Connor', capacity: 12, sessionLanguage: 'English' },
  { id: 'S005', racType: 'RAC02 - Vehicles', date: getFutureDate(5), startTime: '08:00', location: 'Field A', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S006', racType: 'RAC01 - Working at Height', date: getFutureDate(10), startTime: '10:00', location: 'Room B', instructor: 'John Doe', capacity: 20, sessionLanguage: 'Portuguese' },
  { id: 'S007', racType: 'RAC10 - Liquid Metal', date: getFutureDate(12), startTime: '14:00', location: 'Room A', instructor: 'Mike Brown', capacity: 25, sessionLanguage: 'English' },
  
  // Extra sessions to ensure Auto-Booking always finds a slot for demo purposes
  { id: 'S008', racType: 'RAC01 - Working at Height', date: getFutureDate(3), startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20, sessionLanguage: 'Portuguese' },
  { id: 'S009', racType: 'RAC05 - Confined Space', date: getFutureDate(4), startTime: '09:00', location: 'Room C', instructor: 'Mike Brown', capacity: 15, sessionLanguage: 'English' },
  { id: 'S010', racType: 'RAC02 - Vehicles', date: getFutureDate(6), startTime: '08:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15, sessionLanguage: 'Portuguese' },
  { id: 'S011', racType: 'RAC08 - Electricity', date: getFutureDate(8), startTime: '13:00', location: 'Lab 1', instructor: 'Sarah Connor', capacity: 10, sessionLanguage: 'English' },
  
  // NEW: RAC02 Session for DL Verification Simulation
  { id: 'S012', racType: 'RAC02 - Vehicles', date: getFutureDate(1), startTime: '14:00', location: 'Field Training Area', instructor: 'Jane Smith', capacity: 8, sessionLanguage: 'Portuguese' },
];
