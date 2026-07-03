import api from './axios';

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/api/auth/login', data),
  register: (data: { username: string; password: string; fullName: string; email: string; role: string }) => api.post('/api/auth/register', data),
  oauthGoogle: (data: { idToken: string }) => api.post('/api/auth/oauth/google', data),
  oauthGoogleCallback: (data: { code: string }) => api.post('/api/auth/oauth/google/callback', data),
  completeOnboarding: (data: {
    companyName: string;
    legalName: string;
    taxId: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }) => api.post('/api/auth/onboarding/company', data),
  me: () => api.get('/api/auth/me'),
};
