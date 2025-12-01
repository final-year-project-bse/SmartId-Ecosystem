import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import useAppStore from '../../store/useAppStore';

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);



  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    // Clear user data using store logout function
    logout();
    // Redirect to login
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Theme Toggle - Moved to Front */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.username}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              user.role === 'ADMIN' ? 'bg-red-500' :
              user.role === 'PROFESSOR' ? 'bg-blue-500' :
              'bg-green-500'
            }`}>
              {user.username[0]?.toUpperCase()}
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-20">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                

                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
