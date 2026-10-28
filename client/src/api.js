import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hostel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401 && !String(error.config?.url).includes('/auth/login')) {
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('hostel_user');
    if (window.location.pathname !== '/login') window.location.href = '/login';
  }
  return Promise.reject(error);
});
export const messageOf = e => e?.response?.data?.message || e?.message || 'Something went wrong.';
export default api;
