import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('codepulse_token') || localStorage.getItem('codepulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('codepulse_token');
      sessionStorage.removeItem('codepulse_user');
      localStorage.removeItem('codepulse_token');
      localStorage.removeItem('codepulse_user');
    }
    return Promise.reject(error);
  }
);

export default api;
