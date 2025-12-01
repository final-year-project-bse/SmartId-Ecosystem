import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import AttendanceChart from '../components/attendance/AttendanceChart';
import AttendanceByDate from '../components/attendance/AttendanceByDate';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { aggregateAttendanceForChart, aggregateAttendanceByDate } from '../utils/attendance';
import { Download } from 'lucide-react';

const Reports = () => {
  const { t } = useTranslation();
  const { courses, attendance, sessions } = useAppStore();
  const [filters, setFilters] = useState({
    courseId: 'all',
    startDate: '',
    endDate: '',
  });

  const safeCourses = courses || [];
  const safeAttendance = attendance || [];
  const safeSessions = sessions || [];

  const courseOptions = [
    { value: 'all', label: 'All Courses' },
    ...safeCourses.map(c => ({ value: c.id, label: c.name })),
  ];

  const filteredSessions = safeSessions.filter(s => {
    if (filters.courseId !== 'all' && s.courseId !== filters.courseId) return false;
    if (filters.startDate && s.date < filters.startDate) return false;
    if (filters.endDate && s.date > filters.endDate) return false;
    return true;
  });

  const filteredAttendance = safeAttendance.filter(a =>
    filteredSessions.some(s => s.id === a.sessionId)
  );

  const chartData = aggregateAttendanceForChart(filteredAttendance, filteredSessions);
  const tableData = aggregateAttendanceByDate(filteredAttendance, filteredSessions, safeCourses);

  const exportToCSV = () => {
    const headers = ['Date', 'Course', 'Present', 'Absent', 'Percentage'];
    const rows = tableData.map(row => [
      row.date,
      row.course,
      row.present,
      row.absent,
      `${row.percentage}%`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('nav.reports')}</h1>

      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label={t('labels.course')}
            options={courseOptions}
            value={filters.courseId}
            onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
          />
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <Button onClick={exportToCSV} variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            {t('buttons.export')}
          </Button>
        </div>
      </Card>

      <AttendanceChart data={chartData} />
      
      <AttendanceByDate data={tableData} />
    </div>
  );
};

export default Reports;
