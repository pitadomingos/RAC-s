
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DatabasePage from './pages/DatabasePage';
import ReportsPage from './pages/ReportsPage';
import BookingForm from './pages/BookingForm';
import CardsPage from './pages/CardsPage';
import VerificationPage from './pages/VerificationPage';
import IntegrationHub from './pages/IntegrationHub';
import PresentationPage from './pages/PresentationPage';
import ProjectProposal from './pages/ProjectProposal';
import GeminiAdvisor from './components/GeminiAdvisor';
import TrainerInputPage from './pages/TrainerInputPage';
import RequestCardsPage from './pages/RequestCardsPage';
import MessageLogPage from './pages/MessageLogPage';
import UserManagement from './pages/UserManagement';
import ScheduleTraining from './pages/ScheduleTraining';
import SiteGovernancePage from './pages/SiteGovernancePage';
import LogsPage from './pages/LogsPage';
import UserManualsPage from './pages/UserManualsPage';
import TechnicalDocs from './pages/TechnicalDocs';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { MessageProvider } from './contexts/MessageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './services/databaseService';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { UserRole, Booking, EmployeeRequirement, TrainingSession, RacDef, Site, Company, SystemNotification, Employee, User } from './types';
import { INITIAL_RAC_DEFINITIONS } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [racDefinitions] = useState<RacDef[]>(INITIAL_RAC_DEFINITIONS);
  const [sites, setSites] = useState<Site[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [currentSiteId, setCurrentSiteId] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);

  // Connectivity Health
  const [dbHealth, setDbHealth] = useState<{table: string, status: 'ok'|'missing'}[]>([]);

  useEffect(() => {
      const initApp = async () => {
          if (!isAuthenticated) {
              setIsLoading(false);
              return;
          }
          
          try {
              setIsLoading(true);
              setError(null);

              // 1. Initial Load
              const [c, s, sess, e, b, req, u] = await Promise.all([
                  db.getCompanies(),
                  db.getSites(),
                  db.getSessions(),
                  db.getEmployees(),
                  db.getBookings(),
                  db.getRequirements(),
                  db.getUsers()
              ]);

              setCompanies(c);
              setSites(s);
              setSessions(sess);
              setBookings(b);
              setRequirements(req);
              setUsers(u);

              // 2. Connectivity check for System Admins
              if (user?.role === UserRole.SYSTEM_ADMIN && isSupabaseConfigured && supabase) {
                  const tables = ['companies', 'sites', 'users', 'employees', 'bookings', 'employee_requirements'];
                  const health = await Promise.all(tables.map(async t => {
                      const { error } = await supabase.from(t).select('id').limit(1);
                      return { table: t, status: error?.code === '42P01' ? 'missing' : 'ok' } as any;
                  }));
                  setDbHealth(health);
              }

          } catch (err: any) {
              console.error("Initialization Error:", err);
              // In this version, we don't set a blocking error unless it's critical (e.g. auth fail)
          } finally {
              setIsLoading(false);
          }
      };
      initApp();
  }, [isAuthenticated, user?.role]);

  const addNotification = (notif: SystemNotification) => setNotifications(prev => [notif, ...prev]);

  const handleBookingsUpdate = async (newBookings: Booking[]) => {
      try {
          for (const booking of newBookings) {
              await db.saveBooking(booking);
          }
          setBookings(prev => [...prev, ...newBookings]);
      } catch (err) {
          addNotification({ id: uuidv4(), type: 'alert', title: 'Sync Error', message: 'Failed to save to cloud.', timestamp: new Date(), isRead: false });
      }
  };

  const handleUpdateUser = async (updatedUser: Partial<User>) => {
      try {
          const result = await db.upsertUser(updatedUser);
          if (!result || !result.id) return; // Prevent updating state with invalid data
          
          setUsers(prev => {
              const exists = prev.find(u => u.id === result.id);
              if (exists) {
                  return prev.map(u => u.id === result.id ? { ...u, ...result } : u);
              }
              return [...prev, result];
          });
      } catch (err) {
          addNotification({ id: uuidv4(), type: 'alert', title: 'User Save Error', message: 'Failed to persist user to cloud.', timestamp: new Date(), isRead: false });
      }
  };

  const handleDeleteUser = async (id: number) => {
      try {
          await db.deleteUser(id);
          setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
          console.error("Delete Error:", err);
      }
  };

  const handleUpdateRequirement = async (updatedReq: EmployeeRequirement) => {
      try {
          await db.updateRequirement(updatedReq);
          setRequirements(prev => {
              const idx = prev.findIndex(r => r.employeeId === updatedReq.employeeId);
              if (idx >= 0) {
                  const newReqs = [...prev];
                  newReqs[idx] = updatedReq;
                  return newReqs;
              }
              return [...prev, updatedReq];
          });
      } catch (err) {
          console.error(err);
      }
  };

  const handleUpdateEmployee = async (id: string, updates: Partial<Employee>) => {
      try {
          const result = await db.upsertEmployee({ ...updates, id });
          if (!result) return;
          
          setBookings(prev => prev.map(b => b.employee.id === id ? { ...b, employee: { ...b.employee, ...updates } } : b));
      } catch (err) {
          console.error(err);
      }
  };

  if (!isAuthenticated) {
      return <LoginPage />;
  }

  if (isLoading) {
      return (
          <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans overflow-hidden">
              <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                  <Loader2 size={80} className="text-blue-500 animate-spin relative z-10" />
              </div>
              <h2 className="text-2xl font-black tracking-widest uppercase mt-8 animate-pulse">Establishing Secure Session</h2>
              <p className="text-slate-500 mt-2 font-mono text-sm tracking-tight">
                  {isSupabaseConfigured ? `Syncing for ${user?.name}...` : "Initializing Offline Engine..."}
              </p>
          </div>
      );
  }

  const missingTables = dbHealth.filter(h => h.status === 'missing');

  return (
    <AdvisorProvider>
      <MessageProvider>
        <Router>
          {/* DATABASE SETUP WIZARD BANNER (System Admin Only) */}
          {user?.role === UserRole.SYSTEM_ADMIN && missingTables.length > 0 && (
              <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white p-2 flex items-center justify-center gap-4 shadow-xl">
                  <Database size={16} className="animate-bounce" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                      Supabase Setup Required: {missingTables.length} tables missing in Public schema.
                  </span>
                  <button 
                    onClick={() => window.location.hash = '#/tech-docs'} 
                    className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black hover:bg-indigo-50 transition-colors"
                  >
                      VIEW SQL SCRIPTS
                  </button>
              </div>
          )}

          {!isSupabaseConfigured && (
              <div className="fixed top-0 left-0 right-0 z-[100] bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-1">
                  Offline Mode: No Cloud Credentials Found.
              </div>
          )}

          <Routes>
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="/proposal" element={<ProjectProposal />} />
            <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />
            <Route path="/print-cards" element={<CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={user?.role} companies={companies} />} />

            <Route path="*" element={
              <Layout 
                userRole={user?.role || UserRole.USER} 
                setUserRole={() => {}} 
                notifications={notifications}
                clearNotifications={() => setNotifications([])}
                sites={sites}
                currentSiteId={currentSiteId}
                setCurrentSiteId={setCurrentSiteId}
                companies={companies}
              >
                <Routes>
                  <Route path="/" element={
                    user?.role === UserRole.USER ? <Navigate to="/booking" replace /> :
                    user?.role === UserRole.RAC_TRAINER ? <Navigate to="/trainer-input" replace /> :
                    <Dashboard 
                        bookings={bookings} 
                        requirements={requirements} 
                        sessions={sessions} 
                        userRole={user?.role || UserRole.USER}
                        racDefinitions={racDefinitions}
                        currentSiteId={currentSiteId}
                    />
                  } />
                  <Route path="/database" element={<DatabasePage 
                          bookings={bookings} 
                          requirements={requirements} 
                          updateRequirements={handleUpdateRequirement} 
                          sessions={sessions}
                          onUpdateEmployee={handleUpdateEmployee}
                          onDeleteEmployee={() => {}}
                          racDefinitions={racDefinitions}
                          addNotification={addNotification}
                          currentSiteId={currentSiteId}
                  />} />
                  <Route path="/booking" element={<BookingForm 
                          addBookings={handleBookingsUpdate} 
                          sessions={sessions} 
                          userRole={user?.role || UserRole.USER} 
                          existingBookings={bookings}
                          addNotification={addNotification}
                          requirements={requirements}
                          racDefinitions={racDefinitions}
                  />} />
                  <Route path="/results" element={<ResultsPage 
                        bookings={bookings} 
                        updateBookingStatus={() => {}} 
                        userRole={user?.role || UserRole.USER} 
                        sessions={sessions}
                        currentEmployeeId="emp1" 
                        racDefinitions={racDefinitions} 
                        addNotification={addNotification}
                        currentSiteId={currentSiteId}
                  />} />
                  <Route path="/trainer-input" element={<TrainerInputPage 
                        bookings={bookings} 
                        updateBookings={handleBookingsUpdate} 
                        sessions={sessions} 
                        userRole={user?.role || UserRole.USER}
                        currentUserName={user?.name}
                        racDefinitions={racDefinitions}
                  />} />
                  <Route path="/request-cards" element={<RequestCardsPage 
                        bookings={bookings} 
                        requirements={requirements} 
                        racDefinitions={racDefinitions} 
                        sessions={sessions} 
                        userRole={user?.role || UserRole.USER}
                        currentEmployeeId="emp1"
                        currentSiteId={currentSiteId}
                        companies={companies}
                  />} />
                  <Route path="/messages" element={<MessageLogPage />} />
                  <Route path="/users" element={<UserManagement users={users} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} addNotification={addNotification} sites={sites} currentSiteId={currentSiteId} />} />
                  <Route path="/schedule" element={<ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={[]} trainers={[]} racDefinitions={racDefinitions} addNotification={addNotification} currentSiteId={currentSiteId} />} />
                  <Route path="/site-governance" element={<SiteGovernancePage sites={sites} setSites={setSites} racDefinitions={racDefinitions} bookings={bookings} requirements={requirements} updateRequirements={handleUpdateRequirement} />} />
                  <Route path="/logs" element={<LogsPage />} />
                  <Route path="/manuals" element={<UserManualsPage userRole={user?.role || UserRole.USER} />} />
                  <Route path="/tech-docs" element={<TechnicalDocs />} />
                  <Route path="/integration" element={<IntegrationHub userRole={user?.role || UserRole.USER} />} />
                  <Route path="/reports" element={<ReportsPage bookings={bookings} sessions={sessions} currentSiteId={currentSiteId} />} />
                </Routes>
                <GeminiAdvisor />
              </Layout>
            } />
          </Routes>
        </Router>
      </MessageProvider>
    </AdvisorProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
};

export default App;
