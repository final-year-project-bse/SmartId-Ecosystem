import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const AttendanceChart = ({ data }) => {
  return (
    <Card title="Attendance Overview">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="date" className="text-slate-600 dark:text-slate-400" />
          <YAxis className="text-slate-600 dark:text-slate-400" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-bg-secondary)', 
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem'
            }} 
          />
          <Legend />
          <Bar dataKey="present" fill="#4f46e5" name="Present" radius={[8, 8, 0, 0]} />
          <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttendanceChart;
