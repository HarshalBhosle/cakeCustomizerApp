// src/services/api.js
import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests when user is logged in
api.interceptors.request.use(async config => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;