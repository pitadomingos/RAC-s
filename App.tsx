
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DatabasePage from './pages/DatabasePage';
import BookingForm from './pages/BookingForm';
import ResultsPage from './pages/ResultsPage';
import RequestCardsPage from './pages/RequestCardsPage';
import ProjectProposal from './pages/ProjectProposal';
import TrainerInputPage from './pages/TrainerInputPage';
import UserManagement from './pages/UserManagement';
import ScheduleTraining from './pages/ScheduleTraining';
import ReportsPage from './pages/ReportsPage';
import GeminiAdvisor from './components/GeminiAdvisor';
import { Booking, BookingStatus, UserRole, EmployeeRequirement } from './types';
import { format, addYears } from 'date-fns';

// Initial Mock Data Loading with 3 distinct companies
const initialBookings: Booking[] = [
  // Vulcan Mining Employees
  {
    id: 'b1',
    sessionId: 'RAC01 - Working at Height',
    employee: {
      id: 'e1', name: 'Antonio Silva', recordId: '12345678', company: 'Vulcan Mining', 
      department: 'Plant Maintenance', role: 'Technician', ga: 'MNT'
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
      department: 'Mine Operations', role: 'Operator', ga: 'OPS'
    },
    status: BookingStatus.PASSED,
    resultDate: '2023-06-20',
    expiryDate: '2025-06-20',
    theoryScore: 90,
    practicalScore: 95,
    attendance: true
  },
  
  // Global Logistics Employees
  {
    id: 'b3',
    sessionId: 'RAC05 - Confined Space',
    employee: {
      id: 'e3', name: 'Maria Santos', recordId: 'GL-1002', company: 'Global Logistics', 
      department: 'Logistics', role: 'Driver', ga: 'LOG'
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
      department: 'Logistics', role: 'Supervisor', ga: 'LOG'
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
      department: 'HSE', role: 'Electrician', ga: 'ENG'
    },
    status: BookingStatus.FAILED,
    resultDate: '2023-11-05',
    theoryScore: 45,
    attendance: true
  },
  // Add a booking linked to a specific session ID (S005 from constants) to show capacity working
  {
    id: 'b6',
    sessionId: 'S005', // Linked to 'RAC02 - Vehicles' on 2024-05-22
    employee: {
      id: 'e6', name: 'Demo User', recordId: 'DEMO-001', company: 'Vulcan Mining', 
      department: 'HSE', role: 'General Helper', ga: 'HSE'
    },
    status: BookingStatus.PENDING,
    attendance: false
  }
];

// Mock Requirements corresponding to the employees above
const initialRequirements: EmployeeRequirement[] = [
  { 
    employeeId: 'e1', 
    asoExpiryDate: '2025-06-01', 
    requiredRacs: { 'RAC01': true, 'RAC02': false, 'RAC05': true } // Antonio: Has RAC01 (Pass), RAC05 (No). Status: Blocked
  },
  { 
    employeeId: 'e2', 
    asoExpiryDate: '2025-08-15', 
    requiredRacs: { 'RAC02': true } // Carlos: Has RAC02 (Pass). Status: Granted
  },
  { 
    employeeId: 'e3', 
    asoExpiryDate: '2024-01-01', // Expired ASO
    requiredRacs: { 'RAC05': true } 
  },
  { 
    employeeId: 'e4', 
    asoExpiryDate: '2025-12-31', 
    requiredRacs: { 'RAC01': true } // John: Has RAC01 (Pass). Status: Granted
  },
  { 
    employeeId: 'e5', 
    asoExpiryDate: '2025-05-20', 
    requiredRacs: { 'RAC08': true } // Lucas: Failed RAC08. Status: Blocked
  },
  { 
    employeeId: 'e6', 
    asoExpiryDate: '2025-11-11', 
    requiredRacs: { 'RAC02': true, 'RAC01': true } 
  }
];

const App: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>(initialRequirements);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);

  // Handler to add new bookings
  const handleAddBookings = (newBookings: Booking[]) => {
    setBookings(prev => [...prev, ...newBookings]);
  };

  // Handler to update requirements (Database Page)
  const handleUpdateRequirement = (updatedReq: EmployeeRequirement) => {
    setRequirements(prev => {
      const exists = prev.find(r => r.employeeId === updatedReq.employeeId);
      if (exists) {
        return prev.map(r => r.employeeId === updatedReq.employeeId ? updatedReq : r);
      }
      return [...prev, updatedReq];
    });
  };

  // Handler to update status (Single item override)
  // Kept if needed by system internals, though UI override is removed
  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const updates: Partial<Booking> = { status };
        
        // If passed, set expiry date automatically (2 years)
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

  // Bulk update handler for Trainers
  const handleBulkUpdate = (updatedSessionBookings: Booking[]) => {
    setBookings(prev => {
      const newBookings = [...prev];
      updatedSessionBookings.forEach(updatedBooking => {
        const index = newBookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
            // Apply logic: If status becomes passed, ensure dates are set
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
    <HashRouter>
      <Layout userRole={userRole} setUserRole={setUserRole}>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              bookings={bookings} 
              requirements={requirements} 
              userRole={userRole} 
            />
          } />
          
          <Route path="/database" element={
             <DatabasePage 
               bookings={bookings} 
               requirements={requirements} 
               updateRequirements={handleUpdateRequirement}
             />
          } />
          
          {/* Admin Only Route */}
          <Route path="/proposal" element={
            userRole === UserRole.SYSTEM_ADMIN 
            ? <ProjectProposal /> 
            : <Navigate to="/" replace />
          } />

          <Route path="/booking" element={<BookingForm addBookings={handleAddBookings} userRole={userRole} />} />
          
          {/* Trainer/Admin Input Route */}
          <Route path="/trainer-input" element={
            [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole)
            ? <TrainerInputPage bookings={bookings} updateBookings={handleBulkUpdate} />
            : <Navigate to="/" replace />
          } />

          {/* Records View (General Access) */}
          <Route path="/results" element={
            <ResultsPage 
              bookings={bookings} 
              updateBookingStatus={handleUpdateStatus} 
              userRole={userRole} 
            />
          } />
          
          {/* Reports Page */}
          <Route path="/reports" element={
            [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN].includes(userRole)
            ? <ReportsPage bookings={bookings} />
            : <Navigate to="/" replace />
          } />

          {/* Request Cards (Previously Print) */}
          <Route path="/request-cards" element={
             [UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole)
             ? <RequestCardsPage bookings={bookings} />
             : <Navigate to="/" replace />
          } />

          {/* User Management (Admin) */}
          <Route path="/users" element={
            userRole === UserRole.SYSTEM_ADMIN 
            ? <UserManagement /> 
            : <Navigate to="/" replace />
          } />

          {/* Schedule Training (RAC Admin) */}
           <Route path="/schedule" element={
            [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole)
            ? <ScheduleTraining /> 
            : <Navigate to="/" replace />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <GeminiAdvisor />
      </Layout>
    </HashRouter>
  );
};

export default App;
