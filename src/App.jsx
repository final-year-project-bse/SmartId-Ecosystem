import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './i18n/config';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* App Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="enroll" element={<Enroll />} />
            <Route path="authenticate" element={<Authenticate />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="today" element={<Today />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="admin/students" element={<ManageStudents />} />
            <Route path="admin/attendance-methods" element={<AttendanceMethods />} />
            <Route path="admin/accounts" element={<UserAccounts />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
