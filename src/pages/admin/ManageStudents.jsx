import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import useAppStore from '../../store/useAppStore';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';

const ManageStudents = () => {
  const { students, courses, deleteStudent } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        // Delete from backend
        const response = await fetch(`/api/auth/users/${studentId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          // Delete from store
          deleteStudent(studentId);
          alert('Student deleted successfully');
        } else {
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  const safeStudents = students || [];
  const safeCourses = courses || [];

  const filteredStudents = safeStudents.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.name || student.username || '').toLowerCase().includes(searchLower) ||
      (student.id || '').toString().toLowerCase().includes(searchLower) ||
      (student.email || '').toLowerCase().includes(searchLower)
    );
  });

  const headers = ['Student ID', 'Name', 'Email', 'Enrolled Courses', 'Status', 'Actions'];

  const renderRow = (student) => (
    <>
      <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">{student.id}</td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{student.name || student.username}</td>
      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
      <td className="py-3 px-4 text-sm">
        <div className="flex flex-wrap gap-1">
          {(student.enrolledCourses || []).map(courseId => {
            const course = safeCourses.find(c => c.id === courseId);
            return course ? (
              <Badge key={courseId} variant="primary" className="text-xs">
                {course.code}
              </Badge>
            ) : null;
          })}
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={student.status === 'active' ? 'success' : 'default'}>
          {student.status || 'active'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Edit functionality coming soon!')}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
            title="Edit Student"
          >
            <Edit size={16} className="text-primary" />
          </button>
          <button 
            onClick={() => handleDelete(student.id)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
            title="Delete Student"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Manage Students</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            View and manage all enrolled students
          </p>
        </div>
        <Button onClick={() => window.location.href = '/admin/enroll'} className="flex items-center gap-2">
          <UserPlus size={20} />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{safeStudents.length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Students</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{safeStudents.filter(s => s.status === 'active').length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Active</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {safeStudents.length > 0 ? Math.round(safeStudents.reduce((sum, s) => sum + (s.enrolledCourses || []).length, 0) / safeStudents.length) : 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Avg Courses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Current Period</p>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="secondary">Filter</Button>
        </div>
      </Card>

      {/* Students Table */}
      <Card title={`Students (${filteredStudents.length})`}>
        <Table headers={headers} data={filteredStudents} renderRow={renderRow} />
      </Card>
    </div>
  );
};

export default ManageStudents;
