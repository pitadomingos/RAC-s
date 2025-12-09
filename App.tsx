
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DatabasePage from './pages/DatabasePage';
import BookingForm from './pages/BookingForm';
import ResultsPage from './pages/ResultsPage';
import CardsPage from './pages/CardsPage'; // Print View
import RequestCardsPage from './pages/RequestCardsPage'; // Request View
import ProjectProposal from './pages/ProjectProposal';
import TrainerInputPage from './pages/TrainerInputPage';
import UserManagement from './pages/UserManagement';
import ScheduleTraining from './pages/ScheduleTraining';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import UserManualsPage from './pages/UserManualsPage';
import LogsPage from './pages/LogsPage'; 
import GeminiAdvisor from './components/GeminiAdvisor';
// REMOVED LanguageProvider import, using hook instead
import { useLanguage } from './contexts/LanguageContext';
import { Booking, BookingStatus, UserRole, EmployeeRequirement, SystemNotification, TrainingSession, User } from './types';
import { format, addYears, differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_SESSIONS, RAC_KEYS } from './constants';

// Initial Mock Data Loading with 3 distinct companies
const initialBookings: Booking[] = [
  // Vulcan Mining Employees
  {
    id: 'b1',
    sessionId: 'RAC01 - Working at Height',
    employee: {
      id: 'e1', name: 'Antonio Silva', recordId: '12345678', company: 'Vulcan Mining', 
      department: 'Plant Maintenance', role: 'Technician'
    },
    status: BookingStatus.PASSED,
    resultDate: '2023-01-15',
    expiryDate: '2025-01-15',
    theoryScore: 85,
    attendance: true
  },
  {
    id: 'b2',
    sessionId: 'RAC02 - Vehicles',
    employee: {
      id: 'e2', name: 'Carlos Mendez', recordId: 'VUL-9988', company: 'Vulcan Mining', 
      department: 'Mine Operations', role: 'Operator',
      driverLicenseNumber: 'DL-55291-AZ', driverLicenseClass: 'C+E', driverLicenseExpiry: '2025-08-01'
    },
    status: BookingStatus.PASSED,
    resultDate: '2023-06-20',
    expiryDate: '2025-06-20',
    theoryScore: 90,
    practicalScore: 95,
    attendance: true,
    driverLicenseVerified: true
  },
  // Global Logistics Employees
  {
    id: 'b3',
    sessionId: 'RAC05 - Confined Space',
    employee: {
      id: 'e3', name: 'Maria Santos', recordId: 'GL-1002', company: 'Global Logistics', 
      department: 'Logistics', role: 'Driver',
      driverLicenseNumber: 'DL-112233', driverLicenseClass: 'B', driverLicenseExpiry: '2022-01-01' // Expired DL
    },
    status: BookingStatus.PENDING,
    theoryScore: 0,
    attendance: false
  },
  {
    id: 'b4',
    sessionId: 'RAC01 - Working at Height',
    employee: {
      id: 'e4', name: 'John Smith', recordId: 'GL-5541', company: 'Global Logistics', 
      department: 'Logistics', role: 'Supervisor'
    },
    status: BookingStatus.PASSED,
    resultDate: '2023-03-10',
    expiryDate: '2025-03-10',
    theoryScore: 88,
    attendance: true
  },
  // Safety First Contractors Employees
  {
    id: 'b5',
    sessionId: 'RAC08 - Electricity',
    employee: {
      id: 'e5', name: 'Lucas Oliveira', recordId: 'SF-2023', company: 'Safety First Contractors', 
      department: 'HSE', role: 'Electrician'
    },
    status: BookingStatus.FAILED,
    resultDate: '2023-11-05',
    theoryScore: 45,
    attendance: true
  },
  {
    id: 'b6',
    sessionId: 'S005', // Linked to 'RAC02 - Vehicles'
    employee: {
      id: 'e6', name: 'Demo User', recordId: 'DEMO-001', company: 'Vulcan Mining', 
      department: 'HSE', role: 'General Helper'
    },
    status: BookingStatus.PENDING,
    attendance: false
  },
  // Expiring Employee for Demo
  {
    id: 'b7',
    sessionId: 'RAC01 - Working at Height',
    employee: {
      id: 'e7', name: 'Expiring User', recordId: 'EXP-999', company: 'Vulcan Mining', 
      department: 'Mine Operations', role: 'Operator'
    },
    status: BookingStatus.PASSED,
    resultDate: '2022-01-01',
    expiryDate: format(new Date(Date.now() + 86400000 * 5), 'yyyy-MM-dd'), // Expires in 5 days
    theoryScore: 90,
    attendance: true
  },
   {
    id: 'b8',
    sessionId: 'RAC05 - Confined Space',
    employee: {
      id: 'e8', name: 'Warning User', recordId: 'WARN-888', company: 'Vulcan Mining', 
      department: 'Logistics', role: 'Technician'
    },
    status: BookingStatus.PASSED,
    resultDate: '2022-01-01',
    expiryDate: format(new Date(Date.now() + 86400000 * 25), 'yyyy-MM-dd'), // Expires in 25 days
    theoryScore: 90,
    attendance: true
  }
];

