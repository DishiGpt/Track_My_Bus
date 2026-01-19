import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  requestOTP: (phone, email, purpose) =>
    api.post('/auth/request-otp', { phone, email, purpose }),
  signup: (name, phone, email, otp, password) =>
    api.post('/auth/signup', { name, phone, email, otp, password }),
  login: (phone, email, otp) =>
    api.post('/auth/login', { phone, email, otp }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (name, email) =>
    api.put('/auth/profile', { name, email }),
};

// Bus endpoints
export const busAPI = {
  getBusesForToday: () => api.get('/bus/today'),
  getAllBuses: () => api.get('/bus'),
  createBus: (busData) => api.post('/bus', busData),
  updateBus: (id, busData) => api.put(`/bus/${id}`, busData),
  deleteBus: (id) => api.delete(`/bus/${id}`),
  updateLocation: (latitude, longitude) =>
    api.post('/bus/location', { latitude, longitude }),
};

// Driver endpoints
export const driverAPI = {
  getAllDrivers: () => api.get('/driver'),
  createDriver: (driverData) => api.post('/driver', driverData),
  updateDriver: (id, driverData) => api.put(`/driver/${id}`, driverData),
  deleteDriver: (id) => api.delete(`/driver/${id}`),
  getAssignedBus: () => api.get('/driver/assigned-bus'),
};

// Route endpoints
export const routeAPI = {
  getAllRoutes: () => api.get('/route'),
  createRoute: (routeData) => api.post('/route', routeData),
  updateRoute: (id, routeData) => api.put(`/route/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/route/${id}`),
};

export default api;
