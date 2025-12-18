
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  ClipboardList, 
  Mail, 
  Menu, 
  X, 
  ShieldCheck,
  UserCog,
  PenTool,
  Users,
  CalendarDays,
  Database,
  FileBarChart,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ScrollText,
  Globe,
  Wine,
  Sun,
  Moon,
  Monitor,
  Maximize,
  Minimize,
  Presentation,
  FileCode,
  Shield,
  Map,
  Building2,
  BarChart,
  GanttChart,
  FileText,
  Briefcase,
  MessageSquare,
  Send
} from 'lucide-react';
import { UserRole, SystemNotification, Site, Company } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notifications?: SystemNotification[];
  clearNotifications?: () => void;
  sites?: Site[];
  currentSiteId?: string;
  setCurrentSiteId?: (id: string) => void;
  // New props for Simulation
  simulatedJobTitle?: string;
  setSimulatedJobTitle?: (title: string) => void;
  simulatedDept?: string;
  setSimulatedDept?: (dept: string) => void;
  companies?: Company[]; // Passed from App to check features
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userRole, 
  setUserRole, 
  notifications = [], 
  clearNotifications,
  sites = [],
  currentSiteId = 'all',
  setCurrentSiteId,
  simulatedJobTitle = 'General User',
  setSimulatedJobTitle = (_t: string) => {},
  simulatedDept = 'Operations',
  setSimulatedDept = (_d: string) => {},
  companies = []
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Determine Current Company Context (Simulated: Default to CARS Solutions or first available)
  const currentCompany = companies.find(c => c.name === 'CARS Solutions') || companies[0];

  // Determine Alcohol Dashboard Access
  const canViewAlcoholDashboard = (): boolean => {
      // Feature Flag Check
      if (!currentCompany?.features?.alcohol) return false;

      // Role Check
      if (userRole === UserRole.USER) return false;
      if (userRole === UserRole.RAC_TRAINER) return false;

      if (userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.ENTERPRISE_ADMIN) return true;
      
      const allowedTitles = ['Manager', 'Supervisor', 'Superintendent', 'Director', 'Head'];
      const allowedDepts = ['HSE', 'Operations', 'Security', 'Medical'];
      
      const safeTitle = simulatedJobTitle || '';
      const safeDept = simulatedDept || '';

      const hasTitle = allowedTitles.some(t => safeTitle.includes(t));
      const hasDept = allowedDepts.some(d => safeDept.includes(d));
      
      return hasTitle && hasDept;
  };

  const showAlcoholLink = canViewAlcoholDashboard();

  // Safety check for translations
  if (!t || !t.nav) {
      return (
          <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p>Loading Language Resources...</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-slate-800 rounded hover:bg-slate-700"
                  >
                    Reload
                  </button>
              </div>
          </div>
      );
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
             console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'pt' : 'en');
  };

  const cycleTheme = () => {
      if (theme === 'light') setTheme('dark');
      else if (theme === 'dark') setTheme('system');
      else setTheme('light');
  };

  const getThemeIcon = () => {
      switch(theme) {
          case 'light': return <Sun size={18} />;
          case 'dark': return <Moon size={18} />;
          case 'system': return <Monitor size={18} />;
      }
  };

  // --- NAVIGATION CONFIGURATION ---
  const allNavItems = [
    { 
      path: '/', 
      label: t.nav.dashboard, 
      icon: LayoutDashboard, 
      visible: userRole !== UserRole.USER && userRole !== UserRole.ENTERPRISE_ADMIN
    },
    { 
      path: '/booking', 
      label: t.nav.booking, 
      icon: CalendarPlus, 
      visible: userRole !== UserRole.RAC_TRAINER && userRole !== UserRole.ENTERPRISE_ADMIN && userRole !== UserRole.SITE_ADMIN
    },
    { 
      path: '/results', 
      label: t.nav.records, 
      icon: ClipboardList, 
      visible: userRole !== UserRole.RAC_TRAINER && userRole !== UserRole.ENTERPRISE_ADMIN
    },
    { 
      path: '/database', 
      label: t.nav.database, 
      icon: Database, 
      visible: userRole !== UserRole.USER && userRole !== UserRole.RAC_TRAINER 
    },
    { 
      path: '/reports', 
      label: t.nav.reports, 
      icon: FileBarChart, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole) 
    },
    {
      path: '/enterprise-dashboard',
      label: t.nav.enterpriseDashboard,
      icon: BarChart,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole)
    },
    {
      path: '/alcohol-control',
      label: t.nav.alcohol,
      icon: Wine,
      visible: showAlcoholLink
    },
    { 
      path: '/request-cards', 
      label: t.nav.requestCards, 
      icon: Mail, 
      visible: userRole !== UserRole.ENTERPRISE_ADMIN && userRole !== UserRole.RAC_TRAINER
    },
    {
      path: '/messages',
      label: t.nav.communications,
      icon: Send,
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    { 
      path: '/schedule', 
      label: t.nav.schedule, 
      icon: CalendarDays, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN].includes(userRole) 
    },
    {
      path: '/site-governance',
      label: t.nav.siteGovernance,
      icon: GanttChart,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole)
    },
    { 
      path: '/trainer-input', 
      label: t.nav.trainerInput, 
      icon: PenTool, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_TRAINER].includes(userRole) 
    },
    { 
      path: '/users', 
      label: t.nav.users, 
      icon: Users, 
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    { 
      path: '/settings', 
      label: t.nav.settings, 
      icon: Settings, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.SITE_ADMIN].includes(userRole)
    },
    {
      path: '/logs',
      label: t.nav.logs,
      icon: ScrollText,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole)
    },
    {
      path: '/manuals',
      label: t.nav.manuals,
      icon: BookOpen,
      visible: true
    },
    {
      path: '/feedback-admin',
      label: t.nav.feedbackAdmin,
      icon: MessageSquare,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole)
    },
    {
      path: '/admin-manual',
      label: t.nav.adminGuide, 
      icon: Shield,
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    {
      path: '/tech-docs',
      label: 'Technical Docs',
      icon: FileCode,
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    {
        path: '/presentation',
        label: t.nav.presentation,
        icon: Presentation,
        visible: userRole === UserRole.SYSTEM_ADMIN
    },
    {
      path: '/proposal',
      label: t.nav.proposal,
      icon: FileText,
      visible: userRole === UserRole.SYSTEM_ADMIN
    },
  ];

  const navItems = allNavItems.filter(item => item.visible);

  const currentNavItem = navItems.find(i => i.path === location.pathname);
  let pageTitle = String(t.common.vulcan);
  if (currentNavItem && currentNavItem.label) {
    pageTitle = String(currentNavItem.label);
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Sidebar */}
      <aside 
        className={`
          no-print fixed inset-y-0 left-0 z-50 bg-slate-900 dark:bg-slate-950 text-white transform transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-64'}
          border-r border-slate-700 dark:border-slate-800
        `}
      >
        {/* Header */}
        <div className={`flex items-center h-16 border-b border-slate-700 dark:border-slate-800 ${isCollapsed ? 'justify-center p-0' : 'justify-between p-4'}`}>
          <div className="flex items-center space-x-2">
            <ShieldCheck className={`${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'} text-yellow-500`} />
            {!isCollapsed && <span className="text-xl font-bold tracking-wider">{t.common.vulcan}</span>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="hidden md:flex bg-slate-800 dark:bg-slate-900 text-gray-400 hover:text-white rounded p-1"
          >
             {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsed ? String(item.label) : ''}
                className={`
                  flex items-center rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-yellow-500 text-slate-900 font-medium' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'}
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{String(item.label)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Role Simulator */}
        <div className="w-full p-4 border-t border-slate-700 dark:border-slate-800 bg-slate-900 dark:bg-slate-950">
          <div className="flex flex-col gap-2">
            {!isCollapsed && (
              <div className="text-xs text-gray-400 flex items-center gap-2">
                 <UserCog size={14} />
                 <span>{t.common.simulateRole}:</span>
              </div>
            )}
            
            {!isCollapsed && (
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-800 dark:bg-slate-900 text-white text-xs p-2 rounded border border-slate-600 dark:border-slate-700 focus:border-yellow-500 outline-none mb-2"
                >
                  <option value={UserRole.SYSTEM_ADMIN}>System Admin</option>
                  <option value={UserRole.ENTERPRISE_ADMIN}>Enterprise Admin</option>
                  <option value={UserRole.SITE_ADMIN}>Site Admin</option>
                  <option value={UserRole.RAC_TRAINER}>RAC Trainer</option>
                  <option value={UserRole.USER}>User</option>
                </select>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <header className="no-print h-16 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between px-4 md:px-6 z-10 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 dark:text-slate-300">
                <Menu size={24} />
             </button>
             
             <div className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-200 dark:border-slate-700 pr-4">
                 <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                     <ArrowLeft size={18} />
                 </button>
                 <button onClick={() => navigate(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                     <ArrowRight size={18} />
                 </button>
             </div>

             <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">{pageTitle}</h1>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter shadow-sm">
                    <Building2 size={10} />
                    {currentCompany?.name}
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {setCurrentSiteId && (userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.ENTERPRISE_ADMIN) && (
                <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1">
                    {currentSiteId === 'all' ? <Building2 size={16} className="text-blue-500" /> : <Map size={16} className="text-green-500" />}
                    <select 
                        value={currentSiteId}
                        onChange={(e) => setCurrentSiteId(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="all">{t.common.enterpriseView}</option>
                        {sites.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <button 
                onClick={() => toggleLanguage()}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-1"
            >
                <Globe size={18} />
                <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            <button onClick={() => cycleTheme()} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700">
                {getThemeIcon()}
            </button>

            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-50 rounded-full border border-white dark:border-slate-800"></span>
                )}
              </button>
              
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-up">
                   <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t.common.notifications}</h3>
                       <button onClick={() => clearNotifications && clearNotifications()} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{t.common.clearAll}</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                       {notifications.length === 0 ? (
                           <div className="p-8 text-center text-gray-400 text-sm">{t.common.noNotifications}</div>
                       ) : (
                           <div className="divide-y divide-gray-100 dark:divide-slate-700">
                               {notifications.map(n => (
                                   <div key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                       <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                                       <p className="text-[10px] text-gray-400 mt-2">{n.timestamp.toLocaleTimeString()}</p>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-slate-700 pl-4">
               <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold shadow-md">
                  {userRole === UserRole.SYSTEM_ADMIN ? 'A' : 'U'}
               </div>
               <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-white">{userRole}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{simulatedJobTitle}</div>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-900 relative">
           {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
