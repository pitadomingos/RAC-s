
import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { UserRole, SystemNotification } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'pt' : 'en');
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
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Hidden on Print */}
      <aside 
        className={`
          no-print fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transform transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center h-16 border-b border-slate-700 ${isCollapsed ? 'justify-center p-0' : 'justify-between p-4'}`}>
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
             className="hidden md:flex bg-slate-800 text-gray-400 hover:text-white rounded p-1"
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
        <div className="w-full p-4 border-t border-slate-700 bg-slate-900">
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
                    className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600 focus:border-yellow-500 outline-none"
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
        <header className="no-print h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 z-10 relative">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600">
                <Menu size={24} />
             </button>
             
             {/* Navigation Controls */}
             <div className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-200 pr-4">
                <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Back">
                    <ArrowLeft size={18} />
                </button>
                <button onClick={() => navigate(1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Forward">
                    <ArrowRight size={18} />
                </button>
             </div>

             <h1 className="text-xl font-semibold text-slate-800">
                {String(pageTitle)}
             </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Switch Language"
            >
                <Globe size={16} />
                <span>{language === 'en' ? 'EN' : 'PT'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!isNotifOpen)}
                  className="text-gray-500 hover:text-slate-800 transition-colors relative mt-1"
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
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-3 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-700">{t.common.notifications}</span>
                            {clearNotifications && (
                                <button onClick={clearNotifications} className="text-xs text-blue-600 hover:underline">
                                    {t.common.clearAll}
                                </button>
                            )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">{t.common.noNotifications}</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={String(notif.id)} className="p-3 border-b border-gray-50 hover:bg-gray-50 flex gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 
                                            ${notif.type === 'warning' ? 'bg-yellow-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}
                                        `} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{String(notif.title)}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">{String(notif.message)}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">
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
            {userRole === UserRole.SYSTEM_ADMIN && location.pathname !== '/proposal' && (
              <Link to="/proposal" className="hidden md:inline-block text-xs font-bold text-blue-600 hover:underline">
                {t.common.viewProposal}
              </Link>
            )}
            
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-bold text-slate-800">{String(userRole)}</span>
              <span className="text-xs text-green-600">{t.common.activeSession}</span>
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
