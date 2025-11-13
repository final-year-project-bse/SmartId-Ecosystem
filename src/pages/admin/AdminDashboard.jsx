import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import useAppStore from '../../store/useAppStore';
import { Users, BookOpen, UserCheck, Settings as SettingsIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { students, courses, attendance, attendanceMethods } = useAppStore();

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Active Students', value: students.filter(s => s.status === 'active').length, icon: UserCheck, color: 'bg-purple-500' },
    { label: 'Attendance Methods', value: Object.values(attendanceMethods).filter(m => m.enabled).length, icon: SettingsIcon, color: 'bg-orange-500' },
  ];

  const recentEnrollments = students.slice(-5).reverse();

  const headers = ['Student ID', 'Name', 'Email', 'Courses', 'Status', 'Enrolled Date'];

  const renderRow = (student) => (
    <>
      <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">{student.id}</td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{student.name}</td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
      <td className="py-3 px-4 text-sm">
        <Badge variant="primary">{student.enrolledCourses.length} courses</Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={student.status === 'active' ? 'success' : 'default'}>
          {student.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.enrolledDate}</td>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage students, courses, and attendance methods</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Attendance Methods Status */}
      <Card title="Attendance Methods Configuration">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(attendanceMethods).map(([key, method]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{method.name}</p>
                <Badge variant={method.enabled ? 'success' : 'default'} className="mt-1">
                  {method.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Enrollments */}
      <Card title="Recent Student Enrollments">
        <Table headers={headers} data={recentEnrollments} renderRow={renderRow} />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center py-6">
            <Users className="mx-auto mb-3 text-primary" size={32} />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Enroll Students</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Add new students to the system</p>
            <a href="/enroll" className="text-primary hover:text-primary-600 font-medium text-sm">
              Go to Enrollment →
            </a>
          </div>
        </Card>

        <Card>
          <div className="text-center py-6">
            <SettingsIcon className="mx-auto mb-3 text-primary" size={32} />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Configure Methods</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage attendance methods</p>
            <a href="/admin/attendance-methods" className="text-primary hover:text-primary-600 font-medium text-sm">
              Configure Settings →
            </a>
          </div>
        </Card>

        <Card>
          <div className="text-center py-6">
            <BookOpen className="mx-auto mb-3 text-primary" size={32} />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">View Reports</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Access attendance reports</p>
            <a href="/reports" className="text-primary hover:text-primary-600 font-medium text-sm">
              View Reports →
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
