
import { RAC } from './types';

export const COMPANIES = ['Vulcan Mining', 'Global Logistics', 'Safety First Contractors'];
export const DEPARTMENTS = ['Mine Operations', 'Plant Maintenance', 'HSE', 'Logistics', 'Administration'];
export const ROLES = ['Operator', 'Technician', 'Engineer', 'Supervisor', 'General Helper'];

export const RAC_LIST = Object.values(RAC);

// Helper to iterate RAC keys programmatically
export const RAC_KEYS = [
  'RAC01', 'RAC02', 'RAC03', 'RAC04', 'RAC05', 
  'RAC06', 'RAC07', 'RAC08', 'RAC09', 'RAC10'
];

// Calculate generic future dates for demo purposes
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

// Mock Initial Data
export const MOCK_SESSIONS = [
  // Past sessions
  { id: 'S001', racType: RAC.RAC01, date: '2023-11-15', startTime: '08:00', location: 'Room A', instructor: 'John Doe', capacity: 20 },
  { id: 'S002', racType: RAC.RAC02, date: '2023-11-20', startTime: '09:00', location: 'Field B', instructor: 'Jane Smith', capacity: 15 },
  { id: 'S003', racType: RAC.RAC05, date: '2023-12-01', startTime: '13:00', location: 'Room C', instructor: 'Mike Brown', capacity: 10 },
  
  // Future sessions for Dashboard "Upcoming" view
  { id: 'S004', racType: RAC.RAC08, date: getFutureDate(2), startTime: '08:30', location: 'Lab 2', instructor: 'Sarah Connor', capacity: 12 },
  { id: 'S005', racType: RAC.RAC02, date: getFutureDate(5), startTime: '08:00', location: 'Field A', instructor: 'Jane Smith', capacity: 15 },
  { id: 'S006', racType: RAC.RAC01, date: getFutureDate(10), startTime: '10:00', location: 'Room B', instructor: 'John Doe', capacity: 20 },
  { id: 'S007', racType: RAC.RAC10, date: getFutureDate(12), startTime: '14:00', location: 'Room A', instructor: 'Mike Brown', capacity: 25 },
];
