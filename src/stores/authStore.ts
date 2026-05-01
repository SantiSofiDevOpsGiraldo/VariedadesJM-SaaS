import { create } from 'zustand';

interface AuthUser {
  token: string;
  username: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const stored = localStorage.getItem('caja_clara_user');
    return stored ? JSON.parse(stored) : null;
  })(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('caja_clara_token', user.token);
      localStorage.setItem('caja_clara_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('caja_clara_token');
      localStorage.removeItem('caja_clara_user');
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('caja_clara_token');
    localStorage.removeItem('caja_clara_user');
    set({ user: null });
  },
  isAdmin: () => get().user?.role === 'ADMIN',
}));
