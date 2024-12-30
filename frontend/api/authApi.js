import { useDebugValue } from 'react';
import axios from 'axios';
import { useMessage } from '../src/contexts/MessageContext';
import { Login } from '../src/helpers/localStorageHandlers';

// Create a axios instance for login and signup
const api = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true, // For sending cookies (refresh tokens)
});

// TODO: Implement correct API calls
export const login = async (userData) => {
  console.log(userData);
  try {
    // Change the API endpoint from '/register' to '/login'
    const result = await api.post('/login', userData);
    
    if (result.status === 200) {
      console.log('User  logged in successfully');
      console.log(result.data);
      
      // Update the Login function to reflect successful login
      Login({
        name: result.data.data.name,
        role: result.data.role,
        email: result.data.data.email,
        department: result.data.data.department
      });
      
      return {
        success: true,
        message: result.data.data.name + ' logged in successfully',
        role: result.data.role
      };
    } else {
      console.error(result);
      return { success: false, message: 'Error logging in user' };
    }
  } catch (error) {
    console.error(error);
    const mainError = error.response?.data?.error;
    
    if (!mainError) {
      return { success: false, message: 'Error logging in user' };
    }
    
    console.error(mainError);
    return { success: false, message: mainError.message };
  }
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
      Login({
        name: result.data.data.name,
        role: result.data.role,
        email: result.data.data.email,
        department: userData.department
      })
      return {success: true, message: result.data.data.name + ' registered successfully', role: result.data.role};
    } else {
      console.error(result);
      return { 'success': false, 'message': 'Error registering user' };
    }
  } catch (error) {
    console.error(error);
    const mainError = error.response?.data?.error;
    if (!mainError) return { 'success': false, 'message': 'Error registering user' };
    console.error(mainError);
    return { 'success': false, 'message': mainError.message };

  }

};
