
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DatabasePage from './pages/DatabasePage';
import BookingForm from './pages/BookingForm';
import TrainerInputPage from './pages/TrainerInputPage';
import ResultsPage from './pages/ResultsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import RequestCardsPage from './pages/RequestCardsPage';
import CardsPage from './pages/CardsPage';
import UserManagement from './pages/UserManagement';
import ScheduleTraining from './pages/ScheduleTraining';
import VerificationPage from './pages/VerificationPage';
import UserManualsPage from './pages/UserManualsPage';
import AdminManualPage from './pages/AdminManualPage';
import LogsPage from './pages/LogsPage';
import ProjectProposal from './pages/ProjectProposal';
import PresentationPage from './pages/PresentationPage';
import AlcoholIntegration from './pages/AlcoholIntegration';
import SystemHealthPage from './pages/SystemHealthPage';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import SiteGovernancePage from './pages/SiteGovernancePage';
import TechnicalDocs from './pages/TechnicalDocs';
import { AdvisorProvider } from './contexts/AdvisorContext';
import GeminiAdvisor from './components/GeminiAdvisor';
import ToastContainer from './components/ToastContainer';
import { MOCK_SESSIONS, INITIAL_RAC_DEFINITIONS, COMPANIES, DEPARTMENTS } from './constants';
import { UserRole, Booking, EmployeeRequirement, TrainingSession, Site, Company, User, RacDef, Room, Trainer, SystemNotification, BookingStatus, Employee } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- ROBUST MOCK DATA GENERATOR ---
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};

const subDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result.toISOString().split('T')[0];
};

const generateInitialData = () => {
    const generatedBookings: Booking[] = [];
    const generatedRequirements: EmployeeRequirement[] = [];
    const today = new Date();

    // Create 60 Mock Employees
    for (let i = 1; i <= 60; i++) {
        const isVulcan = i <= 25; 
        // FIX: Use 'Vulcan' consistently to match Company ID 'c1' name
        const company = isVulcan ? 'Vulcan' : COMPANIES[i % COMPANIES.length];
        const dept = DEPARTMENTS[i % DEPARTMENTS.length];
        // Ensure consistent ID format. VUL-1001 is used for User Simulation.
        const recordId = isVulcan ? `VUL-${1000 + i}` : `CNT-${8000 + i}`;
        const name = isVulcan ? `Vulcan Staff ${i}` : `Contractor ${i}`;
        
        // 1. Define Requirements (The Matrix)
        const reqRacs: Record<string, boolean> = {
            'RAC01': true, // Everyone needs Height
            'RAC02': i % 3 === 0, // 33% need Vehicles
            'RAC05': i % 4 === 0, // 25% need Confined Space
            'RAC08': i % 10 === 0, // 10% need Electrical
            'PTS': i % 20 === 0,   // Key staff need PTS
        };

        // ASO Logic:
        // - ID 55-60: Expired ASO (Non-Compliant)
        // - Others: Valid ASO
        let asoDate = addDays(today, 120 + (i * 2));
        if (i > 55) asoDate = subDays(today, 15);

        generatedRequirements.push({
            employeeId: recordId, // Using recordId as ID for simple correlation
            asoExpiryDate: asoDate,
            requiredRacs: reqRacs
        });

        const employee: Employee = {
            id: recordId,
            name: name,
            recordId: recordId,
            company: company,
            department: dept,
            role: i % 3 === 0 ? 'Supervisor' : 'Operator',
            isActive: true,
            // DL logic for RAC02 requirements
            driverLicenseNumber: reqRacs['RAC02'] ? `DL-${10000+i}` : undefined,
            driverLicenseClass: reqRacs['RAC02'] ? (i % 2 === 0 ? 'C1' : 'CE') : undefined,
            driverLicenseExpiry: reqRacs['RAC02'] ? addDays(today, 300) : undefined
        };

        // 2. Generate Bookings (Training History)
        Object.keys(reqRacs).forEach(racKey => {
            if (!reqRacs[racKey]) return;

            // Scenario Logic:
            // - ID 45-55: Expiring Soon (Yellow on Dashboard)
            // - ID 35-40: Missing Training (Red on Dashboard)
            // - ID 1-34: Compliant (Green)
            
            if (i >= 35 && i <= 40 && racKey === 'RAC01') {
                return; // Simulate Missing Training
            }

            let resultDate = subDays(today, 100);
            let expiryDate = addDays(today, 630); // Valid for ~1.8 more years

            if (i >= 45 && i <= 55) {
                // Create Expiring Scenario (< 30 days left)
                expiryDate = addDays(today, 15);
                resultDate = subDays(today, 715);
            }

            generatedBookings.push({
                id: uuidv4(),
                sessionId: `${racKey} - General Session`,
                employee: employee,
                status: BookingStatus.PASSED,
                resultDate: resultDate,
                expiryDate: expiryDate,
                attendance: true,
                theoryScore: 80 + (i % 20),
                practicalScore: 85 + (i % 15),
                driverLicenseVerified: true
            });
        });
    }

    return { bookings: generatedBookings, requirements: generatedRequirements };
};

