import { useTranslation } from 'react-i18next';
import { NavLink } from '../ui/NavLink';
import useAppStore from '../../store/useAppStore';
import { 
  LayoutDashboard, 
  UserPlus, 
  Shield, 
  Calendar, 
  Clock, 
  FileText, 
  Bell, 
  Settings,
  Users,
  Fingerprint,
  Key
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);

  // Role-specific navigation items
  const getNavItems = () => {
    if (user.role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { to: '/admin/accounts', icon: Key, label: 'User Accounts' },
        { to: '/admin/students', icon: Users, label: 'Manage Students' },
        { to: '/admin/attendance-methods', icon: Fingerprint, label: 'Attendance Methods' },
        { to: '/admin/enroll', icon: UserPlus, label: 'Enroll Users' },
        { to: '/admin/authenticate', icon: Shield, label: t('nav.authenticate') },
        { to: '/admin/sessions', icon: Calendar, label: t('nav.sessions') },
        { to: '/admin/reports', icon: FileText, label: t('nav.reports') },
        { to: '/admin/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/admin/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    if (user.role === 'PROFESSOR') {
      return [
        { to: '/professor/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { to: '/professor/sessions', icon: Calendar, label: t('nav.sessions') },
        { to: '/professor/today', icon: Clock, label: t('nav.today') },
        { to: '/professor/reports', icon: FileText, label: t('nav.reports') },
        { to: '/professor/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/professor/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    if (user.role === 'STUDENT') {
      return [
        { to: '/student/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { to: '/student/today', icon: Clock, label: 'My Attendance' },
        { to: '/student/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/student/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    return [
      { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-primary">{t('brand')}</h1>
            
            {/* Role Indicator */}
            <div className={`mt-3 px-3 py-2 rounded-lg ${
              user.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/30' :
              user.role === 'PROFESSOR' ? 'bg-blue-100 dark:bg-blue-900/30' :
              'bg-green-100 dark:bg-green-900/30'
            }`}>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Accessing as:</p>
              <p className={`text-sm font-bold ${
                user.role === 'ADMIN' ? 'text-red-700 dark:text-red-300' :
                user.role === 'PROFESSOR' ? 'text-blue-700 dark:text-blue-300' :
                'text-green-700 dark:text-green-300'
              }`}>
                {user.role === 'ADMIN' ? '👨‍💼 Administrator' :
                 user.role === 'PROFESSOR' ? '👨‍🏫 Professor' :
                 '👨‍🎓 Student'}
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
