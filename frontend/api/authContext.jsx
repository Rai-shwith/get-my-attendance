import React, { createContext, useState, useEffect } from 'react';
import { login, logout } from './authApi';
import api from './axiosInstance';
import { useLoading } from '../src/contexts/LoadingContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const {loading, setLoading} = useLoading();

  
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const profile = await api.get('/profile'); // API to get current user
  //       setUser(profile);
  //     } catch (error) {
  //       console.error('User fetch failed:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const handleLogin = async (username, password) => {
    const data = await login(username, password);
    setUser(data.user);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