// Mock Requirements
const initialRequirements: EmployeeRequirement[] = [
  { 
    employeeId: 'e1', 
    asoExpiryDate: '2025-06-01', 
    requiredRacs: { 'RAC01': true, 'RAC02': false, 'RAC05': true }
  },
  { 
    employeeId: 'e2', 
    asoExpiryDate: '2025-08-15', 
    requiredRacs: { 'RAC02': true }
  },
  { 
    employeeId: 'e3', 
    asoExpiryDate: '2024-01-01', 
    requiredRacs: { 'RAC05': true, 'RAC02': true } // RAC02 required but DL expired
  },
  { 
    employeeId: 'e4', 
    asoExpiryDate: '2025-12-31', 
    requiredRacs: { 'RAC01': true }
  },
  { 
    employeeId: 'e5', 
    asoExpiryDate: '2025-05-20', 
    requiredRacs: { 'RAC08': true }
  },
  { 
    employeeId: 'e6', 
    asoExpiryDate: '2025-11-11', 
    requiredRacs: { 'RAC02': true, 'RAC01': true } 
  },
  { 
    employeeId: 'e7', 
    asoExpiryDate: '2026-01-01', 
    requiredRacs: { 'RAC01': true } 
  },
  { 
    employeeId: 'e8', 
    asoExpiryDate: '2026-01-01', 
    requiredRacs: { 'RAC05': true } 
  }
];

const initialUsers: User[] = [
    { id: 1, name: 'System Admin', email: 'admin@vulcan.com', role: UserRole.SYSTEM_ADMIN, status: 'Active' },
    { id: 2, name: 'Sarah Connor', email: 'sarah.c@vulcan.com', role: UserRole.RAC_ADMIN, status: 'Active' },
    { id: 3, name: 'John Doe', email: 'john.d@vulcan.com', role: UserRole.RAC_TRAINER, status: 'Active' },
    { id: 4, name: 'Ellen Ripley', email: 'e.ripley@vulcan.com', role: UserRole.DEPT_ADMIN, status: 'Active' },
    { id: 5, name: 'Regular User', email: 'user@vulcan.com', role: UserRole.USER, status: 'Inactive' },
];

