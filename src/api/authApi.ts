import api from './axios';

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; password: string; fullName: string; email: string; role: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};
