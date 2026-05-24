import { create } from 'zustand';

interface AuthUser {
  token: string;
  username: string;
  fullName: string;
  role: string;
  companyId?: number | null;
  companyName?: string | null;
  onboardingCompleted?: boolean;
  authProvider?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const stored = localStorage.getItem('variedades_jm_user');
    return stored ? JSON.parse(stored) : null;
  })(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('variedades_jm_token', user.token);
      localStorage.setItem('variedades_jm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('variedades_jm_token');
      localStorage.removeItem('variedades_jm_user');
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('variedades_jm_token');
    localStorage.removeItem('variedades_jm_user');
    set({ user: null });
  },
  isAdmin: () => ['OWNER', 'ADMIN'].includes(get().user?.role || ''),
}));
