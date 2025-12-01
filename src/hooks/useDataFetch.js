import { useEffect } from 'react';
import { apiService } from '../services/api';
import useAppStore from '../store/useAppStore';

/**
 * Custom hook to fetch and sync data from backend
 */
export const useDataFetch = () => {
  const { 
    setCourses, 
    setStudents, 
    setProfessors,
    setEnrollments,
    setSessions,
    setAttendance,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesData = await apiService.getCourses();
        if (coursesData.results) {
          setCourses(coursesData.results);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }

      try {
        // Fetch users
        const usersData = await apiService.getUsers();
        if (usersData.results) {
          const students = usersData.results.filter(u => u.role === 'STUDENT');
          const professors = usersData.results.filter(u => u.role === 'PROFESSOR');
          setStudents(students);
          setProfessors(professors);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      try {
        // Fetch sessions
        const sessionsData = await apiService.getSessions();
        if (sessionsData.results) {
          setSessions(sessionsData.results);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }

      try {
        // Fetch attendance records
        const attendanceData = await apiService.getAttendanceRecords();
        if (attendanceData.results) {
          setAttendance(attendanceData.results);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchData();
  }, [setCourses, setStudents, setProfessors, setEnrollments, setSessions, setAttendance]);
};
