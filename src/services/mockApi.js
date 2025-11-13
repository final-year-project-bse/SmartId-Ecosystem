// Mock API functions for future backend integration

export const mockApi = {
  // Enrollment
  enrollUser: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'User enrolled successfully', userId: Math.random().toString(36).substr(2, 9) });
      }, 1000);
    });
  },

  // Authentication
  authenticateUser: async (faceData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Authentication successful', confidence: 0.95 });
      }, 1500);
    });
  },

  // Sessions
  startSession: async (courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, sessionId: Math.random().toString(36).substr(2, 9) });
      }, 500);
    });
  },

  stopSession: async (sessionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  // Reports
  getAttendanceReport: async (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: [] });
      }, 800);
    });
  },
};
