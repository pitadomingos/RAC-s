
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
const SystemHealthPage = lazy(() => import('./pages/SystemHealthPage')); // NEW

const App: React.FC = () => {
  // --- State Management ---
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // -- Multi-Tenancy State --
  const [companies, setCompanies] = useState<Company[]>([
      { 
        id: 'c1', 
        name: 'Vulcan', // Enterprise Name
        status: 'Active', 
        appName: 'CARS Manager',
        subContractors: ['Vulcan Mining', 'Global Logistics', 'Safety First Contractors', 'Elite Security', 'Heavy Haulage Ltd'] 
      },
      { 
        id: 'c2', 
        name: 'Global Logistics', 
        status: 'Active', 
        appName: 'SafetyTrack',
        subContractors: ['Global Logistics', 'Fast Haul', 'TechSolutions Inc'] 
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
  const currentEmployeeId = 'emp-2027-1';

  // Branding Logic & Contractor List
  const { currentAppName, currentContractors } = useMemo(() => {
      let activeEnt = companies.find(c => c.id === 'c1');
      
      if (userRole === UserRole.SYSTEM_ADMIN) {
          return {
              currentAppName: 'CARS Manager',
              currentContractors: Array.from(new Set(companies.flatMap(c => c.subContractors || [])))
          };
      } else {
          return {
              currentAppName: activeEnt?.appName || 'CARS Manager',
              currentContractors: activeEnt?.subContractors || COMPANIES 
          };
      }
  }, [userRole, companies]);

  // Data
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
  
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'System Admin', email: 'admin@system.com', role: UserRole.SYSTEM_ADMIN, status: 'Active', company: 'System Owner', jobTitle: 'SaaS Administrator' },
    { id: 2, name: 'Enterprise Director', email: 'director@vulcan.com', role: UserRole.ENTERPRISE_ADMIN, status: 'Active', company: 'Vulcan', jobTitle: 'HSE Director' },
    { id: 3, name: 'Site Manager', email: 'manager@moatize.com', role: UserRole.SITE_ADMIN, status: 'Active', company: 'Vulcan', jobTitle: 'Site Manager' },
    { id: 4, name: 'John Doe', email: 'trainer@vulcan.com', role: UserRole.RAC_TRAINER, status: 'Active', company: 'Vulcan', jobTitle: 'Lead Instructor' },
    { id: 5, name: 'General User', email: 'user@worker.com', role: UserRole.USER, status: 'Active', company: 'Vulcan Mining', jobTitle: 'Operator' },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>([]);

  // Initialize REAL WORLD SCENARIO Data
  useEffect(() => {
    if (bookings.length === 0) {
        const generatedBookings: Booking[] = [];
        const generatedRequirements: EmployeeRequirement[] = [];
        const today = new Date();

        // 1. Group 2027 (Excellent Compliance)
        const excellentEmployees = [
            { id: 'emp-2027-1', name: 'General User', role: 'Operator' }, 
            { id: 'emp-2027-2', name: 'Sarah Best', role: 'Supervisor' },
            { id: 'emp-2027-3', name: 'Mike Star', role: 'Technician' }
        ];

        excellentEmployees.forEach(u => {
            const emp: Employee = {
                id: u.id,
                name: u.name,
                recordId: `VUL-${u.id.replace('emp-', '').toUpperCase()}`,
                company: 'Vulcan Mining',
                department: 'Mine Operations',
                role: u.role,
                isActive: true,
                siteId: 's1',
                driverLicenseNumber: `DL-${u.id}`,
                driverLicenseClass: 'C1',
                driverLicenseExpiry: '2028-01-01'
            };
            
            generatedRequirements.push({
                employeeId: u.id,
                asoExpiryDate: '2027-12-31',
                requiredRacs: { 'RAC01': true, 'RAC02': true, 'RAC05': true }
            });

            // Booking RAC01
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S_HIST_2025_01',
                employee: {...emp},
                status: BookingStatus.PASSED,
                resultDate: '2025-02-15',
                expiryDate: '2027-02-15', 
                attendance: true,
                theoryScore: 98
            });
            // Booking RAC02
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S_HIST_2025_02',
                employee: {...emp},
                status: BookingStatus.PASSED,
                resultDate: '2025-03-10',
                expiryDate: '2027-03-10', 
                attendance: true,
                theoryScore: 95,
                practicalScore: 94,
                driverLicenseVerified: true
            });
             // Booking RAC05
             generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S_HIST_2025_05',
                employee: {...emp},
                status: BookingStatus.PASSED,
                resultDate: '2025-01-20',
                expiryDate: '2027-01-20', 
                attendance: true,
                theoryScore: 92
            });
        });

        // 2. Group 2026 (Good Compliance)
        for(let i=1; i<=3; i++) {
            const emp: Employee = {
                id: `emp-2026-${i}`,
                name: `Worker Good ${i}`,
                recordId: `VUL-2026-0${i}`,
                company: 'Global Logistics',
                department: 'Logistics',
                role: 'Driver',
                isActive: true,
                siteId: 's1',
                driverLicenseNumber: `DL-2026-${i}`,
                driverLicenseClass: 'C',
                driverLicenseExpiry: '2026-12-31'
            };
            generatedRequirements.push({
                employeeId: emp.id,
                asoExpiryDate: '2026-06-30',
                requiredRacs: { 'RAC02': true, 'RAC11': true }
            });
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S_HIST_2024_02',
                employee: emp,
                status: BookingStatus.PASSED,
                resultDate: '2024-05-15',
                expiryDate: '2026-05-15',
                attendance: true,
                theoryScore: 85,
                practicalScore: 80,
                driverLicenseVerified: true
            });
        }

        // 3. Group 2025 (Risk / Expiring)
        const nearFuture = new Date();
        nearFuture.setDate(today.getDate() + 20); 
        const expiry2025 = nearFuture.toISOString().split('T')[0];

        const expiringEmployees = [
            { name: 'Pedro Risk', dept: 'Maintenance' },
            { name: 'Ana Alert', dept: 'HSE' },
            { name: 'Carlos Critical', dept: 'Plant' }
        ];

        expiringEmployees.forEach((u, i) => {
            const emp: Employee = {
                id: `emp-2025-${i}`,
                name: u.name,
                recordId: `VUL-2025-0${i}`,
                company: 'Safety First Contractors',
                department: u.dept,
                role: 'Technician',
                isActive: true,
                siteId: 's2'
            };
            generatedRequirements.push({
                employeeId: emp.id,
                asoExpiryDate: '2025-12-31', 
                requiredRacs: { 'RAC01': true, 'RAC08': true }
            });
            
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S_HIST_2023_01',
                employee: emp,
                status: BookingStatus.PASSED,
                resultDate: '2023-01-01',
                expiryDate: expiry2025, 
                attendance: true,
                theoryScore: 78
            });
        });

        // 4. Auto-Booked Scenario
        const autoBookEmp: Employee = {
            id: 'emp-auto-1',
            name: 'Paulo Manjate',
            recordId: 'VUL-AUTO-99',
            company: 'Vulcan Mining',
            department: 'Mine Operations',
            role: 'Operator',
            isActive: true,
            siteId: 's1'
        };
        generatedRequirements.push({
            employeeId: autoBookEmp.id,
            asoExpiryDate: '2026-01-01',
            requiredRacs: { 'RAC02': true }
        });
        generatedBookings.push({
            id: uuidv4(),
            sessionId: 'S005', 
            employee: autoBookEmp,
            status: BookingStatus.PENDING,
            isAutoBooked: true
        });

        setBookings(generatedBookings);
        setRequirements(generatedRequirements);
        
        setNotifications(prev => [{
            id: uuidv4(),
            type: 'alert',
            title: 'Auto-Booking Engine Active',
            message: 'Detected critical expiry risks. Auto-booked slots created.',
            timestamp: new Date(),
            isRead: false
        }]);
    }
  }, []);

  // --- FILTER LOGIC (Site Context) ---
  const filteredBookings = useMemo(() => {
      if (currentSiteId === 'all') return bookings;
      return bookings.filter(b => b.employee.siteId === currentSiteId || !b.employee.siteId); 
  }, [bookings, currentSiteId]);

  const filteredSessions = useMemo(() => {
      if (currentSiteId === 'all') return sessions;
      return sessions.filter(s => s.siteId === currentSiteId || !s.siteId);
  }, [sessions, currentSiteId]);

  const filteredRequirements = useMemo(() => {
      if (currentSiteId === 'all') return requirements;
      const validEmployeeIds = new Set(filteredBookings.map(b => b.employee.id));
      return requirements.filter(r => validEmployeeIds.has(r.employeeId));
  }, [requirements, filteredBookings, currentSiteId]);


  // --- DEMAND ANALYTICS ENGINE ---
  useEffect(() => {
      const demandMap = new Map<string, number>();
      bookings.forEach(b => {
          if (b.status === BookingStatus.PENDING) {
              const session = sessions.find(s => s.id === b.sessionId);
              if (session) {
                  const type = session.racType;
                  demandMap.set(type, (demandMap.get(type) || 0) + 1);
              }
          }
      });

      demandMap.forEach((count, racType) => {
          const futureSessions = sessions.filter(s => s.racType === racType && new Date(s.date) > new Date());
          const totalCapacity = futureSessions.reduce((acc, s) => acc + s.capacity, 0);

          if (count > totalCapacity * 0.9) { 
              const existingNotif = notifications.find(n => n.title.includes('High Demand') && n.message.includes(racType));
              if (!existingNotif) {
                  setNotifications(prev => [{
                      id: uuidv4(),
                      type: 'alert',
                      title: 'High Training Demand Detected',
                      message: `High demand for ${racType} (${count} bookings). Capacity is low.`,
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

  const syncRequirementsFromBookings = (bookingsToSync: Booking[]) => {
      setRequirements(prevReqs => {
          const newReqs = [...prevReqs];
          bookingsToSync.forEach(b => {
              let reqIndex = newReqs.findIndex(r => r.employeeId === b.employee.id);
              if (reqIndex === -1) {
                  newReqs.push({ 
                      employeeId: b.employee.id, 
                      asoExpiryDate: '', 
                      requiredRacs: {} 
                  });
                  reqIndex = newReqs.length - 1;
              }
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
          message: 'Employee confirmed for training.',
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
        appName={currentAppName}
      >
        <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading...</div>}>
            <Routes>
              <Route path="/enterprise-dashboard" element={
                  [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                  ? <EnterpriseDashboard sites={sites} bookings={bookings} requirements={requirements} userRole={userRole} contractors={currentContractors} companies={companies} /> 
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

              <Route path="/system-health" element={
                  userRole === UserRole.SYSTEM_ADMIN 
                  ? <SystemHealthPage /> 
                  : <Navigate to="/" replace />
              } />

              <Route path="/" element={
                  userRole === UserRole.USER 
                    ? <Navigate to="/manuals" replace /> 
                    : userRole === UserRole.ENTERPRISE_ADMIN
                      ? <Navigate to="/enterprise-dashboard" replace />
                      : <Dashboard bookings={filteredBookings} requirements={filteredRequirements} sessions={filteredSessions} userRole={userRole} onApproveAutoBooking={onApproveAutoBooking} onRejectAutoBooking={onRejectAutoBooking} racDefinitions={racDefinitions} contractors={currentContractors} />
              } />
              
              <Route path="/database" element={
                  (userRole === UserRole.USER || userRole === UserRole.RAC_TRAINER)
                    ? <Navigate to="/manuals" replace />
                    : <DatabasePage bookings={filteredBookings} requirements={filteredRequirements} updateRequirements={updateRequirements} sessions={filteredSessions} onUpdateEmployee={onUpdateEmployee} onDeleteEmployee={onDeleteEmployee} racDefinitions={racDefinitions} contractors={currentContractors} />
              } />
              
              <Route path="/reports" element={authorizedRoles.includes(userRole) ? <ReportsPage bookings={filteredBookings} sessions={filteredSessions} /> : <Navigate to="/" replace />} />
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
              
              <Route path="/results" element={userRole === UserRole.RAC_TRAINER || userRole === UserRole.ENTERPRISE_ADMIN ? <Navigate to="/" replace /> : <ResultsPage bookings={filteredBookings} updateBookingStatus={updateBookingStatus} importBookings={importBookings} userRole={userRole} sessions={filteredSessions} currentEmployeeId={currentEmployeeId} />} />
              
              <Route path="/proposal" element={userRole === UserRole.SYSTEM_ADMIN ? <ProjectProposal /> : <Navigate to="/" replace />} />
              <Route path="/presentation" element={userRole === UserRole.SYSTEM_ADMIN ? <PresentationPage /> : <Navigate to="/" replace />} />
              <Route path="/tech-docs" element={userRole === UserRole.SYSTEM_ADMIN ? <TechnicalDocs /> : <Navigate to="/" replace />} />
              <Route path="/admin-manual" element={userRole === UserRole.SYSTEM_ADMIN ? <AdminManualPage /> : <Navigate to="/" replace />} />
              
              <Route path="/request-cards" element={authorizedRoles.concat(UserRole.USER).includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN ? <RequestCardsPage bookings={filteredBookings} requirements={filteredRequirements} racDefinitions={racDefinitions} sessions={filteredSessions} userRole={userRole} currentEmployeeId={currentEmployeeId} /> : <Navigate to="/" replace />} />
              
              <Route path="/print-cards" element={authorizedRoles.concat(UserRole.USER).includes(userRole) && userRole !== UserRole.ENTERPRISE_ADMIN ? <CardsPage bookings={filteredBookings} requirements={filteredRequirements} racDefinitions={racDefinitions} sessions={filteredSessions} userRole={userRole} /> : <Navigate to="/" replace />} />
              
              <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} contractors={currentContractors} sites={sites} /> : <Navigate to="/" replace />} />
              <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} /> : <Navigate to="/" replace />} />
              
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
                  addNotification={addNotification}
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
