import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import AttendanceChart from '../../components/attendance/AttendanceChart';
import useAppStore from '../../store/useAppStore';
import { BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const { courses, sessions, attendance } = useAppStore();
  
  // Assuming current user is a student with ID
  const studentId = 'S001'; // This should come from user.id in real implementation
  
  // Get student's enrolled courses
  const enrolledCourses = courses.filter(c => ['1', '2'].includes(c.id)); // Mock data
  
  // Get student's attendance records
  const myAttendance = attendance.filter(a => a.studentId === studentId);
  
  // Calculate statistics
  const totalSessions = sessions.length;
  const presentCount = myAttendance.filter(a => a.status === 'present').length;
  const lateCount = myAttendance.filter(a => a.arrivalStatus === 'late').length;
  const absentCount = myAttendance.filter(a => a.status === 'absent').length;
  const attendancePercentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Present', value: presentCount, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Late Arrivals', value: lateCount, icon: Clock, color: 'bg-orange-500' },
    { label: 'Absent', value: absentCount, icon: XCircle, color: 'bg-red-500' },
  ];

  // Prepare attendance data for chart
  const chartData = sessions.map(session => {
    const course = courses.find(c => c.id === session.courseId);
    const att = myAttendance.find(a => a.sessionId === session.id);
    
    return {
      date: session.date,
      course: course?.code || 'Unknown',
      present: att?.status === 'present' ? 1 : 0,
      absent: att?.status === 'absent' ? 1 : 0,
    };
  });

  // Recent attendance records
  const recentAttendance = sessions.map(session => {
    const course = courses.find(c => c.id === session.courseId);
    const att = myAttendance.find(a => a.sessionId === session.id);
    
    return {
      date: session.date,
      course: course?.name || 'Unknown',
      time: session.startTime,
      status: att?.status || 'pending',
      arrivalTime: att?.timestamp ? format(new Date(att.timestamp), 'hh:mm a') : '-',
      arrivalStatus: att?.arrivalStatus || 'pending',
    };
  }).reverse().slice(0, 10);

  const headers = ['Date', 'Course', 'Class Time', 'Arrival Time', 'Status', 'Arrival Status'];

  const renderRow = (record) => (
    <>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">
        {format(new Date(record.date), 'MMM dd, yyyy')}
      </td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{record.course}</td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{record.time}</td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{record.arrivalTime}</td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={
          record.status === 'present' ? 'success' : 
          record.status === 'absent' ? 'danger' : 
          'default'
        }>
          {record.status === 'present' ? 'Present' : 
           record.status === 'absent' ? 'Absent' : 
           'Pending'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={
          record.arrivalStatus === 'on-time' ? 'success' : 
          record.arrivalStatus === 'late' ? 'warning' : 
          record.arrivalStatus === 'absent' ? 'danger' :
          'default'
        }>
          {record.arrivalStatus === 'on-time' ? 'On Time' :
           record.arrivalStatus === 'late' ? 'Late' :
           record.arrivalStatus === 'absent' ? 'Absent' :
           'Pending'}
        </Badge>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            👨‍🎓
          </div>
          <div>
            <p className="text-sm opacity-90">Accessing as</p>
            <h2 className="text-2xl font-bold">Student Portal</h2>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Track your attendance and course progress</p>
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

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Attendance Overview">
            <AttendanceChart data={chartData} />
          </Card>
        </div>

        <Card title="Overall Attendance">
          <div className="text-center py-8">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - attendancePercentage / 100)}`}
                  className={`${
                    attendancePercentage >= 75 ? 'text-green-500' :
                    attendancePercentage >= 50 ? 'text-orange-500' :
                    'text-red-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {attendancePercentage}%
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {presentCount} out of {totalSessions} classes attended
            </p>
            <Badge variant={
              attendancePercentage >= 75 ? 'success' :
              attendancePercentage >= 50 ? 'warning' :
              'danger'
            }>
              {attendancePercentage >= 75 ? 'Good Standing' :
               attendancePercentage >= 50 ? 'Needs Improvement' :
               'At Risk'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card title="My Courses">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => {
            const courseSessions = sessions.filter(s => s.courseId === course.id);
            const courseAttendance = myAttendance.filter(a => 
              courseSessions.some(s => s.id === a.sessionId)
            );
            const coursePresent = courseAttendance.filter(a => a.status === 'present').length;
            const coursePercentage = courseSessions.length > 0 
              ? Math.round((coursePresent / courseSessions.length) * 100) 
              : 0;

            return (
              <div key={course.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{course.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
                  </div>
                  <Badge variant={coursePercentage >= 75 ? 'success' : 'warning'}>
                    {coursePercentage}%
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Professor:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{course.professor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Schedule:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Attendance:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {coursePresent}/{courseSessions.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Attendance */}
      <Card title="Recent Attendance Records">
        <Table headers={headers} data={recentAttendance} renderRow={renderRow} />
      </Card>
    </div>
  );
};

export default StudentDashboard;
