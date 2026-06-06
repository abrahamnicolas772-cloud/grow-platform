import axios from 'axios';

const API_URL = 'https://grow-platform.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getCourses = () => api.get('/courses');
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);

export default api;
