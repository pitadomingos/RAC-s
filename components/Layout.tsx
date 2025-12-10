


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
  Presentation
} from 'lucide-react';
import { UserRole, SystemNotification } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notifications?: SystemNotification[];
  clearNotifications?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, setUserRole, notifications = [], clearNotifications }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const allNavItems = [
    { 
      path: '/', 
      label: t.nav.dashboard, 
      icon: LayoutDashboard, 
      visible: true 
    },
    {
      path: '/database',
      label: t.nav.database,
      icon: Database,
      visible: true 
    },
    { 
      path: '/reports', 
      label: t.nav.reports, 
      icon: FileBarChart, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN].includes(userRole) 
    },
    { 
      path: '/booking', 
      label: t.nav.booking, 
      icon: CalendarPlus, 
      visible: true 
    },
    { 
      path: '/trainer-input', 
      label: t.nav.trainerInput, 
      icon: PenTool, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole) 
    },
    { 
      path: '/results', 
      label: t.nav.records, 
      icon: ClipboardList, 
      visible: true 
    },
    {
      path: '/alcohol-control',
      label: t.nav.alcohol,
      icon: Wine,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole)
    },
    { 
      path: '/users', 
      label: t.nav.users, 
      icon: Users, 
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    { 
      path: '/schedule', 
      label: t.nav.schedule, 
      icon: CalendarDays, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) 
    },
    { 
      path: '/settings', 
      label: t.nav.settings, 
      icon: Settings, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) 
    },
    { 
      path: '/request-cards', 
      label: t.nav.requestCards, 
      icon: Mail, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) 
    },
    {
      path: '/manuals',
      label: t.nav.manuals,
      icon: BookOpen,
      visible: true
    },
    {
      path: '/logs',
      label: t.nav.logs,
      icon: ScrollText,
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole)
    },
    {
        path: '/presentation',
        label: t.nav.presentation,
        icon: Presentation,
        visible: userRole === UserRole.SYSTEM_ADMIN
    }
  ];

  const navItems = allNavItems.filter(item => item.visible);

  // Safely determine page title - strictly string
  const currentNavItem = navItems.find(i => i.path === location.pathname);
  let pageTitle = String(t.common.vulcan);
  if (currentNavItem && currentNavItem.label) {
    pageTitle = String(currentNavItem.label);
  } else if (location.pathname === '/proposal') {
    pageTitle = String(t.nav.proposal);
  } else if (location.pathname === '/presentation') {
    pageTitle = String(t.nav.presentation);
  }

  // If we are in presentation mode, we might want to skip rendering the layout wrapper entirely,
  // but since Layout wraps routes, we handle it by CSS z-index in the page itself OR simple conditional here.
  // The PresentationPage has z-index 100 and fixed positioning, so it will overlay this layout.

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Sidebar - Hidden on Print */}
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
          
          {/* Desktop Collapse Toggle */}
          <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="hidden md:flex bg-slate-800 dark:bg-slate-900 text-gray-400 hover:text-white rounded p-1"
             title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
             {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? String(item.label) : ''}
                className={`
                  flex items-center rounded-lg transition-colors
                  ${isActive ? 'bg-yellow-500 text-slate-900 font-medium' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}
                  ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'}
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{String(item.label)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Role Simulator Footer */}
        <div className="w-full p-4 border-t border-slate-700 dark:border-slate-800 bg-slate-900 dark:bg-slate-950">
          <div className="flex flex-col gap-2">
            {!isCollapsed && (
              <div className="text-xs text-gray-400 flex items-center gap-2">
                 <UserCog size={14} />
                 <span>{t.common.simulateRole}:</span>
              </div>
            )}
            
            {isCollapsed ? (
               <div className="flex justify-center" title={`${t.common.role}: ${userRole}`}>
                   <UserCog size={20} className="text-gray-400" />
               </div>
            ) : (
                <>
                  <select 
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-800 dark:bg-slate-900 text-white text-xs p-2 rounded border border-slate-600 dark:border-slate-700 focus:border-yellow-500 outline-none"
                  >
                    <option value={UserRole.SYSTEM_ADMIN}>System Admin</option>
                    <option value={UserRole.RAC_ADMIN}>RAC Admin</option>
                    <option value={UserRole.RAC_TRAINER}>RAC Trainer</option>
                    <option value={UserRole.DEPT_ADMIN}>Dept Admin</option>
                    <option value={UserRole.USER}>User</option>
                  </select>
                  <div className="text-[10px] text-gray-500 text-center mt-1">
                    {userRole === UserRole.SYSTEM_ADMIN ? t.common.superuser : t.common.restricted}
                  </div>
                </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <header className="no-print h-16 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between px-4 md:px-6 z-10 relative border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 dark:text-slate-300">
                <Menu size={24} />
             </button>
             
             {/* Navigation Controls */}
             <div className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-200 dark:border-slate-600 pr-4">
                <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-gray-400" title="Back">
                    <ArrowLeft size={18} />
                </button>
                <button onClick={() => navigate(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-gray-400" title="Forward">
                    <ArrowRight size={18} />
                </button>
             </div>

             <h1 className="text-xl font-semibold text-slate-800 dark:text-white transition-colors">
                {String(pageTitle)}
             </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Full Screen Toggle */}
            <button 
                onClick={toggleFullScreen}
                className="flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title={isFullscreen ? t.common.exitFullScreen : t.common.fullScreen}
            >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

            {/* Theme Switcher */}
            <button 
                onClick={cycleTheme}
                className="flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title={`Theme: ${theme}`}
            >
                {getThemeIcon()}
            </button>

            {/* Language Switcher */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                title="Switch Language"
            >
                <Globe size={16} />
                <span>{language === 'en' ? 'EN' : 'PT'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!isNotifOpen)}
                  className="text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors relative mt-1"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {String(unreadCount)}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-3 bg-slate-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600 flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.common.notifications}</span>
                            {clearNotifications && (
                                <button onClick={clearNotifications} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                    {t.common.clearAll}
                                </button>
                            )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">{t.common.noNotifications}</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={String(notif.id)} className="p-3 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 
                                            ${notif.type === 'warning' ? 'bg-yellow-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}
                                        `} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{String(notif.title)}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{String(notif.message)}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Link to Proposal for Admin */}
            {userRole === UserRole.SYSTEM_ADMIN && location.pathname !== '/proposal' && location.pathname !== '/presentation' && (
              <Link to="/proposal" className="hidden md:inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                {t.common.viewProposal}
              </Link>
            )}
            
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors">{String(userRole)}</span>
              <span className="text-xs text-green-600 dark:text-green-400">{t.common.activeSession}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-slate-900">
              VS
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
