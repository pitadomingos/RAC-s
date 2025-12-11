import React, { useState, Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GeminiAdvisor from './components/GeminiAdvisor';
import { 
  UserRole, Booking, EmployeeRequirement, TrainingSession, User, RacDef, 
  BookingStatus, Employee, SystemNotification 
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
const LogsPage = lazy(() => import('./pages/LogsPage'));
const ProjectProposal = lazy(() => import('./pages/ProjectProposal'));
const PresentationPage = lazy(() => import('./pages/PresentationPage'));
const AlcoholIntegration = lazy(() => import('./pages/AlcoholIntegration'));
const VerificationPage = lazy(() => import('./pages/VerificationPage'));

const App: React.FC = () => {
  // --- State Management ---
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // Data
  const [sessions, setSessions] = useState<TrainingSession[]>(MOCK_SESSIONS);
  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>(INITIAL_RAC_DEFINITIONS);
  
  // Users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'System Admin', email: 'admin@vulcan.com', role: UserRole.SYSTEM_ADMIN, status: 'Active', company: 'Vulcan Mining' },
    { id: 2, name: 'John Doe', email: 'john@vulcan.com', role: UserRole.RAC_TRAINER, status: 'Active', company: 'Vulcan Mining' },
  ]);

  // Bookings & Employees (Mock Data)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>([]);

  // Initialize some mock data if empty
  useEffect(() => {
    if (bookings.length === 0) {
        // ... (Mock Generation Code logic remains identical to previous successful state, omitted for brevity but preserved in principle)
        // Re-injecting the exact "Perfect Batch" logic from previous context to ensure no data loss:
        const generatedBookings: Booking[] = [];
        const generatedRequirements: EmployeeRequirement[] = [];
        const createEmp = (i: number): Employee => ({
            id: `emp-${i}`, name: `Employee ${i}`, recordId: `VUL-${1000 + i}`,
            company: COMPANIES[i % COMPANIES.length], department: DEPARTMENTS[i % DEPARTMENTS.length], role: ROLES[i % ROLES.length],
            driverLicenseNumber: i <= 8 ? `DL-${1000+i}` : undefined, driverLicenseClass: i <= 8 ? 'C1' : undefined, driverLicenseExpiry: i <= 8 ? '2026-01-01' : undefined, isActive: true
        });
        for (let i = 1; i <= 20; i++) {
            const emp = createEmp(i);
            const isPerfectBatch = i <= 8;
            if (isPerfectBatch) {
                generatedBookings.push({ id: uuidv4(), sessionId: 'S001', employee: emp, status: BookingStatus.PASSED, attendance: true, theoryScore: 90 + i, resultDate: '2023-11-01', expiryDate: '2025-11-01' });
                generatedBookings.push({ id: uuidv4(), sessionId: 'S002', employee: emp, status: BookingStatus.PASSED, attendance: true, theoryScore: 88, practicalScore: 92, driverLicenseVerified: true, resultDate: '2023-11-05', expiryDate: '2025-11-05' });
                generatedBookings.push({ id: uuidv4(), sessionId: 'PTS - Operational Training', employee: emp, status: BookingStatus.PASSED, attendance: true, resultDate: '2024-01-10', expiryDate: '2026-01-10' });
                generatedBookings.push({ id: uuidv4(), sessionId: 'ART - Analysis Training', employee: emp, status: BookingStatus.PASSED, attendance: true, resultDate: '2024-02-15', expiryDate: '2026-02-15' });
                generatedRequirements.push({ employeeId: emp.id, asoExpiryDate: '2026-06-01', requiredRacs: { 'RAC01': true, 'RAC02': true, 'PTS': true, 'ART': true, 'EXEC_CRED': true, 'EMIT_PTS': i % 2 === 0 } });
            } else {
                const session = sessions[i % sessions.length];
                generatedBookings.push({ id: uuidv4(), sessionId: session.id, employee: emp, status: i % 5 === 0 ? BookingStatus.PENDING : BookingStatus.PASSED, attendance: i % 5 !== 0, theoryScore: i % 5 !== 0 ? 85 : undefined, resultDate: '2023-11-01', expiryDate: '2025-11-01' });
                generatedRequirements.push({ employeeId: emp.id, asoExpiryDate: '2025-06-01', requiredRacs: { 'RAC01': true } });
            }
        }
        setBookings(generatedBookings);
        setRequirements(generatedRequirements);
    }
  }, []);

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
  }, [bookings, sessions]); // Run when bookings or sessions change

  // --- Handlers ---

  const handleUpdateRacDefinitions = (newDefs: RacDef[]) => {
      setRacDefinitions(newDefs);
  };

  const clearNotifications = () => setNotifications([]);

  const addNotification = (n: SystemNotification) => {
      setNotifications(prev => [n, ...prev]);
  };

  const addBookings = (newBookings: Booking[]) => {
      setBookings(prev => [...prev, ...newBookings]);
  };

  const updateBookings = (updates: Booking[]) => {
      setBookings(prev => prev.map(b => {
          const update = updates.find(u => u.id === b.id);
          return update ? update : b;
      }));
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const importBookings = (newBookings: Booking[]) => {
      setBookings(prev => [...prev, ...newBookings]);
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

  const onImportEmployees = (data: { employee: Employee, req: EmployeeRequirement }[]) => {
      const newBookings: Booking[] = [];
      const newReqs: EmployeeRequirement[] = [];

      data.forEach(({ employee, req }) => {
          const exists = bookings.some(b => b.employee.recordId === employee.recordId);
          if (!exists) {
              newBookings.push({
                  id: uuidv4(),
                  sessionId: 'REGISTRATION',
                  employee: employee,
                  status: BookingStatus.PENDING,
                  isAutoBooked: false
              });
          }
          newReqs.push(req);
      });

      if (newBookings.length > 0) setBookings(prev => [...prev, ...newBookings]);
      
      setRequirements(prev => {
          const merged = [...prev];
          newReqs.forEach(nr => {
              const idx = merged.findIndex(r => r.employeeId === nr.employeeId);
              if (idx >= 0) merged[idx] = nr;
              else merged.push(nr);
          });
          return merged;
      });
  };

  const onApproveAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isAutoBooked: false, status: BookingStatus.PENDING } : b));
  };

  const onRejectAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  return (
    <HashRouter>
      <Layout userRole={userRole} setUserRole={setUserRole} notifications={notifications} clearNotifications={clearNotifications}>
        <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard bookings={bookings} requirements={requirements} sessions={sessions} userRole={userRole} onApproveAutoBooking={onApproveAutoBooking} onRejectAutoBooking={onRejectAutoBooking} />} />
              <Route path="/database" element={<DatabasePage bookings={bookings} requirements={requirements} updateRequirements={updateRequirements} sessions={sessions} onUpdateEmployee={onUpdateEmployee} onDeleteEmployee={onDeleteEmployee} onImportEmployees={onImportEmployees} racDefinitions={racDefinitions} />} />
              <Route path="/reports" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN].includes(userRole) ? <ReportsPage bookings={bookings} sessions={sessions} /> : <Navigate to="/" replace />} />
              <Route path="/booking" element={<BookingForm addBookings={addBookings} sessions={sessions} userRole={userRole} existingBookings={bookings} addNotification={addNotification} />} />
              <Route path="/trainer-input" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole) ? <TrainerInputPage bookings={bookings} updateBookings={updateBookings} sessions={sessions} userRole={userRole} /> : <Navigate to="/" replace />} />
              <Route path="/results" element={<ResultsPage bookings={bookings} updateBookingStatus={updateBookingStatus} importBookings={importBookings} userRole={userRole} sessions={sessions} />} />
              <Route path="/proposal" element={userRole === UserRole.SYSTEM_ADMIN ? <ProjectProposal /> : <Navigate to="/" replace />} />
              <Route path="/presentation" element={userRole === UserRole.SYSTEM_ADMIN ? <PresentationPage /> : <Navigate to="/" replace />} />
              
              <Route path="/request-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <RequestCardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} /> : <Navigate to="/" replace />} />
              <Route path="/print-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} /> : <Navigate to="/" replace />} />
              
              <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} /> : <Navigate to="/" replace />} />
              <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} /> : <Navigate to="/" replace />} />
              <Route path="/settings" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <SettingsPage racDefinitions={racDefinitions} onUpdateRacs={handleUpdateRacDefinitions} /> : <Navigate to="/" replace />} />
              <Route path="/manuals" element={<UserManualsPage />} />
              <Route path="/logs" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <LogsPage /> : <Navigate to="/" replace />} />
              
              {/* New Alcohol Control Module */}
              <Route path="/alcohol-control" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <AlcoholIntegration /> : <Navigate to="/" replace />} />
              
              {/* Public Verification Route - Updated to accept sessions and racDefinitions */}
              <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
        <GeminiAdvisor />
      </Layout>
    </HashRouter>
  );
};

export default App;