const mockData = generateInitialData();

const generateMockUsers = (): User[] => [
    { id: 1, name: 'System Admin', email: 'admin@system.com', role: UserRole.SYSTEM_ADMIN, status: 'Active', company: 'System', jobTitle: 'Administrator' },
    { id: 2, name: 'John Doe', email: 'john@vulcan.com', role: UserRole.RAC_ADMIN, status: 'Active', company: 'Vulcan', jobTitle: 'Safety Officer', siteId: 's1' },
    { id: 3, name: 'Site Manager', email: 'manager@vulcan.com', role: UserRole.SITE_ADMIN, status: 'Active', company: 'Vulcan', jobTitle: 'Site Lead', siteId: 's1' },
    { id: 4, name: 'Trainer Mike', email: 'mike@training.com', role: UserRole.RAC_TRAINER, status: 'Active', company: 'Vulcan', jobTitle: 'Senior Trainer' },
];
const generateMockSites = (): Site[] => [
    { id: 's1', companyId: 'c1', name: 'Moatize Mine', location: 'Tete', mandatoryRacs: ['RAC01', 'RAC02'] },
    { id: 's2', companyId: 'c1', name: 'Maputo HQ', location: 'Maputo', mandatoryRacs: ['RAC01'] },
    { id: 's3', companyId: 'c1', name: 'Nacala Port', location: 'Nacala', mandatoryRacs: ['RAC01', 'RAC05'] }
];
const generateMockCompanies = (): Company[] => [
    { id: 'c1', name: 'Vulcan', status: 'Active', appName: 'CARS Manager', subContractors: ['Global Logistics', 'Safety First Contractors', 'Elite Security'] },
    { id: 'c2', name: 'Acme Corp', status: 'Active', appName: 'SafetyOS', subContractors: ['Acme Build', 'Acme Transport'] }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  // Initialize State with Robust Mock Data
  const [bookings, setBookings] = useState<Booking[]>(mockData.bookings);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>(mockData.requirements);
  
  const [sessions, setSessions] = useState<TrainingSession[]>(MOCK_SESSIONS);
  const [sites, setSites] = useState<Site[]>(generateMockSites());
  const [companies, setCompanies] = useState<Company[]>(generateMockCompanies());
  const [users, setUsers] = useState<User[]>(generateMockUsers());
  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>(INITIAL_RAC_DEFINITIONS);
  const [rooms, setRooms] = useState<Room[]>([{ id: 'r1', name: 'Room A', capacity: 20 }, { id: 'r2', name: 'Field B', capacity: 15 }]);
  const [trainers, setTrainers] = useState<Trainer[]>([{ id: 't1', name: 'John Doe', racs: ['RAC01'] }, { id: 't2', name: 'Jane Smith', racs: ['RAC02'] }]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [currentSiteId, setCurrentSiteId] = useState<string>('all');

  // SIMULATE LOGGED IN USER CONTEXT
  // When 'User' role is selected, we pretend to be "VUL-1001" (A fully compliant mock employee)
  const currentEmployeeId = userRole === UserRole.USER ? 'VUL-1001' : undefined;

  const addNotification = (n: SystemNotification) => {
      setNotifications(prev => [n, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  const currentContractors = useMemo(() => {
      return COMPANIES;
  }, []);

  const addBookings = (newBookings: Booking[]) => {
      setBookings(prev => [...prev, ...newBookings]);
  };

  const updateRequirements = (req: EmployeeRequirement) => {
      setRequirements(prev => {
          const exists = prev.find(r => r.employeeId === req.employeeId);
          if (exists) {
              return prev.map(r => r.employeeId === req.employeeId ? req : r);
          }
          return [...prev, req];
      });
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const onUpdateEmployee = (id: string, updates: Partial<Employee>) => {
      setBookings(prev => prev.map(b => b.employee.id === id ? { ...b, employee: { ...b.employee, ...updates } } : b));
  };

  const onDeleteEmployee = (id: string) => {
      setBookings(prev => prev.filter(b => b.employee.id !== id));
      setRequirements(prev => prev.filter(r => r.employeeId !== id));
  };

  const authorizedRoles = [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN, UserRole.RAC_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_TRAINER];

  return (
    <AdvisorProvider>
      <HashRouter>
        <ToastContainer />
        <Routes>
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="/proposal" element={<ProjectProposal />} />
          <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />

          <Route element={
            <Layout 
              userRole={userRole} 
              setUserRole={setUserRole} 
              notifications={notifications} 
              clearNotifications={clearNotifications}
              sites={sites}
              currentSiteId={currentSiteId}
              setCurrentSiteId={setCurrentSiteId}
              appName={companies[0]?.appName}
            />
          }>
            <Route path="/" element={<Dashboard bookings={bookings} requirements={requirements} sessions={sessions} userRole={userRole} racDefinitions={racDefinitions} contractors={currentContractors} />} />
            
            <Route path="/enterprise-dashboard" element={
                [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                ? <EnterpriseDashboard sites={sites} bookings={bookings} requirements={requirements} userRole={userRole} companies={companies} /> 
                : <Navigate to="/" replace />
            } />

            <Route path="/site-governance" element={
                [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                ? <SiteGovernancePage sites={sites} setSites={setSites} racDefinitions={racDefinitions} onUpdateRacs={setRacDefinitions} bookings={bookings} requirements={requirements} updateRequirements={updateRequirements} /> 
                : <Navigate to="/" replace />
            } />

            <Route path="/database" element={<DatabasePage bookings={bookings} requirements={requirements} updateRequirements={updateRequirements} sessions={sessions} onUpdateEmployee={onUpdateEmployee} onDeleteEmployee={onDeleteEmployee} racDefinitions={racDefinitions} contractors={currentContractors} />} />
            
            {/* PASS REQUIREMENTS & CURRENT ID TO BOOKING FOR USER VIEW */}
            <Route path="/booking" element={<BookingForm addBookings={addBookings} sessions={sessions} userRole={userRole} existingBookings={bookings} addNotification={addNotification} requirements={requirements} contractors={currentContractors} currentEmployeeId={currentEmployeeId} />} />
            
            <Route path="/trainer-input" element={<TrainerInputPage bookings={bookings} updateBookings={(updates) => {
                setBookings(prev => prev.map(b => {
                    const update = updates.find(u => u.id === b.id);
                    return update || b;
                }));
            }} sessions={sessions} userRole={userRole} />} />
            
            <Route path="/results" element={<ResultsPage bookings={bookings} updateBookingStatus={updateBookingStatus} userRole={userRole} sessions={sessions} racDefinitions={racDefinitions} currentEmployeeId={currentEmployeeId} />} />
            
            <Route path="/reports" element={<ReportsPage bookings={bookings} sessions={sessions} racDefinitions={racDefinitions} />} />
            
            <Route path="/settings" element={
                [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                ? <SettingsPage 
                    racDefinitions={racDefinitions} onUpdateRacs={setRacDefinitions}
                    rooms={rooms} onUpdateRooms={setRooms}
                    trainers={trainers} onUpdateTrainers={setTrainers}
                    sites={sites} onUpdateSites={setSites}
                    companies={companies} onUpdateCompanies={setCompanies}
                    users={users} onUpdateUsers={setUsers}
                    contractors={currentContractors}
                    userRole={userRole}
                    addNotification={addNotification}
                  /> 
                : <Navigate to="/" replace />
            } />
            
            {/* PASS REQUIREMENTS & CURRENT ID TO REQUEST CARDS */}
            <Route path="/request-cards" element={<RequestCardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={userRole} currentEmployeeId={currentEmployeeId} />} />
            
            <Route path="/print-cards" element={authorizedRoles.concat(UserRole.USER).includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN ? <CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={userRole} /> : <Navigate to="/" replace />} />
              
            <Route path="/users" element={
                [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole) 
                ? <UserManagement 
                    users={users} 
                    setUsers={setUsers} 
                    contractors={currentContractors} 
                    sites={sites} 
                    companies={companies}
                    currentUserRole={userRole}
                  /> 
                : <Navigate to="/" replace />
            } />
            
            <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} racDefinitions={racDefinitions} /> : <Navigate to="/" replace />} />
            
            <Route path="/manuals" element={<UserManualsPage userRole={userRole} />} />
            <Route path="/admin-manual" element={userRole === UserRole.SYSTEM_ADMIN ? <AdminManualPage /> : <Navigate to="/" replace />} />
            <Route path="/logs" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) ? <LogsPage /> : <Navigate to="/" replace />} />
            <Route path="/alcohol-control" element={<AlcoholIntegration />} />
            <Route path="/system-health" element={userRole === UserRole.SYSTEM_ADMIN ? <SystemHealthPage /> : <Navigate to="/" replace />} />
            <Route path="/tech-docs" element={userRole === UserRole.SYSTEM_ADMIN ? <TechnicalDocs /> : <Navigate to="/" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <GeminiAdvisor />
      </HashRouter>
    </AdvisorProvider>
  );
};

export default App;
