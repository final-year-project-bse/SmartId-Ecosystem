import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@smartid.edu',
    role: 'ADMIN', // ADMIN | PROFESSOR | STUDENT
  },
  
  setUser: (user) => set({ user }),
  
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
  
  courses: [
    { id: '1', name: 'Computer Science 101', code: 'CS101', professorId: 'P001', professor: 'Dr. Smith', schedule: 'Mon/Wed 9:00-10:30' },
    { id: '2', name: 'Data Structures', code: 'CS201', professorId: 'P002', professor: 'Dr. Johnson', schedule: 'Tue/Thu 11:00-12:30' },
    { id: '3', name: 'Web Development', code: 'CS301', professorId: 'P001', professor: 'Dr. Williams', schedule: 'Mon/Wed 14:00-15:30' },
  ],
  
  students: [
    { id: 'S001', name: 'Ahmed Ali', email: 'ahmed@student.edu', password: 'student123', enrolledCourses: ['1', '2'], status: 'active', enrolledDate: '2025-09-01', hasAccess: true },
    { id: 'S002', name: 'Fatima Khan', email: 'fatima@student.edu', password: 'student123', enrolledCourses: ['1', '3'], status: 'active', enrolledDate: '2025-09-01', hasAccess: true },
    { id: 'S003', name: 'Hassan Raza', email: 'hassan@student.edu', password: 'student123', enrolledCourses: ['2'], status: 'active', enrolledDate: '2025-09-05', hasAccess: true },
    { id: 'S004', name: 'Sara Ahmed', email: 'sara@student.edu', password: 'student123', enrolledCourses: ['1', '2', '3'], status: 'active', enrolledDate: '2025-09-01', hasAccess: true },
    { id: 'S005', name: 'Ali Khan', email: 'ali@student.edu', password: 'student123', enrolledCourses: ['3'], status: 'active', enrolledDate: '2025-09-10', hasAccess: true },
  ],
  
  professors: [
    { id: 'P001', name: 'Dr. Smith', email: 'smith@professor.edu', password: 'prof123', courses: ['1', '3'], status: 'active', hasAccess: true },
    { id: 'P002', name: 'Dr. Johnson', email: 'johnson@professor.edu', password: 'prof123', courses: ['2'], status: 'active', hasAccess: true },
  ],
  
  admins: [
    { id: 'A001', name: 'Admin User', email: 'admin@smartid.edu', password: 'admin123', status: 'active', hasAccess: true },
  ],
  
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
  
  enrollments: [
    { id: '1', studentId: 'S001', courseId: '1', studentName: 'Ahmed Ali' },
    { id: '2', studentId: 'S002', courseId: '1', studentName: 'Fatima Khan' },
    { id: '3', studentId: 'S003', courseId: '2', studentName: 'Hassan Raza' },
    { id: '4', studentId: 'S004', courseId: '1', studentName: 'Sara Ahmed' },
    { id: '5', studentId: 'S004', courseId: '2', studentName: 'Sara Ahmed' },
    { id: '6', studentId: 'S004', courseId: '3', studentName: 'Sara Ahmed' },
  ],
  
  sessions: [
    { id: '1', courseId: '1', date: '2025-11-13', startTime: '09:00', endTime: '10:30', status: 'completed' },
    { id: '2', courseId: '2', date: '2025-11-13', startTime: '11:00', endTime: '12:30', status: 'active' },
    { id: '3', courseId: '1', date: '2025-11-12', startTime: '09:00', endTime: '10:30', status: 'completed' },
  ],
  
  attendance: [
    { id: '1', sessionId: '1', studentId: 'S001', status: 'present', timestamp: '2025-11-13T09:05:00', arrivalStatus: 'on-time' },
    { id: '2', sessionId: '1', studentId: 'S002', status: 'present', timestamp: '2025-11-13T09:15:00', arrivalStatus: 'late' },
    { id: '3', sessionId: '1', studentId: 'S004', status: 'absent', timestamp: null, arrivalStatus: 'absent' },
    { id: '4', sessionId: '2', studentId: 'S003', status: 'present', timestamp: '2025-11-13T11:02:00', arrivalStatus: 'on-time' },
    { id: '5', sessionId: '2', studentId: 'S004', status: 'present', timestamp: '2025-11-13T11:20:00', arrivalStatus: 'late' },
    { id: '6', sessionId: '3', studentId: 'S001', status: 'present', timestamp: '2025-11-12T09:03:00', arrivalStatus: 'on-time' },
    { id: '7', sessionId: '3', studentId: 'S002', status: 'present', timestamp: '2025-11-12T09:08:00', arrivalStatus: 'on-time' },
    { id: '8', sessionId: '3', studentId: 'S004', status: 'present', timestamp: '2025-11-12T09:25:00', arrivalStatus: 'late' },
  ],
  
  updateAttendance: (id, updates) => set((state) => ({
    attendance: state.attendance.map(a => a.id === id ? { ...a, ...updates } : a),
  })),
  
  notifications: [
    { id: '1', title: 'Session Started', message: 'CS101 session has started', read: false, timestamp: '2025-11-13T09:00:00', role: 'ALL' },
    { id: '2', title: 'Low Attendance', message: 'CS201 has low attendance today', read: false, timestamp: '2025-11-13T08:30:00', role: 'PROFESSOR' },
    { id: '3', title: 'Attendance Marked', message: 'Your attendance has been marked for CS101', read: false, timestamp: '2025-11-13T09:05:00', role: 'STUDENT' },
  ],
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
  })),
}));

export default useAppStore;
