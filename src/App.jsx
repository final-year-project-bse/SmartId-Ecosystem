import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import Enroll from './pages/Enroll';
import Authenticate from './pages/Authenticate';
import Today from './pages/Today';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ManageStudents from './pages/admin/ManageStudents';
import AttendanceMethods from './pages/admin/AttendanceMethods';
import UserAccounts from './pages/admin/UserAccounts';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './i18n/config';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Portal Routes - ONLY ADMIN ACCESS */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="attendance-methods" element={<AttendanceMethods />} />
            <Route path="accounts" element={<UserAccounts />} />
            <Route path="enroll" element={<Enroll />} />
            <Route path="authenticate" element={<Authenticate />} />
            <Route path="today" element={<Today />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
