
import React, { useState, Suspense, lazy, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GeminiAdvisor from './components/GeminiAdvisor';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { 
  UserRole, Booking, EmployeeRequirement, TrainingSession, User, RacDef, 
  BookingStatus, Employee, SystemNotification, Room, Trainer, Site, Company
} from './types';
import { MOCK_SESSIONS, INITIAL_RAC_DEFINITIONS, COMPANIES, DEPARTMENTS, ROLES, RAC_KEYS } from './constants';
import { v4 as uuidv4 } from 'uuid';

// Lazy Load Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DatabasePage = lazy(() => import('./pages/DatabasePage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const TrainerInputPage = lazy(() => import('./pages/TrainerInputPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const ScheduleTraining = lazy(() => import('./pages/ScheduleTraining'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const RequestCardsPage = lazy(() => import('./pages/RequestCardsPage'));
const CardsPage = lazy(() => import('./pages/CardsPage'));
const UserManualsPage = lazy(() => import('./pages/UserManualsPage'));
const AdminManualPage = lazy(() => import('./pages/AdminManualPage'));
const LogsPage = lazy(() => import('./pages/LogsPage'));
const ProjectProposal = lazy(() => import('./pages/ProjectProposal'));
const PresentationPage = lazy(() => import('./pages/PresentationPage'));
const AlcoholIntegration = lazy(() => import('./pages/AlcoholIntegration'));
const VerificationPage = lazy(() => import('./pages/VerificationPage'));
const TechnicalDocs = lazy(() => import('./pages/TechnicalDocs'));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard'));
const SiteGovernancePage = lazy(() => import('./pages/SiteGovernancePage'));

const App: React.FC = () => {
  // --- State Management ---
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // -- Multi-Tenancy State --
  // Note: subContractors array allows the Enterprise (Vulcan) to manage its list of accepted companies.
  const [companies, setCompanies] = useState<Company[]>([
      { 
        id: 'c1', 
        name: 'Vulcan', // Enterprise Name
        status: 'Active', 
        appName: 'CARS Manager',
        subContractors: ['Vulcan Mining', 'Global Logistics', 'Safety First Contractors', 'Elite Security'] 
      },
      { 
        id: 'c2', 
        name: 'Global Logistics', 
        status: 'Active', 
        appName: 'SafetyTrack',
        subContractors: ['Global Logistics', 'Fast Haul'] 
      }
  ]);
  
  const [sites, setSites] = useState<Site[]>([
      { id: 's1', companyId: 'c1', name: 'Moatize Mine', location: 'Tete', mandatoryRacs: ['RAC01', 'RAC02'] },
      { id: 's2', companyId: 'c1', name: 'Maputo HQ', location: 'Maputo', mandatoryRacs: ['RAC01'] },
      { id: 's3', companyId: 'c1', name: 'Nacala Corridor', location: 'Nacala', mandatoryRacs: ['RAC02', 'RAC05'] }
  ]);
  
  // Current Context (Default 'all' for Enterprise View)
  const [currentSiteId, setCurrentSiteId] = useState<string>('all');

  // Simulated logged-in user for self-service
  const currentEmployeeId = 'emp-1';

  // Branding Logic & Contractor List
  const { currentAppName, currentContractors } = useMemo(() => {
      // Logic: Find the active Enterprise based on Role or context.
      // For this demo, non-System Admins default to "Vulcan" (c1).
      let activeEnt = companies.find(c => c.id === 'c1');
      
      if (userRole === UserRole.SYSTEM_ADMIN) {
          // System Admin sees default app name, and ALL possible contractors combined for now
          // (In a real app, SysAdmin would switch contexts)
          return {
              currentAppName: 'CARS Manager',
              currentContractors: Array.from(new Set(companies.flatMap(c => c.subContractors || [])))
          };
      } else {
          // Enterprise Admin / User view
          return {
              currentAppName: activeEnt?.appName || 'CARS Manager',
              currentContractors: activeEnt?.subContractors || COMPANIES // Fallback to constant
          };
      }
  }, [userRole, companies]);

  // Data
  // Assign initial data to a site for demo purposes (default s1)
  const stampedSessions = MOCK_SESSIONS.map(s => ({ ...s, siteId: 's1' }));
  const [sessions, setSessions] = useState<TrainingSession[]>(stampedSessions);
  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>(INITIAL_RAC_DEFINITIONS);
  const [rooms, setRooms] = useState<Room[]>([
      { id: '1', name: 'Room A', capacity: 20, siteId: 's1' },
      { id: '2', name: 'Room B', capacity: 30, siteId: 's1' },
      { id: '3', name: 'Field Training Area', capacity: 15, siteId: 's1' },
      { id: '4', name: 'Computer Lab', capacity: 12, siteId: 's2' },
  ]);
  const [trainers, setTrainers] = useState<Trainer[]>([
      { id: '1', name: 'John Doe', racs: ['RAC01', 'RAC05'] },
      { id: '2', name: 'Jane Smith', racs: ['RAC02', 'RAC04'] },
      { id: '3', name: 'Mike Brown', racs: ['RAC08', 'RAC10'] },
      { id: '4', name: 'Sarah Connor', racs: ['RAC08'] },
  ]);
  
  // Users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'System Admin', email: 'admin@vulcan.com', role: UserRole.SYSTEM_ADMIN, status: 'Active', company: 'Vulcan' },
    { id: 2, name: 'John Doe', email: 'john@vulcan.com', role: UserRole.RAC_TRAINER, status: 'Active', company: 'Vulcan' },
  ]);

  // Bookings & Employees (Mock Data)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>([]);

  // Initialize some mock data if empty
  useEffect(() => {
    if (bookings.length === 0) {
        const generatedBookings: Booking[] = [];
        const generatedRequirements: EmployeeRequirement[] = [];
        const today = new Date();

        // Helper to format date
        const fmtDate = (d: Date) => d.toISOString().split('T')[0];
        
        // 1. Create 8 FULLY GRANTED Employees (Perfect Batch)
        for (let i = 1; i <= 8; i++) {
            const empId = `emp-${i}`;
            const siteId = i % 2 === 0 ? 's1' : 's2'; // Distribute across sites
            
            // Assign Sub-contractors from the constant list for initial seed
            const assignedCompany = COMPANIES[i % COMPANIES.length];

            const employee: Employee = {
                id: empId,
                name: `Safe Worker ${i}`,
                recordId: `VUL-${1000 + i}`,
                company: assignedCompany,
                department: DEPARTMENTS[i % DEPARTMENTS.length],
                role: ROLES[i % ROLES.length],
                driverLicenseNumber: `DL-${202400 + i}`,
                driverLicenseClass: 'C1',
                driverLicenseExpiry: '2030-01-01', // Future Date
                isActive: true,
                siteId: siteId
            };

            // Requirements
            generatedRequirements.push({
                employeeId: empId,
                asoExpiryDate: '2030-06-01', // Valid ASO
                requiredRacs: { 
                    'RAC01': true, 'RAC02': true, 'PTS': true, 'ART': true, 'LIB_OPS': true, 'LIB_MOV': true 
                }
            });

            // Booking 1: RAC 01 (Passed, Valid)
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S001', 
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                theoryScore: 95,
                resultDate: '2024-01-15',
                expiryDate: '2026-01-15'
            });
        }

        // --- SCENARIO 1: EXPIRING SOON (< 30 Days) ---
        // This triggers the Yellow Alert on Dashboard
        const expiringEmployees = [
            { name: 'Joao Silva', days: 12 },
            { name: 'Maria Santos', days: 18 },
            { name: 'Pedro Jose', days: 25 }
        ];

        expiringEmployees.forEach((u, i) => {
            const id = `exp-user-${i}`;
            const expDate = new Date(today);
            expDate.setDate(today.getDate() + u.days); // Expiring in X days

            const emp: Employee = {
                id,
                name: u.name,
                recordId: `EXP-${100 + i}`,
                company: 'Vulcan Mining',
                department: 'HSE',
                role: 'Technician',
                isActive: true,
                siteId: 's1'
            };

            generatedRequirements.push({
                employeeId: id,
                asoExpiryDate: '2026-01-01',
                requiredRacs: { 'RAC01': true }
            });

            // Booking is PASSED but expiryDate is close
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S001', // RAC 01
                employee: emp,
                status: BookingStatus.PASSED,
                resultDate: '2023-01-01', // Old result
                expiryDate: fmtDate(expDate), // Expiring soon
                attendance: true,
                theoryScore: 88
            });
        });


        // --- SCENARIO 2: AUTO-BOOKED (< 7 Days) ---
        // This triggers the Orange Table on Dashboard
        
        // 1. Paulo Manjate (Original)
        const pauloEmp: Employee = {
            id: 'emp-scenario-01',
            name: 'Paulo Manjate',
            recordId: 'VUL-9999',
            company: 'Vulcan Mining',
            department: 'Mine Operations',
            role: 'Heavy Equipment Operator',
            isActive: true,
            driverLicenseNumber: 'DL-98765432',
            driverLicenseClass: 'G (Heavy)',
            driverLicenseExpiry: '2025-12-31',
            siteId: 's1'
        };
        generatedRequirements.push({
            employeeId: pauloEmp.id,
            asoExpiryDate: '2026-01-01',
            requiredRacs: { 'RAC02': true }
        });
        generatedBookings.push({
            id: uuidv4(),
            sessionId: 'S005', // RAC02 Future
            employee: pauloEmp,
            status: BookingStatus.PENDING,
            isAutoBooked: true
        });

        // 2. Three Additional Auto-Bookings
        const autoBookingGroup = [
            { name: 'Sofia Machel', rac: 'RAC01', session: 'S006', rec: 'VUL-8801' },
            { name: 'Carlos Tamele', rac: 'RAC05', session: 'S003', rec: 'VUL-8802' },
            { name: 'Ana Langa', rac: 'RAC08', session: 'S004', rec: 'VUL-8803' }
        ];

        autoBookingGroup.forEach((u, i) => {
            const emp: Employee = {
                id: `auto-${i}`,
                name: u.name,
                recordId: u.rec,
                company: 'Global Logistics',
                department: 'Logistics',
                role: 'Driver',
                isActive: true,
                siteId: 's1'
            };
            
            // Map requirement
            const racKey = u.rac; 
            generatedRequirements.push({
                employeeId: emp.id,
                asoExpiryDate: '2026-01-01',
                requiredRacs: { [racKey]: true }
            });

            // Create Auto Booking
            generatedBookings.push({
                id: uuidv4(),
                sessionId: u.session,
                employee: emp,
                status: BookingStatus.PENDING,
                isAutoBooked: true
            });
        });

        setBookings(generatedBookings);
        setRequirements(generatedRequirements);
        
        // Push notification immediately
        setNotifications(prev => [{
            id: uuidv4(),
            type: 'alert',
            title: 'Auto-Booking Engine Active',
            message: 'Detected 4 critical employees expiring in < 7 days. Auto-booked slots to prevent site lockout.',
            timestamp: new Date(),
            isRead: false
        }]);
    }
  }, []);

  // --- FILTER LOGIC (Site Context) ---
  const filteredBookings = useMemo(() => {
      if (currentSiteId === 'all') return bookings;
      return bookings.filter(b => b.employee.siteId === currentSiteId || !b.employee.siteId); // Default to show if undefined for legacy
  }, [bookings, currentSiteId]);

  const filteredSessions = useMemo(() => {
      if (currentSiteId === 'all') return sessions;
      return sessions.filter(s => s.siteId === currentSiteId || !s.siteId);
  }, [sessions, currentSiteId]);

  const filteredRequirements = useMemo(() => {
      // Requirements are linked to Employee IDs. 
      // We first find eligible employees for the site.
      if (currentSiteId === 'all') return requirements;
      const validEmployeeIds = new Set(filteredBookings.map(b => b.employee.id));
      return requirements.filter(r => validEmployeeIds.has(r.employeeId));
  }, [requirements, filteredBookings, currentSiteId]);


  // --- DEMAND ANALYTICS ENGINE ---
  useEffect(() => {
      // Calculate Demand vs Capacity per RAC Type
      const demandMap = new Map<string, number>();
      
      // 1. Count future bookings
      bookings.forEach(b => {
          if (b.status === BookingStatus.PENDING) {
              // Find session type
              const session = sessions.find(s => s.id === b.sessionId);
              if (session) {
                  const type = session.racType;
                  demandMap.set(type, (demandMap.get(type) || 0) + 1);
              }
          }
      });

      // 2. Check Capacity
      demandMap.forEach((count, racType) => {
          const futureSessions = sessions.filter(s => s.racType === racType && new Date(s.date) > new Date());
          const totalCapacity = futureSessions.reduce((acc, s) => acc + s.capacity, 0);

          if (count > totalCapacity * 0.9) { // If bookings exceed 90% of capacity
              // Avoid duplicate notification spam
              const existingNotif = notifications.find(n => n.title.includes('High Demand') && n.message.includes(racType));
              if (!existingNotif) {
                  setNotifications(prev => [{
                      id: uuidv4(),
                      type: 'alert',
                      title: 'High Training Demand Detected',
                      message: `High demand for ${racType} (${count} bookings). Capacity is low. Please schedule more sessions.`,
                      timestamp: new Date(),
                      isRead: false
                  }, ...prev]);
              }
          }
      });
  }, [bookings, sessions]);

  // --- Handlers ---

  const handleUpdateRacDefinitions = (newDefs: RacDef[]) => {
      setRacDefinitions(newDefs);
  };

  const clearNotifications = () => setNotifications([]);

  const addNotification = (n: SystemNotification) => {
      setNotifications(prev => [n, ...prev]);
  };

  // GENERIC HELPER: Sync Requirements from Bookings
  const syncRequirementsFromBookings = (bookingsToSync: Booking[]) => {
      setRequirements(prevReqs => {
          const newReqs = [...prevReqs];
          
          bookingsToSync.forEach(b => {
              // 1. Find or Create Requirement for Employee
              let reqIndex = newReqs.findIndex(r => r.employeeId === b.employee.id);
              if (reqIndex === -1) {
                  newReqs.push({ 
                      employeeId: b.employee.id, 
                      asoExpiryDate: '', 
                      requiredRacs: {} 
                  });
                  reqIndex = newReqs.length - 1;
              }
              
              // 2. Determine RAC Key from Session/Booking ID
              let racCode = '';
              const session = sessions.find(s => s.id === b.sessionId);
              
              if (session) {
                  racCode = session.racType.split(' - ')[0]; 
              } else {
                  racCode = b.sessionId.split('|')[0];
              }
              
              racCode = racCode.replace(/\(imp\)/gi, '').replace(/\s+/g, '').toUpperCase();
              
              if (racCode) {
                  if (!newReqs[reqIndex].requiredRacs[racCode]) {
                      newReqs[reqIndex].requiredRacs[racCode] = true;
                  }
              }
          });
          
          return newReqs;
      });
  };

  const addBookings = (newBookings: Booking[]) => {
      // Force assign siteId if missing, defaulting to current selected or first site
      const targetSite = currentSiteId !== 'all' ? currentSiteId : 's1';
      const stampedBookings = newBookings.map(b => ({
          ...b,
          employee: {
              ...b.employee,
              siteId: b.employee.siteId || targetSite
          }
      }));

      setBookings(prev => [...prev, ...stampedBookings]);
      syncRequirementsFromBookings(stampedBookings);
  };

  const updateBookings = (updates: Booking[]) => {
      setBookings(prev => prev.map(b => {
          const update = updates.find(u => u.id === b.id);
          return update ? update : b;
      }));
      syncRequirementsFromBookings(updates);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const importBookings = (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => {
      // Assign site context to imports if not present
      const targetSite = currentSiteId !== 'all' ? currentSiteId : 's1';
      const stampedBookings = newBookings.map(b => ({
          ...b,
          employee: { ...b.employee, siteId: b.employee.siteId || targetSite }
      }));

      setBookings(prev => [...prev, ...stampedBookings]);
      syncRequirementsFromBookings(stampedBookings);

      if (sideEffects && sideEffects.length > 0) {
          const extraBookings: Booking[] = [];

          setRequirements(prevReqs => {
              const newReqs = [...prevReqs];
              
              sideEffects.forEach(effect => {
                  let idx = newReqs.findIndex(r => r.employeeId === effect.employee.id);
                  
                  if (idx === -1) {
                      newReqs.push({
                          employeeId: effect.employee.id,
                          asoExpiryDate: '',
                          requiredRacs: {}
                      });
                      idx = newReqs.length - 1;

                      const inMainImport = stampedBookings.some(b => b.employee.id === effect.employee.id);
                      if (!inMainImport) {
                          extraBookings.push({
                              id: uuidv4(),
                              sessionId: 'REGISTRATION',
                              employee: { ...effect.employee, siteId: targetSite },
                              status: BookingStatus.PENDING,
                              isAutoBooked: false
                          });
                      }
                  }

                  if (effect.aso) newReqs[idx].asoExpiryDate = effect.aso;
                  if (effect.ops) newReqs[idx].requiredRacs = { ...newReqs[idx].requiredRacs, ...effect.ops };
              });
              
              return newReqs;
          });

          if (extraBookings.length > 0) {
              setBookings(prev => {
                  const uniqueExtras = extraBookings.filter(eb => !prev.some(pb => pb.employee.id === eb.employee.id));
                  return [...prev, ...uniqueExtras];
              });
          }
      }
  };

  const updateRequirements = (req: EmployeeRequirement) => {
      setRequirements(prev => {
          const idx = prev.findIndex(r => r.employeeId === req.employeeId);
          if (idx >= 0) {
              const newReqs = [...prev];
              newReqs[idx] = req;
              return newReqs;
          }
          return [...prev, req];
      });
  };

  const onUpdateEmployee = (id: string, updates: Partial<Employee>) => {
      setBookings(prev => prev.map(b => 
          b.employee.id === id ? { ...b, employee: { ...b.employee, ...updates } } : b
      ));
  };

  const onDeleteEmployee = (id: string) => {
      setBookings(prev => prev.filter(b => b.employee.id !== id));
      setRequirements(prev => prev.filter(r => r.employeeId !== id));
  };

  const onApproveAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isAutoBooked: false, status: BookingStatus.PENDING } : b));
      addNotification({
          id: uuidv4(),
          type: 'success',
          title: 'Booking Approved',
          message: 'Employee confirmed for training. Notification sent to Dept Manager.',
          timestamp: new Date(),
          isRead: false
      });
  };

  const onRejectAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const authorizedRoles = [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN];

  return (
    <HashRouter>
      <AdvisorProvider>
      <Layout 
        userRole={userRole} 
        setUserRole={setUserRole} 
        notifications={notifications} 
        clearNotifications={clearNotifications}
        sites={sites}
        currentSiteId={currentSiteId}
        setCurrentSiteId={setCurrentSiteId}
        appName={currentAppName} // PASS DYNAMIC NAME HERE
      >
        <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading...</div>}>
            <Routes>
              {/* Enterprise Specific Routes */}
              <Route path="/enterprise-dashboard" element={
                  [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                  ? <EnterpriseDashboard sites={sites} bookings={bookings} requirements={requirements} userRole={userRole} contractors={currentContractors} /> 
                  : <Navigate to="/" replace />
              } />
              
              <Route path="/site-governance" element={
                  [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                  ? <SiteGovernancePage 
                      sites={sites} 
                      setSites={setSites} 
                      racDefinitions={racDefinitions} 
                      bookings={bookings}
                      requirements={requirements}
                      updateRequirements={updateRequirements}
                    /> 
                  : <Navigate to="/" replace />
              } />

              {/* Dashboard Redirect Logic */}
              <Route path="/" element={
                  userRole === UserRole.USER 
                    ? <Navigate to="/manuals" replace /> 
                    : (userRole === UserRole.ENTERPRISE_ADMIN || userRole === UserRole.SYSTEM_ADMIN)
                      ? <Navigate to="/enterprise-dashboard" replace />
                      : <Dashboard bookings={filteredBookings} requirements={filteredRequirements} sessions={filteredSessions} userRole={userRole} onApproveAutoBooking={onApproveAutoBooking} onRejectAutoBooking={onRejectAutoBooking} racDefinitions={racDefinitions} contractors={currentContractors} />
              } />
              
              {/* Database is RESTRICTED for General User and RAC Trainer */}
              <Route path="/database" element={
                  (userRole === UserRole.USER || userRole === UserRole.RAC_TRAINER)
                    ? <Navigate to="/manuals" replace />
                    : <DatabasePage bookings={filteredBookings} requirements={filteredRequirements} updateRequirements={updateRequirements} sessions={filteredSessions} onUpdateEmployee={onUpdateEmployee} onDeleteEmployee={onDeleteEmployee} racDefinitions={racDefinitions} contractors={currentContractors} />
              } />
              
              {/* Reports is RESTRICTED for RAC Trainer */}
              <Route path="/reports" element={authorizedRoles.includes(userRole) ? <ReportsPage bookings={filteredBookings} sessions={filteredSessions} /> : <Navigate to="/" replace />} />
              
              {/* Booking is RESTRICTED for RAC Trainer and Enterprise Admin */}
              <Route path="/booking" element={userRole === UserRole.RAC_TRAINER || userRole === UserRole.ENTERPRISE_ADMIN ? <Navigate to="/" replace /> : <BookingForm addBookings={addBookings} sessions={filteredSessions} userRole={userRole} existingBookings={filteredBookings} addNotification={addNotification} currentEmployeeId={currentEmployeeId} requirements={filteredRequirements} contractors={currentContractors} />} />
              
              <Route path="/trainer-input" element={
                  authorizedRoles.includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN 
                  ? <TrainerInputPage 
                      bookings={filteredBookings} 
                      updateBookings={updateBookings} 
                      sessions={filteredSessions} 
                      userRole={userRole} 
                      currentUserName={userRole === UserRole.RAC_TRAINER ? 'John Doe' : 'System Admin'} 
                    /> 
                  : <Navigate to="/" replace />
              } />
              
              {/* Results is RESTRICTED for RAC Trainer and Enterprise Admin */}
              <Route path="/results" element={userRole === UserRole.RAC_TRAINER || userRole === UserRole.ENTERPRISE_ADMIN ? <Navigate to="/" replace /> : <ResultsPage bookings={filteredBookings} updateBookingStatus={updateBookingStatus} importBookings={importBookings} userRole={userRole} sessions={filteredSessions} currentEmployeeId={currentEmployeeId} />} />
              
              <Route path="/proposal" element={userRole === UserRole.SYSTEM_ADMIN ? <ProjectProposal /> : <Navigate to="/" replace />} />
              <Route path="/presentation" element={userRole === UserRole.SYSTEM_ADMIN ? <PresentationPage /> : <Navigate to="/" replace />} />
              <Route path="/tech-docs" element={userRole === UserRole.SYSTEM_ADMIN ? <TechnicalDocs /> : <Navigate to="/" replace />} />
              <Route path="/admin-manual" element={userRole === UserRole.SYSTEM_ADMIN ? <AdminManualPage /> : <Navigate to="/" replace />} />
              
              {/* Pass currentEmployeeId for Self-Service */}
              <Route path="/request-cards" element={authorizedRoles.concat(UserRole.USER).includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN ? <RequestCardsPage bookings={filteredBookings} requirements={filteredRequirements} racDefinitions={racDefinitions} sessions={filteredSessions} userRole={userRole} currentEmployeeId={currentEmployeeId} /> : <Navigate to="/" replace />} />
              
              <Route path="/print-cards" element={authorizedRoles.concat(UserRole.USER).includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN ? <CardsPage bookings={filteredBookings} requirements={filteredRequirements} racDefinitions={racDefinitions} sessions={filteredSessions} userRole={userRole} /> : <Navigate to="/" replace />} />
              
              <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} contractors={currentContractors} /> : <Navigate to="/" replace />} />
              <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} /> : <Navigate to="/" replace />} />
              
              {/* Settings now manages Sites/Companies too. Restricted to System Admin as requested for "System Settings". */}
              <Route path="/settings" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) ? 
                <SettingsPage 
                  racDefinitions={racDefinitions} 
                  onUpdateRacs={handleUpdateRacDefinitions} 
                  rooms={rooms} 
                  onUpdateRooms={setRooms} 
                  trainers={trainers} 
                  onUpdateTrainers={setTrainers} 
                  sites={sites} 
                  onUpdateSites={setSites} 
                  companies={companies} 
                  onUpdateCompanies={setCompanies} 
                  userRole={userRole}
                  users={users}
                  onUpdateUsers={setUsers}
                  contractors={currentContractors}
                /> : <Navigate to="/" replace />} 
              />
              
              <Route path="/manuals" element={<UserManualsPage userRole={userRole} />} />
              <Route path="/logs" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) ? <LogsPage /> : <Navigate to="/" replace />} />
              
              <Route path="/alcohol-control" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) ? <AlcoholIntegration /> : <Navigate to="/" replace />} />
              
              <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
        <GeminiAdvisor />
      </Layout>
      </AdvisorProvider>
    </HashRouter>
  );
};

export default App;
