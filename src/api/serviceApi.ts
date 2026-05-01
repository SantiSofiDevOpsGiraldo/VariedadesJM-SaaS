import api from './axios';

export const serviceApi = {
  getAll: () => api.get('/services'),
  getById: (id: number) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  updateStatus: (id: number, status: string) => api.put(`/services/${id}/status`, { status }),
  addPayment: (id: number, data: any) => api.post(`/services/${id}/payments`, data),
};
