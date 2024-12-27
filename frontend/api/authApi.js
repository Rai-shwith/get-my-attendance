import api from './axiosInstance';

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

export const register = async (userData) => {
  return api.post('/register', userData);
};
