import axios from 'axios';
import { useMessage } from '../src/contexts/MessageContext';
import { removeUser, setUser } from '../src/helpers/localStorageHandlers';
import { removeTokens, setAccessToken } from './tokenUtils';

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
      
      // Update the login function to reflect successful login
      setUser({
        name: result.data.name,
        role: result.data.role,
        email: result.data.email,
        department: result.data.department
      });
      setAccessToken(result.data.accessToken);
      return {
        success: true,
        message: result.data.name + ' logged in successfully',
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
  removeTokens();
  removeUser();
};

export const signup = async (userData) => {
  console.log(userData)
  try {
    const result = await api.post('/register', userData);
    if (result.status === 200) {
      console.log('User registered successfully');
      console.log(result.data);
      setUser({
        name: result.data.name,
        role: result.data.role,
        email: result.data.email,
        department: userData.department
      })
      setAccessToken(result.data.accessToken);
      return {success: true, message: result.data.name + ' registered successfully', role: result.data.role};
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

export const refreshJWTToken = async () => {
  try{
  const { data } = await api.post(
    '/refresh-token',
    {},
    { withCredentials: true }
  );
  return data;
} catch(error) {
  console.error("While silent login at refreshJWTtoken", error)
  return null
}
};
