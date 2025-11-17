import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Globe, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import useAppStore from '../../store/useAppStore';

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = () => {
    // Clear user data
    useAppStore.setState({ 
      user: { 
        id: '', 
        username: '', 
        email: '', 
        role: '' 
      } 
    });
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

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          aria-label="Toggle language"
        >
          <Globe size={20} />
          <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
        </button>

        {/* Role Badge - Prominent Display */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${
          user.role === 'ADMIN' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
          user.role === 'PROFESSOR' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
          'bg-green-50 dark:bg-green-900/20 border-green-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            user.role === 'ADMIN' ? 'bg-red-500' :
            user.role === 'PROFESSOR' ? 'bg-blue-500' :
            'bg-green-500'
          } animate-pulse`} />
          <span className={`text-sm font-bold ${
            user.role === 'ADMIN' ? 'text-red-700 dark:text-red-300' :
            user.role === 'PROFESSOR' ? 'text-blue-700 dark:text-blue-300' :
            'text-green-700 dark:text-green-300'
          }`}>
            {user.role === 'ADMIN' ? '👨‍💼 ADMIN' :
             user.role === 'PROFESSOR' ? '👨‍🏫 PROFESSOR' :
             '👨‍🎓 STUDENT'}
          </span>
        </div>

        <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700">
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
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <User size={16} />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <SettingsIcon size={16} />
                  Settings
                </button>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                
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
