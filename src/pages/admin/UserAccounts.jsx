import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import useAppStore from '../../store/useAppStore';
import { Search, Eye, EyeOff, Copy, Lock, Unlock } from 'lucide-react';

const UserAccounts = () => {
  const { students, professors, admins, updateStudent, updateProfessor } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [filterRole, setFilterRole] = useState('ALL');

  // Combine all users - handle undefined/null arrays
  const allUsers = [
    ...(admins || []).map(u => ({ ...u, role: 'ADMIN' })),
    ...(professors || []).map(u => ({ ...u, role: 'PROFESSOR' })),
    ...(students || []).map(u => ({ ...u, role: 'STUDENT' })),
  ];

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (user.name || user.username || '').toLowerCase().includes(searchLower) ||
      (user.id || '').toString().toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower);
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const toggleAccess = (user) => {
    const newAccess = !user.hasAccess;
    
    if (user.role === 'STUDENT') {
      updateStudent(user.id, { hasAccess: newAccess });
    } else if (user.role === 'PROFESSOR') {
      updateProfessor(user.id, { hasAccess: newAccess });
    }
    
    alert(`Access ${newAccess ? 'granted' : 'revoked'} for ${user.name}`);
  };

  const headers = ['User ID', 'Name', 'Email', 'Password', 'Role', 'Access', 'Actions'];

  const renderRow = (user) => (
    <>
      <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">
        {user.id}
      </td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">
        {user.name}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {user.email}
          <button 
            onClick={() => copyToClipboard(user.email)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Copy size={14} />
          </button>
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {showPasswords[user.id] ? user.password : '••••••••'}
          </code>
          <button 
            onClick={() => togglePasswordVisibility(user.id)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            {showPasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button 
            onClick={() => copyToClipboard(user.password)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Copy size={14} />
          </button>
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={
          user.role === 'ADMIN' ? 'danger' :
          user.role === 'PROFESSOR' ? 'primary' :
          'success'
        }>
          {user.role}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={user.hasAccess ? 'success' : 'danger'}>
          {user.hasAccess ? 'Active' : 'Disabled'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        {user.role !== 'ADMIN' && (
          <button
            onClick={() => toggleAccess(user)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title={user.hasAccess ? 'Revoke Access' : 'Grant Access'}
          >
            {user.hasAccess ? (
              <Lock size={16} className="text-red-500" />
            ) : (
              <Unlock size={16} className="text-green-500" />
            )}
          </button>
        )}
      </td>
    </>
  );

  const stats = [
    { label: 'Total Users', value: allUsers.length, color: 'bg-blue-500' },
    { label: 'Students', value: (students || []).length, color: 'bg-green-500' },
    { label: 'Professors', value: (professors || []).length, color: 'bg-purple-500' },
    { label: 'Admins', value: (admins || []).length, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Accounts</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View and manage all user accounts and credentials
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white w-12 h-12 flex items-center justify-center`}>
                <span className="text-xl font-bold">{stat.value}</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'ADMIN', 'PROFESSOR', 'STUDENT'].map(role => (
              <Button
                key={role}
                variant={filterRole === role ? 'primary' : 'secondary'}
                onClick={() => setFilterRole(role)}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card title={`User Accounts (${filteredUsers.length})`}>
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Security Notice:</strong> Keep these credentials secure. Only share them with authorized users through secure channels.
          </p>
        </div>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No users found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {searchTerm || filterRole !== 'ALL' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by enrolling new users to the system'}
            </p>
            <Button onClick={() => window.location.href = '/admin/enroll'}>
              Enroll New User
            </Button>
          </div>
        ) : (
          <Table headers={headers} data={filteredUsers} renderRow={renderRow} />
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">
              {allUsers.filter(u => u.hasAccess).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Users with system access
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Disabled Users</h3>
            <p className="text-2xl font-bold text-red-600">
              {allUsers.filter(u => !u.hasAccess).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Users without access
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Recent Enrollments</h3>
            <p className="text-2xl font-bold text-blue-600">
              {allUsers.filter(u => {
                const enrollDate = new Date(u.enrolledDate || '2025-01-01');
                const daysDiff = Math.floor((new Date() - enrollDate) / (1000 * 60 * 60 * 24));
                return daysDiff <= 7;
              }).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              In the last 7 days
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserAccounts;
