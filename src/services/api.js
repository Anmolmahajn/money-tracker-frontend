import axios from 'axios';

// API Base URL - change this for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===============================
// Authentication APIs
// ===============================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ===============================
// Transaction APIs
// ===============================
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),     // ✅ Fixed
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),    // ✅ Fixed
  delete: (id) => api.delete(`/transactions/${id}`),   // ✅ Fixed
  getByDateRange: (startDate, endDate) => 
    api.get('/transactions/date-range', { params: { startDate, endDate } }),
  getByCategory: (categoryId) => 
    api.get('/transactions/category', { params: { categoryId } }),
  getSummary: (startDate, endDate) => 
    api.get('/transactions/summary', { params: { startDate, endDate } })
};

// ===============================
// Category APIs
// ===============================
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ===============================
// Budget APIs
// ===============================
export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getAlerts: () => api.get('/budgets/alerts'),
};

// ===============================
// Analytics APIs
// ===============================
export const analyticsAPI = {
  getMonthly: (yearMonth) => api.get(`/analytics/monthly/${yearMonth}`),
  getSummary: (startDate, endDate) => 
    api.get('/analytics/summary', { params: { startDate, endDate } }),
  getCategoryBreakdown: (startDate, endDate) => 
    api.get('/analytics/category-breakdown', { params: { startDate, endDate } }),
};

// ===============================
// Notification APIs
// ===============================
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ===============================
// CSV APIs
// ===============================
export const csvAPI = {
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/csv/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  export: () => api.get('/csv/export', { responseType: 'blob' }),
};

// ===============================
// Email Parsing APIs
// ===============================
export const emailParsingAPI = {
  trigger: () => api.post('/email-parsing/trigger'),
  updateConfig: (config) => api.put('/email-parsing/config', config),
  getConfig: () => api.get('/email-parsing/config'),
  getStatus: () => api.get('/email-parsing/status'),
  test: (credentials) => api.post('/email-parsing/test', credentials),
  disable: () => api.post('/email-parsing/disable'),
};

// ===============================
// User APIs
// ===============================
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  toggleEmailNotifications: () => api.put('/users/toggle-email-notifications'),
  toggleBudgetAlerts: () => api.put('/users/toggle-budget-alerts'),
};

export default api;