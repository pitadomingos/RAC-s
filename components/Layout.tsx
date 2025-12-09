

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Bell
} from 'lucide-react';
import { UserRole, SystemNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notifications?: SystemNotification[];
  clearNotifications?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, setUserRole, notifications = [], clearNotifications }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const allNavItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      visible: true 
    },
    {
      path: '/database',
      label: 'Database',
      icon: Database,
      visible: true 
    },
    { 
      path: '/reports', 
      label: 'Reports & Analytics', 
      icon: FileBarChart, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER, UserRole.DEPT_ADMIN].includes(userRole) 
    },
    { 
      path: '/booking', 
      label: 'Book Training', 
      icon: CalendarPlus, 
      visible: true 
    },
    { 
      path: '/trainer-input', 
      label: 'Trainer Input', 
      icon: PenTool, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN, UserRole.RAC_TRAINER].includes(userRole) 
    },
    { 
      path: '/results', 
      label: 'Records', 
      icon: ClipboardList, 
      visible: true 
    },
    { 
      path: '/users', 
      label: 'User Management', 
      icon: Users, 
      visible: userRole === UserRole.SYSTEM_ADMIN 
    },
    { 
      path: '/schedule', 
      label: 'Schedule Trainings', 
      icon: CalendarDays, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) 
    },
    { 
      path: '/settings', 
      label: 'System Settings', 
      icon: Settings, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.RAC_ADMIN].includes(userRole) 
    },
    { 
      path: '/request-cards', 
      label: 'Request CARs Cards', 
      icon: Mail, 
      visible: [UserRole.SYSTEM_ADMIN, UserRole.DEPT_ADMIN, UserRole.RAC_ADMIN, UserRole.USER].includes(userRole) 
    },
  ];

  const navItems = allNavItems.filter(item => item.visible);

  // Safely determine page title
  const currentNavItem = navItems.find(i => i.path === location.pathname);
  let pageTitle = 'Vulcan Safety';
  if (currentNavItem && typeof currentNavItem.label === 'string') {
    pageTitle = currentNavItem.label;
  } else if (location.pathname === '/proposal') {
    pageTitle = 'Project Proposal';
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Hidden on Print */}
      <aside 
        className={`
          no-print fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold tracking-wider">VULCAN</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-yellow-500 text-slate-900 font-medium' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-400 flex items-center gap-2">
               <UserCog size={14} />
               <span>Simulate Role:</span>
            </div>
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
              {userRole === UserRole.SYSTEM_ADMIN ? 'Superuser Access' : 'Restricted Access'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <header className="no-print h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 z-10 relative">
          <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 mr-4">
                <Menu size={24} />
             </button>
             <h1 className="text-xl font-semibold text-slate-800">
                {pageTitle}
             </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            
            {/* Notification Bell */}
            <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!isNotifOpen)}
                  className="text-gray-500 hover:text-slate-800 transition-colors relative"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-3 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-700">System Notifications</span>
                            {clearNotifications && (
                                <button onClick={clearNotifications} className="text-xs text-blue-600 hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">No new notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 flex gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 
                                            ${notif.type === 'warning' ? 'bg-yellow-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}
                                        `} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{notif.timestamp.toLocaleTimeString()}</p>
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
                View Proposal
              </Link>
            )}
            
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-bold text-slate-800">{userRole}</span>
              <span className="text-xs text-green-600">Active Session</span>
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