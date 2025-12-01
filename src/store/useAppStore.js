import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      user: {
        id: '',
        username: '',
        email: '',
        role: '', // ADMIN | PROFESSOR | STUDENT
      },
      
      setUser: (user) => {
        set({ user });
        // Also save to localStorage for backup
        if (user && user.email) {
          localStorage.setItem('smartid_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('smartid_user');
        }
      },
      
      logout: () => {
        set({ 
          user: {
            id: '',
            username: '',
            email: '',
            role: '',
          }
        });
        localStorage.removeItem('smartid_user');
      },
  
  // Attendance Methods Configuration
  attendanceMethods: {
    face: { enabled: true, name: 'Face Recognition' },
    fingerprint: { enabled: true, name: 'Fingerprint' },
    rfid: { enabled: true, name: 'RFID Card' },
    qr: { enabled: false, name: 'QR Code' },
  },
  
  setAttendanceMethod: (method, enabled) => set((state) => ({
    attendanceMethods: {
      ...state.attendanceMethods,
      [method]: { ...state.attendanceMethods[method], enabled },
    },
  })),
  
  courses: [],
  
  students: [],
  
  professors: [],
  
  setCourses: (courses) => set({ courses }),
  
  setStudents: (students) => set({ students }),
  
  deleteStudent: (studentId) => set((state) => ({
    students: state.students.filter(student => student.id !== studentId),
  })),
  
  setProfessors: (professors) => set({ professors }),
  
  addStudent: (student) => set((state) => ({
    students: [...state.students, student],
  })),
  
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(s => s.id === id ? { ...s, ...updates } : s),
  })),
  
  addProfessor: (professor) => set((state) => ({
    professors: [...state.professors, professor],
  })),
  
  updateProfessor: (id, updates) => set((state) => ({
    professors: state.professors.map(p => p.id === id ? { ...p, ...updates } : p),
  })),
  
  enrollments: [],
  
  sessions: [],
  
  attendance: [],
  
  notifications: [],
  
  setEnrollments: (enrollments) => set({ enrollments }),
  
  setSessions: (sessions) => set({ sessions }),
  
  setAttendance: (attendance) => set({ attendance }),
  
  updateAttendance: (id, updates) => set((state) => ({
    attendance: state.attendance.map(a => a.id === id ? { ...a, ...updates } : a),
  })),
  
  setNotifications: (notifications) => set({ notifications }),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
  })),
    }),
    {
      name: 'smartid-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user,
        attendanceMethods: state.attendanceMethods,
      }), // only persist user and settings
    }
  )
);

export default useAppStore;
