import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import useAppStore from '../store/useAppStore';
import { Moon, Sun, Globe } from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const user = useAppStore((state) => state.user);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.settings')}</h1>

      <Card title="Appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{t('labels.theme')}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Current: {theme === 'light' ? 'Light' : 'Dark'}
              </p>
            </div>
            <Button onClick={toggleTheme} variant="secondary" className="flex items-center gap-2">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              Toggle Theme
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{t('labels.language')}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Current: {i18n.language === 'en' ? 'English' : 'Urdu'}
              </p>
            </div>
            <Button onClick={toggleLanguage} variant="secondary" className="flex items-center gap-2">
              <Globe size={16} />
              Switch Language
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Profile">
        <div className="space-y-4">
          <Input label={t('labels.username')} value={user.username} disabled />
          <Input label={t('labels.email')} value={user.email} disabled />
          <Input label={t('labels.role')} value={t(`roles.${user.role}`)} disabled />
          <Button variant="secondary">{t('buttons.save')}</Button>
        </div>
      </Card>

      <Card title="Change Role (Testing)">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          To test different roles, modify the user object in <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">src/store/useAppStore.js</code>
        </p>
        <div className="space-y-2 text-sm">
          <p><strong>ADMIN:</strong> Full access to all features</p>
          <p><strong>PROFESSOR:</strong> Can manage sessions and view reports</p>
          <p><strong>STUDENT:</strong> Can view attendance and authenticate</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
