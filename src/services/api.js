/**
 * API Service for SmartID Backend Integration
 * This will replace mockApi.js when backend is ready
 */

import axios from 'axios';

// API Configuration - Use relative path when served by Django
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for face recognition
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Methods
export const apiService = {
  // ============================================
  // Authentication
  // ============================================
  
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/users/login/', {
        email,
        password,
        role,
      });
      
      // Store tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/users/me/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user' };
    }
  },

  // ============================================
  // Facial Recognition
  // ============================================

  enrollFace: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('image', imageFile);

      const response = await api.post('/authentication/faces/enroll/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Face enrollment failed' };
    }
  },

  verifyFace: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/authentication/faces/verify/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Face verification failed' };
    }
  },

  verifyFaceCamera: async (duration = 5) => {
    try {
      const response = await api.post('/authentication/faces/verify_camera/', {
        duration,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Camera verification failed' };
    }
  },

  getFaceStats: async () => {
    try {
      const response = await api.get('/authentication/faces/stats/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get stats' };
    }
  },

  // ============================================
  // Users
  // ============================================

  getUsers: async () => {
    try {
      const response = await api.get('/auth/users/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get users' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/auth/users/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create user' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/auth/users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  toggleUserAccess: async (userId) => {
    try {
      const response = await api.patch(`/auth/users/${userId}/toggle_access/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to toggle access' };
    }
  },

  // ============================================
  // Courses
  // ============================================

  getCourses: async () => {
    try {
      const response = await api.get('/courses/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get courses' };
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses/', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create course' };
    }
  },

  // ============================================
  // Attendance
  // ============================================

  getSessions: async () => {
    try {
      const response = await api.get('/attendance/sessions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get sessions' };
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await api.post('/attendance/sessions/', sessionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create session' };
    }
  },

  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/records/', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to mark attendance' };
    }
  },

  getAttendanceRecords: async () => {
    try {
      const response = await api.get('/attendance/records/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get attendance records' };
    }
  },
};

// Helper function to convert base64 to File
export const base64ToFile = (base64String, filename = 'image.jpg') => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};

export default api;
