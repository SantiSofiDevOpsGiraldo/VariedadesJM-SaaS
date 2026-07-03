import api from './axios';

export const affiliateApi = {
  getAll: () => api.get('/affiliates'),
  getById: (id: number) => api.get(`/affiliates/${id}`),
  create: (data: any) => api.post('/affiliates', data),
  update: (id: number, data: any) => api.put(`/affiliates/${id}`, data),
};
 

