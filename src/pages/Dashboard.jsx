import useAppStore from '../store/useAppStore';
import AdminDashboard from './admin/AdminDashboard';
import ProfessorDashboard from './professor/ProfessorDashboard';
import StudentDashboard from './student/StudentDashboard';

const Dashboard = () => {
  const user = useAppStore((state) => state.user);

  // Route to role-specific dashboard
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'PROFESSOR':
      return <ProfessorDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default Dashboard;
