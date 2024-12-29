import { useDebugValue } from 'react';
import axios from 'axios';

// Create a axios instance for login and signup
const api = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true, // For sending cookies (refresh tokens)
});

// TODO: Implement correct API calls
export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data;
};

export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('accessToken');
};

export const signup = async (userData) => {
  console.log(userData)
  try {
    const result = await api.post('/register', userData);
    if (result.status === 200) {
      console.log('User registered successfully');
      console.log(result.data);
      return result.data;
    } else {
      console.error('Error registering user :', result.name);
      console.error(result);
    }
  } catch (error) {
    let errorDetails = error.response?.data?.error;
    console.error(errorDetails?.name,errorDetails?.message);
  }

};
