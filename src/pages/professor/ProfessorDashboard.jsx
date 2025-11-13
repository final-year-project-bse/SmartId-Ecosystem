import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import useAppStore from '../../store/useAppStore';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ProfessorDashboard = () => {
  const { courses, students, sessions, attendance } = useAppStore();

  // Get today's sessions
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = sessions.filter(s => s.date === today);
  
  // Get current session attendance details
  const activeSession = todaySessions.find(s => s.status === 'active');
  let sessionAttendance = [];
  
  if (activeSession) {
    const course = courses.find(c => c.id === activeSession.courseId);
    const enrolledStudents = students.filter(s => s.enrolledCourses.includes(activeSession.courseId));
    
    sessionAttendance = enrolledStudents.map(student => {
      const attendanceRecord = attendance.find(
        a => a.sessionId === activeSession.id && a.studentId === student.id
      );
      
      return {
        ...student,
        attendance: attendanceRecord || { status: 'pending', arrivalStatus: 'pending' },
      };
    });
  }

  const stats = [
    { 
      label: 'My Courses', 
      value: courses.length, 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Present Today', 
      value: attendance.filter(a => {
        const session = sessions.find(s => s.id === a.sessionId);
        return session?.date === today && a.status === 'present';
      }).length,
      icon: CheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Late Arrivals', 
      value: attendance.filter(a => {
        const session = sessions.find(s => s.id === a.sessionId);
        return session?.date === today && a.arrivalStatus === 'late';
      }).length,
      icon: Clock, 
      color: 'bg-orange-500' 
    },
    { 
      label: 'Absent', 
      value: attendance.filter(a => {
        const session = sessions.find(s => s.id === a.sessionId);
        return session?.date === today && a.status === 'absent';
      }).length,
      icon: AlertCircle, 
      color: 'bg-red-500' 
    },
  ];

  const headers = ['Student ID', 'Name', 'Status', 'Arrival Time', 'Arrival Status'];

  const renderRow = (student) => {
    const att = student.attendance;
    return (
      <>
        <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">{student.id}</td>
        <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{student.name}</td>
        <td className="py-3 px-4 text-sm">
          <Badge variant={
            att.status === 'present' ? 'success' : 
            att.status === 'absent' ? 'danger' : 
            'default'
          }>
            {att.status || 'Pending'}
          </Badge>
        </td>
        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
          {att.timestamp ? format(new Date(att.timestamp), 'hh:mm a') : '-'}
        </td>
        <td className="py-3 px-4 text-sm">
          <Badge variant={
            att.arrivalStatus === 'on-time' ? 'success' : 
            att.arrivalStatus === 'late' ? 'warning' : 
            att.arrivalStatus === 'absent' ? 'danger' :
            'default'
          }>
            {att.arrivalStatus === 'on-time' ? 'On Time' :
             att.arrivalStatus === 'late' ? 'Late' :
             att.arrivalStatus === 'absent' ? 'Absent' :
             'Pending'}
          </Badge>
        </td>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Professor Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Monitor class attendance and student status</p>
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

      {/* Active Session */}
      {activeSession ? (
        <Card title={`Active Session: ${courses.find(c => c.id === activeSession.courseId)?.name}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Session Time: {activeSession.startTime} - {activeSession.endTime}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Students: {sessionAttendance.length}
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <Table headers={headers} data={sessionAttendance} renderRow={renderRow} />
        </Card>
      ) : (
        <Card title="No Active Session">
          <div className="text-center py-12">
            <Clock className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-600 dark:text-slate-400 mb-4">No active session at the moment</p>
            <a href="/sessions" className="text-primary hover:text-primary-600 font-medium">
              Start a Session →
            </a>
          </div>
        </Card>
      )}

      {/* My Courses */}
      <Card title="My Courses">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => {
            const enrolledCount = students.filter(s => s.enrolledCourses.includes(course.id)).length;
            return (
              <div key={course.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{course.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{course.code}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {enrolledCount} students
                  </span>
                  <Badge variant="primary">{course.schedule}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
