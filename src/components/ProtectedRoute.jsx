import { Navigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAppStore((state) => state.user);

  // Check if user is logged in (has a valid email)
  if (!user || !user.email) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they don't have access
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'PROFESSOR') {
      return <Navigate to="/professor/dashboard" replace />;
    } else if (user.role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
