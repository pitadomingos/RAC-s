
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import SiteGovernancePage from './pages/SiteGovernancePage';
import DatabasePage from './pages/DatabasePage';
import ReportsPage from './pages/ReportsPage';
import BookingForm from './pages/BookingForm';
import TrainerInputPage from './pages/TrainerInputPage';
import ResultsPage from './pages/ResultsPage';
import UserManagement from './pages/UserManagement';
import ScheduleTraining from './pages/ScheduleTraining';
import SettingsPage from './pages/SettingsPage';
import RequestCardsPage from './pages/RequestCardsPage';
import CardsPage from './pages/CardsPage';
import VerificationPage from './pages/VerificationPage';
import UserManualsPage from './pages/UserManualsPage';
import AdminManualPage from './pages/AdminManualPage';
import LogsPage from './pages/LogsPage';
import ProjectProposal from './pages/ProjectProposal';
import PresentationPage from './pages/PresentationPage';
import AlcoholIntegration from './pages/AlcoholIntegration';
import TechnicalDocs from './pages/TechnicalDocs';
import FeedbackAdminPage from './pages/FeedbackAdminPage';
import MessageLogPage from './pages/MessageLogPage';
import GeminiAdvisor from './components/GeminiAdvisor';
import FeedbackModal from './components/FeedbackModal';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { MessageProvider } from './contexts/MessageContext';
import { UserRole, Booking, EmployeeRequirement, TrainingSession, RacDef, Room, Trainer, Site, Company, User, SystemNotification, Employee, Feedback, FeedbackType, BookingStatus } from './types';
import { MOCK_SESSIONS, INITIAL_RAC_DEFINITIONS, MOCK_BOOKINGS, MOCK_REQUIREMENTS, MOCK_FEEDBACK, RAW_HR_SOURCE, RAW_CONTRACTOR_SOURCE } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquarePlus } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);
  // NEW: State for Granular Access Simulation
  const [simulatedJobTitle, setSimulatedJobTitle] = useState('HSE Manager');
  const [simulatedDept, setSimulatedDept] = useState('HSE');

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // --- PERSISTENT STATE INITIALIZATION ---
  const [bookings, setBookings] = useState<Booking[]>(() => {
      const saved = localStorage.getItem('cars_bookings');
      return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });
  
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>(() => {
      const saved = localStorage.getItem('cars_requirements');
      return saved ? JSON.parse(saved) : MOCK_REQUIREMENTS;
  });

  const [sessions, setSessions] = useState<TrainingSession[]>(() => {
      const saved = localStorage.getItem('cars_sessions');
      return saved ? JSON.parse(saved) : MOCK_SESSIONS;
  });

  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>(() => {
      const saved = localStorage.getItem('cars_rac_defs');
      return saved ? JSON.parse(saved) : INITIAL_RAC_DEFINITIONS;
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
      localStorage.setItem('cars_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
      localStorage.setItem('cars_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
      localStorage.setItem('cars_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
      localStorage.setItem('cars_rac_defs', JSON.stringify(racDefinitions));
  }, [racDefinitions]);


  const [rooms, setRooms] = useState<Room[]>([{ id: 'r1', name: 'Room A', capacity: 20 }, { id: 'r2', name: 'Room B', capacity: 15 }]);
  const [trainers, setTrainers] = useState<Trainer[]>([{ id: 't1', name: 'John Doe', racs: ['RAC01', 'RAC02'] }]);
  const [sites, setSites] = useState<Site[]>([{ id: 's1', companyId: 'c1', name: 'Moatize Mine', location: 'Tete' }]);
  const [companies, setCompanies] = useState<Company[]>([{ id: 'c1', name: 'Vulcan Mining', status: 'Active' }]);
  const [users, setUsers] = useState<User[]>([
      { id: 1, name: 'System Admin', email: 'admin@vulcan.com', role: UserRole.SYSTEM_ADMIN, status: 'Active', company: 'Vulcan Mining', jobTitle: 'IT Manager' }
  ]);
  const [currentSiteId, setCurrentSiteId] = useState<string>('all');

  // --- FEEDBACK SYSTEM STATE ---
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(MOCK_FEEDBACK);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // Feedback Deployment Configuration
  // Modes: 'disabled', 'always', '1_week', '1_month'
  const [feedbackConfig, setFeedbackConfig] = useState<{mode: string, expiry: string | null}>({
      mode: 'always', 
      expiry: null
  });

  // Computed Property: Is Feedback Currently Active?
  const isFeedbackSystemActive = useMemo(() => {
      if (feedbackConfig.mode === 'disabled') return false;
      if (feedbackConfig.mode === 'always') return true;
      
      // Check expiry for timed modes
      if (feedbackConfig.expiry) {
          const now = new Date();
          const expiryDate = new Date(feedbackConfig.expiry);
          return now < expiryDate;
      }
      
      // Fallback if mode suggests active but no expiry (shouldn't happen with correct logic)
      return false;
  }, [feedbackConfig]);

  const handleUpdateFeedbackConfig = (mode: string) => {
      let expiry = null;
      const now = new Date();
      
      if (mode === '1_week') {
          now.setDate(now.getDate() + 7);
          expiry = now.toISOString();
      } else if (mode === '1_month') {
          now.setMonth(now.getMonth() + 1);
          expiry = now.toISOString();
      }
      
      setFeedbackConfig({ mode, expiry });
  };

  const addNotification = (notif: SystemNotification) => {
      setNotifications(prev => [notif, ...prev]);
  };

  const handleBookingsUpdate = (newBookings: Booking[]) => {
      setBookings(prev => [...prev, ...newBookings]);
  };

  const handleUpdateRequirement = (updatedReq: EmployeeRequirement) => {
      setRequirements(prev => {
          const idx = prev.findIndex(r => r.employeeId === updatedReq.employeeId);
          if (idx >= 0) {
              const newReqs = [...prev];
              newReqs[idx] = updatedReq;
              return newReqs;
          }
          return [...prev, updatedReq];
      });
  };

  // --- MIDDLEWARE SIMULATION ENGINE ---
  const handleMiddlewareSync = () => {
      // 1. Process Source A (HR) - Prefix 'VUL-'
      const processedHR = RAW_HR_SOURCE.map(raw => ({
          id: uuidv4(),
          name: raw.name,
          recordId: `VUL-${raw.id}`, // Middleware Prefix Logic
          company: 'Vulcan Mining',
          department: raw.dept,
          role: raw.role,
          isActive: true,
          siteId: 's1'
      }));

      // 2. Process Source B (Contractor) - Prefix 'CON-'
      const processedCont = RAW_CONTRACTOR_SOURCE.map(raw => ({
          id: uuidv4(),
          name: raw.name,
          recordId: `CON-${raw.id}`, // Middleware Prefix Logic
          company: raw.company,
          department: raw.dept,
          role: raw.role,
          isActive: true,
          siteId: 's1'
      }));

      const allNewEmployees = [...processedHR, ...processedCont];
      const newBookings: Booking[] = [];
      const newReqs: EmployeeRequirement[] = [];

      // 3. Merge into App State
      // We check if recordId already exists to avoid duplicates
      const existingIds = new Set(bookings.map(b => b.employee.recordId));

      allNewEmployees.forEach(emp => {
          if (!existingIds.has(emp.recordId)) {
              // Add a "System Initialization" booking so they appear in the system
              // In a real app, we'd have a separate 'users' table, but here we derive from bookings
              newBookings.push({
                  id: uuidv4(),
                  sessionId: 'System Initialization',
                  employee: emp as Employee,
                  status: BookingStatus.PENDING,
                  attendance: true
              });

              // Add empty requirement
              newReqs.push({
                  employeeId: emp.id,
                  asoExpiryDate: '',
                  requiredRacs: {}
              });
          }
      });

      if (newBookings.length > 0) {
          setBookings(prev => [...prev, ...newBookings]);
          setRequirements(prev => [...prev, ...newReqs]);
          return { added: newBookings.length, msg: `Successfully synced ${newBookings.length} new profiles.` };
      } else {
          return { added: 0, msg: "No new records found in sources." };
      }
  };

  const handleApproveAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isAutoBooked: false } : b));
      addNotification({
          id: uuidv4(),
          type: 'success',
          title: 'Auto-Booking Approved',
          message: 'Booking confirmed for employee.',
          timestamp: new Date(),
          isRead: false
      });
  };

  const handleRejectAutoBooking = (bookingId: string) => {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleUpdateRacDefinitions = (newDefs: RacDef[]) => {
      setRacDefinitions(newDefs);
  };

  const handleUpdateEmployee = (id: string, updates: Partial<Employee>) => {
      setBookings(prev => prev.map(b => 
          b.employee.id === id ? { ...b, employee: { ...b.employee, ...updates } } : b
      ));
  };

  const handleDeleteEmployee = (id: string) => {
      setBookings(prev => prev.filter(b => b.employee.id !== id));
      setRequirements(prev => prev.filter(r => r.employeeId !== id));
  };

  const handleImportBookings = (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => {
      setBookings(prev => [...prev, ...newBookings]);

      if (sideEffects) {
          setRequirements(prev => {
              const newReqs = [...prev];
              sideEffects.forEach(effect => {
                  const idx = newReqs.findIndex(r => r.employeeId === effect.employee.id);
                  if (idx >= 0) {
                      if (effect.aso) newReqs[idx].asoExpiryDate = effect.aso;
                      if (effect.ops) {
                          newReqs[idx].requiredRacs = { ...newReqs[idx].requiredRacs, ...effect.ops };
                      }
                  } else {
                      newReqs.push({
                          employeeId: effect.employee.id,
                          asoExpiryDate: effect.aso || '',
                          requiredRacs: effect.ops || {}
                      });
                  }
              });
              return newReqs;
          });
      }
  };

  const updateBookingsStatus = (updatedBookings: Booking[]) => {
      setBookings(prev => {
          const map = new Map(prev.map(b => [b.id, b]));
          updatedBookings.forEach(b => map.set(b.id, b));
          return Array.from(map.values());
      });
  };

  // --- FEEDBACK HANDLERS ---
  const handleSubmitFeedback = (type: FeedbackType, message: string) => {
      const newFeedback: Feedback = {
          id: uuidv4(),
          userId: 'current-user',
          userName: userRole === UserRole.USER ? 'Safe Worker 1' : 'Admin User', // Mock user name
          type,
          message,
          status: 'New',
          isActionable: type === 'Bug', // Auto-flag bugs as actionable initially
          timestamp: new Date().toISOString()
      };
      setFeedbackList(prev => [newFeedback, ...prev]);
      addNotification({
          id: uuidv4(),
          type: 'success',
          title: 'Feedback Sent',
          message: 'Thank you! Your feedback has been logged.',
          timestamp: new Date(),
          isRead: false
      });
  };

  const handleUpdateFeedback = (id: string, updates: Partial<Feedback>) => {
      setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteFeedback = (id: string) => {
      setFeedbackList(prev => prev.filter(f => f.id !== id));
  };

  const currentEmployeeId = bookings.length > 0 ? bookings[0].employee.id : 'user-123';

  // GRANULAR ACCESS CHECK FUNCTION
  const canViewAlcoholDashboard = () => {
      if (userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.ENTERPRISE_ADMIN) return true;
      const allowedTitles = ['Manager', 'Supervisor', 'Superintendent', 'Director', 'Head'];
      // Ensure simulatedJobTitle is defined
      const jobTitle = simulatedJobTitle || '';
      return allowedTitles.some(t => jobTitle.includes(t));
  };

  return (
    <AdvisorProvider>
      <MessageProvider>
        <Router>
          <Routes>
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="/proposal" element={<ProjectProposal />} />
            <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />
            <Route path="/print-cards" element={<CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={userRole} />} />

            <Route path="*" element={
              <Layout 
                userRole={userRole} 
                setUserRole={setUserRole} 
                notifications={notifications}
                clearNotifications={() => setNotifications([])}
                sites={sites}
                currentSiteId={currentSiteId}
                setCurrentSiteId={setCurrentSiteId}
                simulatedJobTitle={simulatedJobTitle}
                setSimulatedJobTitle={setSimulatedJobTitle}
                simulatedDept={simulatedDept}
                setSimulatedDept={setSimulatedDept}
              >
                <Routes>
                  <Route path="/" element={<Dashboard 
                      bookings={bookings} 
                      requirements={requirements} 
                      sessions={sessions} 
                      userRole={userRole}
                      onApproveAutoBooking={handleApproveAutoBooking}
                      onRejectAutoBooking={handleRejectAutoBooking}
                      racDefinitions={racDefinitions}
                  />} />
                  
                  <Route path="/enterprise-dashboard" element={
                      [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                      ? <EnterpriseDashboard sites={sites} bookings={bookings} requirements={requirements} userRole={userRole} /> 
                      : <Navigate to="/" replace />
                  } />

                  <Route path="/site-governance" element={
                      [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole)
                      ? <SiteGovernancePage 
                          sites={sites} 
                          setSites={setSites} 
                          racDefinitions={racDefinitions} 
                          bookings={bookings} 
                          requirements={requirements} 
                          updateRequirements={handleUpdateRequirement}
                        />
                      : <Navigate to="/" replace />
                  } />

                  <Route path="/database" element={
                      userRole !== UserRole.USER && userRole !== UserRole.RAC_TRAINER 
                      ? <DatabasePage 
                          bookings={bookings} 
                          requirements={requirements} 
                          updateRequirements={handleUpdateRequirement} 
                          sessions={sessions}
                          onUpdateEmployee={handleUpdateEmployee}
                          onDeleteEmployee={handleDeleteEmployee}
                          racDefinitions={racDefinitions}
                          importBookings={handleImportBookings}
                          addNotification={addNotification}
                        /> 
                      : <Navigate to="/" replace />
                  } />

                  <Route path="/reports" element={<ReportsPage bookings={bookings} sessions={sessions} />} />
                  
                  <Route path="/booking" element={<BookingForm 
                      addBookings={handleBookingsUpdate} 
                      sessions={sessions} 
                      userRole={userRole} 
                      existingBookings={bookings}
                      addNotification={addNotification}
                      currentEmployeeId={currentEmployeeId}
                      requirements={requirements}
                      racDefinitions={racDefinitions}
                  />} />
                  
                  <Route path="/trainer-input" element={
                      [UserRole.SYSTEM_ADMIN, UserRole.RAC_TRAINER, UserRole.SITE_ADMIN].includes(userRole) 
                      ? <TrainerInputPage 
                          bookings={bookings} 
                          updateBookings={updateBookingsStatus} 
                          sessions={sessions} 
                          userRole={userRole}
                          currentUserName="Instructor"
                          racDefinitions={racDefinitions}
                        /> 
                      : <Navigate to="/" replace />
                  } />
                  
                  <Route path="/results" element={<ResultsPage 
                      bookings={bookings} 
                      updateBookingStatus={(id, status) => {
                          setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
                      }}
                      importBookings={handleImportBookings}
                      userRole={userRole}
                      sessions={sessions}
                      currentEmployeeId={currentEmployeeId}
                      racDefinitions={racDefinitions}
                      addNotification={addNotification}
                  />} />
                  
                  <Route path="/users" element={userRole === UserRole.SYSTEM_ADMIN ? <UserManagement users={users} setUsers={setUsers} addNotification={addNotification} /> : <Navigate to="/" replace />} />
                  
                  <Route path="/schedule" element={[UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN].includes(userRole) ? <ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} racDefinitions={racDefinitions} addNotification={addNotification} /> : <Navigate to="/" replace />} />
                  
                  <Route path="/settings" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole) ? 
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
                      feedbackConfig={feedbackConfig}
                      onUpdateFeedbackConfig={handleUpdateFeedbackConfig}
                      onSyncDatabases={handleMiddlewareSync}
                      addNotification={addNotification}
                    /> : <Navigate to="/" replace />} 
                  />
                  
                  <Route path="/request-cards" element={<RequestCardsPage 
                      bookings={bookings} 
                      requirements={requirements} 
                      racDefinitions={racDefinitions} 
                      sessions={sessions} 
                      userRole={userRole}
                      currentEmployeeId={currentEmployeeId}
                  />} />
                  
                  <Route path="/manuals" element={<UserManualsPage userRole={userRole} />} />
                  <Route path="/admin-manual" element={userRole === UserRole.SYSTEM_ADMIN ? <AdminManualPage /> : <Navigate to="/" replace />} />
                  <Route path="/tech-docs" element={userRole === UserRole.SYSTEM_ADMIN ? <TechnicalDocs /> : <Navigate to="/" replace />} />
                  <Route path="/logs" element={[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) ? <LogsPage /> : <Navigate to="/" replace />} />
                  
                  {/* ADMIN FEEDBACK MANAGER ROUTE */}
                  <Route path="/feedback-admin" element={
                      [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole) 
                      ? <FeedbackAdminPage 
                          feedbackList={feedbackList}
                          onUpdateFeedback={handleUpdateFeedback}
                          onDeleteFeedback={handleDeleteFeedback}
                        />
                      : <Navigate to="/" replace />
                  } />

                  {/* MESSAGES LOG ROUTE */}
                  <Route path="/messages" element={
                      [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole) 
                      ? <MessageLogPage />
                      : <Navigate to="/" replace />
                  } />

                  {/* PROTECTED ALCOHOL ROUTE */}
                  <Route path="/alcohol-control" element={
                      canViewAlcoholDashboard() 
                      ? <AlcoholIntegration addNotification={addNotification} /> 
                      : <Navigate to="/" replace />
                  } />
                </Routes>
                
                <GeminiAdvisor />

                {/* USER FEEDBACK FLOATING BUTTON (Conditional on Config) */}
                {isFeedbackSystemActive && (
                    <>
                      <button
                          onClick={() => setIsFeedbackModalOpen(true)}
                          className="fixed bottom-6 right-24 z-40 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all transform hover:scale-110 group no-print"
                          title="Give Feedback"
                      >
                          <MessageSquarePlus size={24} />
                      </button>
                      <FeedbackModal 
                          isOpen={isFeedbackModalOpen} 
                          onClose={() => setIsFeedbackModalOpen(false)}
                          onSubmit={handleSubmitFeedback}
                      />
                    </>
                )}

              </Layout>
            } />
          </Routes>
        </Router>
      </MessageProvider>
    </AdvisorProvider>
  );
};

export default App;
