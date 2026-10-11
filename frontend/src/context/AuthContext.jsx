import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Clear any old permanent localStorage tokens on initial mount so new visits start fresh
  useEffect(() => {
    localStorage.removeItem('codepulse_user');
    localStorage.removeItem('codepulse_token');
  }, []);

  // Use sessionStorage so every fresh browser opening requires login/registration
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('codepulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('codepulse_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const data = response.data;
      setToken(data.token);
      setUser(data);
      sessionStorage.setItem('codepulse_token', data.token);
      sessionStorage.setItem('codepulse_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setLoading(false);
      let errorMsg = 'Invalid username or password';
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = 'Cannot connect to backend server. Please make sure the Spring Boot backend is running on http://localhost:8080.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      return { 
        success: false, 
        message: errorMsg 
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      setLoading(false);
      return { success: true, message: response.data?.message || 'User registered successfully!' };
    } catch (err) {
      setLoading(false);
      let errorMsg = 'Registration failed. Please check your inputs.';
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = 'Cannot connect to backend server. Please make sure the Spring Boot backend is running on http://localhost:8080.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      return { 
        success: false, 
        message: errorMsg 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('codepulse_token');
    sessionStorage.removeItem('codepulse_user');
    localStorage.removeItem('codepulse_token');
    localStorage.removeItem('codepulse_user');
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => {
      const newU = { ...prev, ...updatedUser };
      sessionStorage.setItem('codepulse_user', JSON.stringify(newU));
      return newU;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
