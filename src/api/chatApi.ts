import api from './axios';

export const chatApi = {
  sendMessage: (message: string) => api.post('/chat', { message }),
};
