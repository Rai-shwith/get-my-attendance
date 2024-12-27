import api from './axiosInstance';

export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};