const App: React.FC = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>(initialRequirements);
  const [sessions, setSessions] = useState<TrainingSession[]>(MOCK_SESSIONS);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Derive current user based on selected role for simulation
  const currentUser = users.find(u => u.role === userRole) || users[0];

  useEffect(() => {
    runDailyComplianceCheck();
  }, []);

  const addNotification = (type: 'info' | 'warning' | 'success' | 'alert', title: string, message: string) => {
    setNotifications(prev => [
        { id: uuidv4(), type, title, message, timestamp: new Date(), isRead: false },
        ...prev
    ]);
  };

  const runDailyComplianceCheck = () => {
    const today = new Date();
    
    let newAutoBookings: Booking[] = [];

    requirements.forEach(req => {
        const empId = req.employeeId;
        const employeeBookingRef = bookings.find(b => b.employee.id === empId); 
        if (!employeeBookingRef) return;

        const employee = employeeBookingRef.employee;

        RAC_KEYS.forEach(racKey => {
            if (req.requiredRacs[racKey]) {
                const relevantBookings = bookings.filter(b => {
                    const sessionRac = getRacKeyFromSessionId(b.sessionId);
                    return b.employee.id === empId && b.status === BookingStatus.PASSED && sessionRac === racKey;
                });

                const latestBooking = relevantBookings.sort((a, b) => 
                    new Date(b.expiryDate || '1970-01-01').getTime() - new Date(a.expiryDate || '1970-01-01').getTime()
                )[0];

                if (latestBooking && latestBooking.expiryDate) {
                    const expiry = new Date(latestBooking.expiryDate);
                    const daysToExpiry = differenceInDays(expiry, today);

                    if (daysToExpiry <= 30 && daysToExpiry > 7) {
                        const alreadyNotified = notifications.some(n => n.message.includes(employee.name) && n.message.includes('expires in'));
                        if (!alreadyNotified) {
                            addNotification('warning', t.notifications.expiryTitle, 
                                t.notifications.expiryMsg
                                    .replace('{name}', employee.name)
                                    .replace('{rac}', racKey)
                                    .replace('{days}', String(daysToExpiry))
                            );
                        }
                    }

                    if (daysToExpiry <= 7) {
                        const hasPending = bookings.some(b => {
                            const sessionRac = getRacKeyFromSessionId(b.sessionId);
                            const isFuture = b.resultDate ? new Date(b.resultDate) > today : true; 
                            return b.employee.id === empId && 
                                   b.status === BookingStatus.PENDING && 
                                   sessionRac === racKey &&
                                   isFuture;
                        });

                        if (!hasPending) {
                            const nextSession = sessions
                                .filter(s => getRacKeyFromSessionId(s.racType) === racKey && new Date(s.date) > today)
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

                            if (nextSession) {
                                const newBooking: Booking = {
                                    id: uuidv4(),
                                    sessionId: nextSession.id,
                                    employee: { ...employee },
                                    status: BookingStatus.PENDING,
                                    attendance: false,
                                    theoryScore: 0
                                };
                                newAutoBookings.push(newBooking);
                                addNotification('success', t.notifications.autoBookTitle, 
                                    t.notifications.autoBookMsg
                                        .replace('{name}', employee.name)
                                        .replace('{days}', String(daysToExpiry))
                                        .replace('{date}', nextSession.date)
                                );
                            } else {
                                const alreadyAlerted = notifications.some(n => n.message.includes(employee.name) && n.message.includes('Could not auto-book'));
                                if (!alreadyAlerted) {
                                    addNotification('alert', t.notifications.autoBookFailTitle, 
                                        t.notifications.autoBookFailMsg
                                            .replace('{name}', employee.name)
                                            .replace('{rac}', racKey)
                                    );
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    if (newAutoBookings.length > 0) {
        handleAddBookings(newAutoBookings);
    }
  };

  const getRacKeyFromSessionId = (sessionId: string) => {
     if (sessionId.includes('RAC 01') || sessionId.includes('RAC01')) return 'RAC01';
     if (sessionId.includes('RAC 02') || sessionId.includes('RAC02')) return 'RAC02';
     if (sessionId.includes('RAC 03') || sessionId.includes('RAC03')) return 'RAC03';
     if (sessionId.includes('RAC 04') || sessionId.includes('RAC04')) return 'RAC04';
     if (sessionId.includes('RAC 05') || sessionId.includes('RAC05')) return 'RAC05';
     if (sessionId.includes('RAC 06') || sessionId.includes('RAC06')) return 'RAC06';
     if (sessionId.includes('RAC 07') || sessionId.includes('RAC07')) return 'RAC07';
     if (sessionId.includes('RAC 08') || sessionId.includes('RAC08')) return 'RAC08';
     if (sessionId.includes('RAC 09') || sessionId.includes('RAC09')) return 'RAC09';
     if (sessionId.includes('RAC 10') || sessionId.includes('RAC10')) return 'RAC10';
     return '';
  };

  const handleAddBookings = (newBookings: Booking[]) => {
    setBookings(prev => [...prev, ...newBookings]);
  };

  const handleUpdateRequirement = (updatedReq: EmployeeRequirement) => {
    setRequirements(prev => {
      const exists = prev.find(r => r.employeeId === updatedReq.employeeId);
      if (exists) {
        return prev.map(r => r.employeeId === updatedReq.employeeId ? updatedReq : r);
      }
      return [...prev, updatedReq];
    });
  };

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const updates: Partial<Booking> = { status };
        if (status === BookingStatus.PASSED) {
          const now = new Date();
          updates.resultDate = format(now, 'yyyy-MM-dd');
          updates.expiryDate = format(addYears(now, 2), 'yyyy-MM-dd');
        }
        return { ...b, ...updates };
      }
      return b;
    }));
  };

  const handleBulkUpdate = (updatedSessionBookings: Booking[]) => {
    setBookings(prev => {
      const newBookings = [...prev];
      updatedSessionBookings.forEach(updatedBooking => {
        const index = newBookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
            if (updatedBooking.status === BookingStatus.PASSED && newBookings[index].status !== BookingStatus.PASSED) {
                const now = new Date();
                updatedBooking.resultDate = format(now, 'yyyy-MM-dd');
                updatedBooking.expiryDate = format(addYears(now, 2), 'yyyy-MM-dd');
            }
            newBookings[index] = updatedBooking;
        }
      });
      return newBookings;
    });
  };

  return (
    // LanguageProvider removed here as it wraps App in index.tsx
    <HashRouter>
      <Layout 
        userRole={userRole} 
        setUserRole={setUserRole} 
        notifications={notifications}
        clearNotifications={() => setNotifications([])}
      >
        <Routes>
          <Route path="/" element={<Dashboard bookings={bookings} requirements={requirements} sessions={sessions} userRole={userRole} />} />
          <Route path="/database" element={<DatabasePage bookings={bookings} requirements={requirements} updateRequirements={handleUpdateRequirement} sessions={sessions} />} />
          <Route path="/proposal" element={userRole === UserRole.SYSTEM_ADMIN ? <ProjectProposal /> : <Navigate to="/" replace />} />
          <Route path="/booking" element={<BookingForm addBookings={handleAddBookings} sessions={sessions} userRole={userRole} />} />
          <Route path="/trainer-input" element={
              [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole) 
              ? <TrainerInputPage bookings={bookings} updateBookings={handleBulkUpdate} sessions={sessions} userRole={userRole} currentUserName={currentUser.name} /> 
              : <Navigate to="/" replace />
            } 
          />
          <Route path="/results" element={<ResultsPage bookings={bookings} updateBookingStatus={handleUpdateStatus} importBookings={handleAddBookings} userRole={userRole} sessions={sessions} />} />
          <Route path="/reports" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN].includes(userRole) ? <ReportsPage bookings={bookings} sessions={sessions} /> : <Navigate to="/" replace />} />
          
          <Route path="/request-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <RequestCardsPage bookings={bookings} requirements={requirements} /> : <Navigate to="/" replace />} />
          <Route path="/print-cards" element={[UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) ? <CardsPage bookings={bookings} requirements={requirements} /> : <Navigate to="/" replace />} />
          
          <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} /> : <Navigate to="/" replace />} />
          <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <SettingsPage /> : <Navigate to="/" replace />} />
          <Route path="/manuals" element={<UserManualsPage />} />
          <Route path="/logs" element={[UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) ? <LogsPage /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <GeminiAdvisor />
      </Layout>
    </HashRouter>
  );
};

export default App;
