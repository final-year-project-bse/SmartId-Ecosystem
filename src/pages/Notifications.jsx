import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const { t } = useTranslation();
  const { notifications, markNotificationRead } = useAppStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.notifications')}</h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Bell size={48} className="mb-4" />
              <p>No notifications</p>
            </div>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{notif.title}</h3>
                    {!notif.read && <Badge variant="primary">New</Badge>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">{notif.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {format(new Date(notif.timestamp), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
                {!notif.read && (
                  <Button
                    onClick={() => markNotificationRead(notif.id)}
                    variant="secondary"
                    className="text-sm"
                  >
                    {t('buttons.markRead')}
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
