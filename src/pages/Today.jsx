import { useTranslation } from 'react-i18next';
import AttendanceChart from '../components/attendance/AttendanceChart';
import AttendanceByDate from '../components/attendance/AttendanceByDate';
import useAppStore from '../store/useAppStore';
import { aggregateAttendanceForChart, aggregateAttendanceByDate } from '../utils/attendance';
import { format } from 'date-fns';

const Today = () => {
  const { t } = useTranslation();
  const { attendance, sessions, courses } = useAppStore();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = sessions.filter(s => s.date === today);
  const todayAttendance = attendance.filter(a => 
    todaySessions.some(s => s.id === a.sessionId)
  );

  const chartData = aggregateAttendanceForChart(todayAttendance, todaySessions);
  const tableData = aggregateAttendanceByDate(todayAttendance, todaySessions, courses);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.today')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
      </div>

      <AttendanceChart data={chartData.length > 0 ? chartData : [{ date: today, present: 0, absent: 0 }]} />
      
      <AttendanceByDate data={tableData.length > 0 ? tableData : []} />
    </div>
  );
};

export default Today;
