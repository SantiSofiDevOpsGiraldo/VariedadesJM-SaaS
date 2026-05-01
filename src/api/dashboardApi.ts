import api from './axios';

export const dashboardApi = {
  getKpis: () => api.get('/dashboard/kpis'),
  getWeeklyPerformance: () => api.get('/dashboard/weekly-performance'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getCriticalStock: () => api.get('/dashboard/critical-stock'),
};
