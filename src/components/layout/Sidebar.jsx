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
    const commonItems = [
      { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    ];

    if (user.role === 'ADMIN') {
      return [
        ...commonItems,
        { to: '/enroll', icon: UserPlus, label: 'Enroll Users' },
        { to: '/admin/accounts', icon: Key, label: 'User Accounts' },
        { to: '/admin/students', icon: Users, label: 'Manage Students' },
        { to: '/admin/attendance-methods', icon: Fingerprint, label: 'Attendance Methods' },
        { to: '/reports', icon: FileText, label: t('nav.reports') },
        { to: '/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    if (user.role === 'PROFESSOR') {
      return [
        ...commonItems,
        { to: '/sessions', icon: Calendar, label: t('nav.sessions') },
        { to: '/today', icon: Clock, label: t('nav.today') },
        { to: '/reports', icon: FileText, label: t('nav.reports') },
        { to: '/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    if (user.role === 'STUDENT') {
      return [
        ...commonItems,
        { to: '/authenticate', icon: Shield, label: t('nav.authenticate') },
        { to: '/today', icon: Clock, label: 'My Attendance' },
        { to: '/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/settings', icon: Settings, label: t('nav.settings') },
      ];
    }

    return commonItems;
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
