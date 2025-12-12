
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GeminiAdvisor from './components/GeminiAdvisor';
import { 
  UserRole, Booking, EmployeeRequirement, TrainingSession, User, RacDef, 
  BookingStatus, Employee, SystemNotification, Room, Trainer
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
const TechnicalDocs = lazy(() => import('./pages/TechnicalDocs'));

const App: React.FC = () => {
  // --- State Management ---
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // Simulated logged-in user for self-service
  const currentEmployeeId = 'emp-1';

  // Data
  const [sessions, setSessions] = useState<TrainingSession[]>(MOCK_SESSIONS);
  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>(INITIAL_RAC_DEFINITIONS);
  const [rooms, setRooms] = useState<Room[]>([
      { id: '1', name: 'Room A', capacity: 20 },
      { id: '2', name: 'Room B', capacity: 30 },
      { id: '3', name: 'Field Training Area', capacity: 15 },
      { id: '4', name: 'Computer Lab', capacity: 12 },
  ]);
  const [trainers, setTrainers] = useState<Trainer[]>([
      { id: '1', name: 'John Doe', racs: ['RAC01', 'RAC05'] },
      { id: '2', name: 'Jane Smith', racs: ['RAC02', 'RAC04'] },
      { id: '3', name: 'Mike Brown', racs: ['RAC08', 'RAC10'] },
      { id: '4', name: 'Sarah Connor', racs: ['RAC08'] },
  ]);
  
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
        const generatedBookings: Booking[] = [];
        const generatedRequirements: EmployeeRequirement[] = [];
        
        // 1. Create 8 FULLY GRANTED Employees (Perfect Batch)
        for (let i = 1; i <= 8; i++) {
            const empId = `emp-${i}`;
            const employee: Employee = {
                id: empId,
                name: `Safe Worker ${i}`,
                recordId: `VUL-${1000 + i}`,
                company: COMPANIES[i % COMPANIES.length],
                department: DEPARTMENTS[i % DEPARTMENTS.length],
                role: ROLES[i % ROLES.length],
                driverLicenseNumber: `DL-${202400 + i}`,
                driverLicenseClass: 'C1',
                driverLicenseExpiry: '2030-01-01', // Future Date
                isActive: true
            };

            // Requirements: Standard RACs + New Operational Trainings (treated as RACs)
            generatedRequirements.push({
                employeeId: empId,
                asoExpiryDate: '2030-06-01', // Valid ASO
                requiredRacs: { 
                    'RAC01': true, 
                    'RAC02': true,
                    'PTS': true,     // Critical Ops Training
                    'ART': true,     // Critical Ops Training
                    'LIB_OPS': true, // Critical Ops Training
                    'LIB_MOV': true  // Critical Ops Training
                }
            });

            // Booking 1: RAC 01 (Passed, Valid)
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S001', // Mapped to RAC01 in constants
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                theoryScore: 95,
                resultDate: '2024-01-15',
                expiryDate: '2026-01-15'
            });

            // Booking 2: RAC 02 (Passed, Valid, DL Verified)
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S002', // Mapped to RAC02 in constants
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                theoryScore: 90,
                practicalScore: 95,
                driverLicenseVerified: true,
                resultDate: '2024-02-20',
                expiryDate: '2026-02-20'
            });

            // Booking 3: PTS (Ops) - Valid 2 Years
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'PTS - Permit To Work',
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                resultDate: '2024-03-01',
                expiryDate: '2026-03-01'
            });

            // Booking 4: ART (Ops) - Valid 2 Years
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'ART - Análise de Risco',
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                resultDate: '2024-03-05',
                expiryDate: '2026-03-05'
            });

            // Booking 5: LIB_OPS (Ops) - Valid 2 Years
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'LIB_OPS - Liberação Operacional',
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                resultDate: '2024-03-10',
                expiryDate: '2026-03-10'
            });

            // Booking 6: LIB_MOV (Ops) - Valid 2 Years
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'LIB_MOV - Liberação de Movimentação',
                employee: { ...employee },
                status: BookingStatus.PASSED,
                attendance: true,
                resultDate: '2024-03-12',
                expiryDate: '2026-03-12'
            });
        }

        // 2. Create Mixed/Expired Employees
        for (let i = 9; i <= 20; i++) {
            const empId = `emp-${i}`;
            const employee: Employee = {
                id: empId,
                name: `Employee ${i}`,
                recordId: `VUL-${1000 + i}`,
                company: COMPANIES[i % COMPANIES.length],
                department: DEPARTMENTS[i % DEPARTMENTS.length],
                role: ROLES[i % ROLES.length],
                isActive: true
            };

            const isExpiredAso = i % 3 === 0;
            
            generatedRequirements.push({
                employeeId: empId,
                asoExpiryDate: isExpiredAso ? '2023-01-01' : '2030-01-01',
                requiredRacs: { 'RAC01': true }
            });

            // Booking: Either Pending or Expired
            generatedBookings.push({
                id: uuidv4(),
                sessionId: 'S006', // RAC01
                employee: { ...employee },
                status: i % 2 === 0 ? BookingStatus.PENDING : BookingStatus.PASSED,
                attendance: i % 2 !== 0,
                theoryScore: i % 2 !== 0 ? 80 : undefined,
                resultDate: '2022-01-01',
                expiryDate: '2023-01-01' // Expired
            });

            // DEMO SPECIFIC: Add a Pending RAC02 Booking for Employee 9 to test DL Verification
            if (i === 9) {
                generatedBookings.push({
                    id: uuidv4(),
                    sessionId: 'S012', // RAC02 - Jane Smith (Pending)
                    employee: { ...employee, driverLicenseNumber: 'DL-TEST-999', driverLicenseClass: 'C', driverLicenseExpiry: '2026-01-01' },
                    status: BookingStatus.PENDING,
                    attendance: false,
                    driverLicenseVerified: false
                });
                
                // Update requirement to require RAC02
                const reqIdx = generatedRequirements.findIndex(r => r.employeeId === empId);
                if (reqIdx >= 0) {
                    generatedRequirements[reqIdx].requiredRacs['RAC02'] = true;
                }
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
              {/* Dashboard is RESTRICTED for General User */}
              <Route path="/" element={
                  userRole === UserRole.USER 
                    ? <Navigate to="/manuals" replace /> 
                    : <Dashboard bookings={bookings} requirements={requirements} sessions={sessions} userRole={userRole} onApproveAutoBooking={onApproveAutoBooking} onRejectAutoBooking={onRejectAutoBooking} />
              } />
              
              {/* Database is RESTRICTED for General User and RAC Trainer */}
              <Route path="/database" element={
                  (userRole === UserRole.USER || userRole === UserRole.RAC_TRAINER)
                    ? <Navigate to="/manuals" replace />
                    : <DatabasePage bookings={bookings} requirements={requirements} updateRequirements={updateRequirements} sessions={sessions} onUpdateEmployee={onUpdateEmployee} onDeleteEmployee={onDeleteEmployee} onImportEmployees={onImportEmployees} racDefinitions={racDefinitions} />
              } />
              
              {/* Reports is RESTRICTED for RAC Trainer */}
              <Route path="/reports" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.DEPT_ADMIN].includes(userRole) ? <ReportsPage bookings={bookings} sessions={sessions} /> : <Navigate to="/" replace />} />
              
              {/* Booking is RESTRICTED for RAC Trainer */}
              <Route path="/booking" element={userRole === UserRole.RAC_TRAINER ? <Navigate to="/" replace /> : <BookingForm addBookings={addBookings} sessions={sessions} userRole={userRole} existingBookings={bookings} addNotification={addNotification} currentEmployeeId={currentEmployeeId} />} />
              
              <Route path="/trainer-input" element={
                  [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole) 
                  ? <TrainerInputPage 
                      bookings={bookings} 
                      updateBookings={updateBookings} 
                      sessions={sessions} 
                      userRole={userRole} 
                      currentUserName={userRole === UserRole.RAC_TRAINER ? 'John Doe' : 'System Admin'} 
                    /> 
                  : <Navigate to="/" replace />
              } />
              
              {/* Results is RESTRICTED for RAC Trainer. Pass currentEmployeeId to limit view for USER. */}
              <Route path="/results" element={userRole === UserRole.RAC_TRAINER ? <Navigate to="/" replace /> : <ResultsPage bookings={bookings} updateBookingStatus={updateBookingStatus} importBookings={importBookings} userRole={userRole} sessions={sessions} currentEmployeeId={currentEmployeeId} />} />
              
              <Route path="/proposal" element={userRole === UserRole.SYSTEM_ADMIN ? <ProjectProposal /> : <Navigate to="/" replace />} />
              <Route path="/presentation" element={userRole === UserRole.SYSTEM_ADMIN ? <PresentationPage /> : <Navigate to="/" replace />} />
              
              {/* Technical Docs: System Admin Only */}
              <Route path="/tech-docs" element={userRole === UserRole.SYSTEM_ADMIN ? <TechnicalDocs /> : <Navigate to="/" replace />} />
              
              {/* Pass currentEmployeeId for Self-Service */}
              <Route path="/request-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <RequestCardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={userRole} currentEmployeeId={currentEmployeeId} /> : <Navigate to="/" replace />} />
              
              <Route path="/print-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} /> : <Navigate to="/" replace />} />
              
              <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} /> : <Navigate to="/" replace />} />
              <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} /> : <Navigate to="/" replace />} />
              <Route path="/settings" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <SettingsPage racDefinitions={racDefinitions} onUpdateRacs={handleUpdateRacDefinitions} rooms={rooms} onUpdateRooms={setRooms} trainers={trainers} onUpdateTrainers={setTrainers} /> : <Navigate to="/" replace />} />
              <Route path="/manuals" element={<UserManualsPage userRole={userRole} />} />
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
