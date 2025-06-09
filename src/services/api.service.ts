import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Monitoring endpoints
  getMonitoringData: () => api.get('/monitoring'),
  
  // Settings endpoints
  getUserSettings: () => api.get('/settings'),
  updateSettings: (settings: any) => api.put('/settings', settings),
  
  // Notifications endpoints
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
};