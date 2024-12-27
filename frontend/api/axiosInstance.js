import axios from 'axios';
import { getAccessToken, removeTokens, setAccessToken } from './tokenUtils';

const api = axios.create({
  baseURL: 'http://localhost', 
  withCredentials: true, // For sending cookies (refresh tokens)
});
// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          '/refresh-token',
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        removeTokens();
        window.location.href = '/login'; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
