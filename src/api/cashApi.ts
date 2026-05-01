import api from './axios';

export const cashApi = {
  getActiveSession: () => api.get('/cash-sessions/active'),
  openSession: (data: any) => api.post('/cash-sessions/open', data),
  closeSession: (data: any) => api.post('/cash-sessions/close', data),
  getTransactions: (sessionId: number) => api.get(`/cash-sessions/${sessionId}/transactions`),
  addTransaction: (data: any) => api.post('/cash-sessions/transactions', data),
};
