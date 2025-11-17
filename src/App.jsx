import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Enroll from './pages/Enroll';
import Authenticate from './pages/Authenticate';
import Sessions from './pages/Sessions';
import Today from './pages/Today';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import ManageStudents from './pages/admin/ManageStudents';
import AttendanceMethods from './pages/admin/AttendanceMethods';
import UserAccounts from './pages/admin/UserAccounts';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './i18n/config';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Landing Page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected App Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="enroll" element={<Enroll />} />
            <Route path="authenticate" element={<Authenticate />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="today" element={<Today />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="attendance-methods" element={<AttendanceMethods />} />
            <Route path="accounts" element={<UserAccounts />} />
            <Route path="enroll" element={<Enroll />} />
            <Route path="authenticate" element={<Authenticate />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="today" element={<Today />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Professor Portal Routes */}
          <Route path="/professor" element={<ProtectedRoute allowedRoles={['PROFESSOR']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<ProfessorDashboard />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="today" element={<Today />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Student Portal Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="today" element={<Today />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
