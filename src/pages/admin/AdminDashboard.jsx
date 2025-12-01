import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import useAppStore from '../../store/useAppStore';
import { Users, BookOpen, UserCheck, Settings as SettingsIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { students, courses, attendanceMethods } = useAppStore();

  const safeStudents = students || [];
  const safeCourses = courses || [];
  const safeMethods = attendanceMethods || {};

  const stats = [
    { label: 'Total Students', value: safeStudents.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Courses', value: safeCourses.length, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Active Students', value: safeStudents.filter(s => s.status === 'active').length, icon: UserCheck, color: 'bg-purple-500' },
    { label: 'Attendance Methods', value: Object.values(safeMethods).filter(m => m.enabled).length, icon: SettingsIcon, color: 'bg-orange-500' },
  ];

  const recentEnrollments = safeStudents.slice(-5).reverse();

  const headers = ['Student ID', 'Name', 'Email', 'Courses', 'Status', 'Enrolled Date'];

  const renderRow = (student) => (
    <>
      <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">{student.id}</td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{student.name || student.username}</td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
      <td className="py-3 px-4 text-sm">
        <Badge variant="primary">{(student.enrolledCourses || []).length} courses</Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={student.status === 'active' ? 'success' : 'default'}>
          {student.status || 'active'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.enrolledDate || student.date_joined || 'N/A'}</td>
    </>
  );

  console.log('AdminDashboard rendering', { students: safeStudents, courses: safeCourses, methods: safeMethods });

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
          {Object.entries(safeMethods).map(([key, method]) => (
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
        {recentEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No students enrolled yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Start by enrolling students to the system</p>
            <a href="/admin/enroll" className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
              Enroll New Student
            </a>
          </div>
        ) : (
          <Table headers={headers} data={recentEnrollments} renderRow={renderRow} />
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
