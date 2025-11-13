import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { mockApi } from '../services/mockApi';
import { Play, Square } from 'lucide-react';

const Sessions = () => {
  const { t } = useTranslation();
  const { courses, sessions } = useAppStore();
  const [activeSessions, setActiveSessions] = useState(new Set(sessions.filter(s => s.status === 'active').map(s => s.courseId)));

  const handleStartSession = async (courseId) => {
    const result = await mockApi.startSession(courseId);
    if (result.success) {
      setActiveSessions(new Set([...activeSessions, courseId]));
      alert('Session started successfully!');
    }
  };

  const handleStopSession = async (courseId) => {
    const result = await mockApi.stopSession(courseId);
    if (result.success) {
      const newActive = new Set(activeSessions);
      newActive.delete(courseId);
      setActiveSessions(newActive);
      alert('Session stopped successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.sessions')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isActive = activeSessions.has(course.id);
          
          return (
            <Card key={course.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{course.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
                  </div>
                  <Badge variant={isActive ? 'success' : 'default'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Professor:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{course.professor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Enrolled:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">32 students</span>
                  </div>
                </div>

                {isActive ? (
                  <Button
                    onClick={() => handleStopSession(course.id)}
                    variant="danger"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Square size={16} />
                    {t('buttons.stop')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleStartSession(course.id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    {t('buttons.start')}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Sessions;
