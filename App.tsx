
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
import SettingsPage from './pages/SettingsPage';
import AlcoholIntegration from './pages/AlcoholIntegration';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { MessageProvider } from './contexts/MessageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './services/databaseService';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { UserRole, Booking, EmployeeRequirement, TrainingSession, RacDef, Site, Company, SystemNotification, Employee, User, Room, Trainer, BookingStatus } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requirements, setRequirements] = useState<EmployeeRequirement[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [racDefinitions, setRacDefinitions] = useState<RacDef[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [currentSiteId, setCurrentSiteId] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  const [dbHealth, setDbHealth] = useState<{table: string, status: 'ok'|'missing'}[]>([]);

  const refreshData = async () => {
    try {
      const [c, s, sess, b, req, uList, racs, rms, trns] = await Promise.all([
          db.getCompanies(),
          db.getSites(),
          db.getSessions(),
          db.getBookings(),
          db.getRequirements(),
          db.getUsers(),
          db.getRacDefinitions(),
          db.getRooms(),
          db.getTrainers()
      ]);

      setCompanies(c);
      setSites(s);
      setSessions(sess);
      setBookings(b);
      setRequirements(req);
      setRacDefinitions(racs);
      setRooms(rms);
      setTrainers(trns);
      setUsers(uList);
    } catch (err) {
      console.error("Failed to refresh app data:", err);
    }
  };

  useEffect(() => {
      const initApp = async () => {
          if (!isAuthenticated) {
              setIsLoading(false);
              return;
          }
          try {
              setIsLoading(true);
              await refreshData();
              if (user?.role === UserRole.SYSTEM_ADMIN && isSupabaseConfigured && supabase) {
                  const tables = ['companies', 'sites', 'users', 'employees', 'bookings', 'rac_definitions', 'rooms', 'trainers'];
                  const health = await Promise.all(tables.map(async t => {
                      const { error } = await supabase.from(t).select('id').limit(1);
                      return { table: t, status: error?.code === '42P01' ? 'missing' : 'ok' } as any;
                  }));
                  setDbHealth(health);
              }
          } catch (err: any) {
              console.error("Initialization Error:", err);
          } finally {
              setIsLoading(false);
          }
      };
      initApp();
  }, [isAuthenticated, user?.email]);

  const addNotification = (notif: SystemNotification) => setNotifications(prev => [notif, ...prev]);

  const handleUpdateCompanies = async (updatedCompanies: Company[]) => {
      try {
          for (const comp of updatedCompanies) {
              const original = companies.find(c => c.id === comp.id);
              if (JSON.stringify(original) !== JSON.stringify(comp)) {
                  await db.saveCompany(comp);
              }
          }
          setCompanies(updatedCompanies);
      } catch (err) {
          console.error("Error saving tenant settings:", err);
      }
  };

  const handleUpdateRacs = async (updatedRacs: RacDef[]) => {
      try {
          for (const rac of updatedRacs) {
              await db.saveRacDefinition(rac);
          }
          setRacDefinitions(updatedRacs);
      } catch (err) {
          console.error("Error saving dynamic modules:", err);
      }
  };

  const handleAddBookings = async (newBookings: Booking[]) => {
      try {
          for (const b of newBookings) { await db.saveBooking(b); }
          setBookings(prev => [...newBookings, ...prev]);
      } catch (err) { console.error("Error saving bookings:", err); }
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
      try {
          const booking = bookings.find(b => b.id === id);
          if (booking) {
              const updated = { ...booking, status };
              await db.saveBooking(updated);
              setBookings(prev => prev.map(b => b.id === id ? updated : b));
          }
      } catch (err) { console.error("Error updating status:", err); }
  };

  const handleTrainerUpdateBookings = async (updates: Booking[]) => {
      try {
          for (const b of updates) { await db.saveBooking(b); }
          setBookings(prev => {
              const updatedIds = new Set(updates.map(u => u.id));
              const untouched = prev.filter(b => !updatedIds.has(b.id));
              return [...updates, ...untouched];
          });
      } catch (err) { console.error("Error committing results:", err); }
  };

  const handleUpdateUser = async (updatedUser: Partial<User>) => {
      try {
          const result = await db.upsertUser(updatedUser);
          if (!result || !result.id) return;
          setUsers(prev => {
              const exists = prev.find(u => u.id === result.id);
              return exists ? prev.map(u => u.id === result.id ? { ...u, ...result } : u) : [...prev, result];
          });
      } catch (err) { console.error(err); }
  };

  const handleUpdateRequirement = async (updatedReq: EmployeeRequirement) => {
      try {
          await db.updateRequirement(updatedReq);
          setRequirements(prev => {
              const idx = prev.findIndex(r => r.employeeId === updatedReq.employeeId);
              return (idx >= 0) ? prev.map((r, i) => i === idx ? updatedReq : r) : [...prev, updatedReq];
          });
      } catch (err) { console.error(err); }
  };

  if (!isAuthenticated) return <LoginPage />;
  if (isLoading) return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <Loader2 size={80} className="text-blue-500 animate-spin" />
          <h2 className="text-2xl font-black uppercase mt-8 animate-pulse">Syncing Production Hub</h2>
      </div>
  );

  const missingTables = dbHealth.filter(h => h.status === 'missing');

  return (
    <AdvisorProvider>
      <MessageProvider>
        <Router>
          {user?.role === UserRole.SYSTEM_ADMIN && missingTables.length > 0 && (
              <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white p-2 flex items-center justify-center gap-4 shadow-xl">
                  <Database size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Production Setup: {missingTables.length} tables missing.</span>
                  <button onClick={() => window.location.hash = '#/tech-docs'} className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">GET SQL</button>
              </div>
          )}
          <Routes>
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="/verify/:recordId" element={<VerificationPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} />} />
            <Route path="/print-cards" element={<CardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={user?.role} companies={companies} />} />
            <Route path="*" element={
              <Layout userRole={user?.role || UserRole.USER} setUserRole={() => {}} notifications={notifications} clearNotifications={() => setNotifications([])} sites={sites} currentSiteId={currentSiteId} setCurrentSiteId={setCurrentSiteId} companies={companies}>
                <Routes>
                  <Route path="/" element={<Dashboard bookings={bookings} requirements={requirements} sessions={sessions} userRole={user?.role || UserRole.USER} racDefinitions={racDefinitions} currentSiteId={currentSiteId} companies={companies} />} />
                  <Route path="/database" element={<DatabasePage bookings={bookings} requirements={requirements} updateRequirements={handleUpdateRequirement} sessions={sessions} onUpdateEmployee={() => {}} onDeleteEmployee={() => {}} racDefinitions={racDefinitions} addNotification={addNotification} currentSiteId={currentSiteId} companies={companies} />} />
                  <Route path="/booking" element={<BookingForm addBookings={handleAddBookings} sessions={sessions} userRole={user?.role || UserRole.USER} existingBookings={bookings} addNotification={addNotification} racDefinitions={racDefinitions} companies={companies} />} />
                  <Route path="/results" element={<ResultsPage bookings={bookings} updateBookingStatus={handleUpdateBookingStatus} userRole={user?.role || UserRole.USER} sessions={sessions} racDefinitions={racDefinitions} addNotification={addNotification} currentSiteId={currentSiteId} />} />
                  <Route path="/users" element={<UserManagement users={users} onUpdateUser={handleUpdateUser} onDeleteUser={() => {}} addNotification={addNotification} sites={sites} currentSiteId={currentSiteId} companies={companies} />} />
                  <Route path="/settings" element={<SettingsPage racDefinitions={racDefinitions} onUpdateRacs={handleUpdateRacs} rooms={rooms} onUpdateRooms={setRooms} trainers={trainers} onUpdateTrainers={setTrainers} sites={sites} onUpdateSites={setSites} companies={companies} onUpdateCompanies={handleUpdateCompanies} userRole={user?.role} addNotification={addNotification} />} />
                  <Route path="/schedule" element={<ScheduleTraining sessions={sessions} setSessions={setSessions} rooms={rooms} trainers={trainers} racDefinitions={racDefinitions} addNotification={addNotification} currentSiteId={currentSiteId} />} />
                  <Route path="/trainer-input" element={<TrainerInputPage bookings={bookings} updateBookings={handleTrainerUpdateBookings} sessions={sessions} userRole={user?.role} currentUserName={user?.name} racDefinitions={racDefinitions} />} />
                  <Route path="/manuals" element={<UserManualsPage userRole={user?.role || UserRole.USER} />} />
                  <Route path="/tech-docs" element={<TechnicalDocs />} />
                  <Route path="/logs" element={<LogsPage />} />
                  <Route path="/request-cards" element={<RequestCardsPage bookings={bookings} requirements={requirements} racDefinitions={racDefinitions} sessions={sessions} userRole={user?.role || UserRole.USER} currentSiteId={currentSiteId} companies={companies} />} />
                  <Route path="/integration" element={<IntegrationHub userRole={user?.role || UserRole.USER} />} />
                  <Route path="/reports" element={<ReportsPage bookings={bookings} sessions={sessions} currentSiteId={currentSiteId} racDefinitions={racDefinitions} />} />
                  <Route path="/enterprise-dashboard" element={<EnterpriseDashboard sites={sites} bookings={bookings} requirements={requirements} userRole={user?.role} racDefinitions={racDefinitions} />} />
                  <Route path="/alcohol-control" element={<AlcoholIntegration addNotification={addNotification} />} />
                  <Route path="/messages" element={<MessageLogPage />} />
                  <Route path="/site-governance" element={<SiteGovernancePage sites={sites} setSites={setSites} racDefinitions={racDefinitions} bookings={bookings} requirements={requirements} updateRequirements={handleUpdateRequirement} />} />
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
