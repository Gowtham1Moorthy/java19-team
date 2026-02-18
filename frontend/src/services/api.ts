import axios from 'axios';
import type { User, Resource, Booking, DashboardStats, UserStatus } from '../types';
import { supabase } from '../lib/supabase';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to catch network errors
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (e) {
    // Ignore auth errors on request
  }
  return config;
});

// Handle auth errors and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Cannot connect to server. Please check if the backend is running.'));
    }
    
    if (error.response?.status === 401) {
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard');
  return response.data;
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const getUsersByStatus = async (status: UserStatus): Promise<User[]> => {
  const response = await api.get(`/users/status/${status}`);
  return response.data;
};

// Resources
export const getResources = async (): Promise<Resource[]> => {
  const response = await api.get('/resources');
  return response.data;
};

export const getResourceById = async (id: number): Promise<Resource> => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> => {
  const response = await api.post('/resources', resource);
  return response.data;
};

export const updateResource = async (id: number, resource: Partial<Resource>): Promise<Resource> => {
  const response = await api.put(`/resources/${id}`, resource);
  return response.data;
};

export const deleteResource = async (id: number): Promise<void> => {
  await api.delete(`/resources/${id}`);
};

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings');
  return response.data;
};

export const getBookingById = async (id: number): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'userName' | 'userEmail' | 'resourceName' | 'resourceType' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
  const response = await api.post('/bookings', booking);
  return response.data;
};

export const updateBookingStatus = async (id: number, status: string): Promise<Booking> => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};

export default api;
