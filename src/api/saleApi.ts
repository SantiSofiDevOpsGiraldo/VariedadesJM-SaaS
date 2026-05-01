import api from './axios';

export const saleApi = {
  getAll: () => api.get('/sales'),
  getById: (id: number) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales', data),
  getByDate: (from: string, to: string) => api.get('/sales/by-date', { params: { from, to } }),
};
