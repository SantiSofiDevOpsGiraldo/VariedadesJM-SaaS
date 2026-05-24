import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/authApi';
import { Lock, User, Loader2, Store } from 'lucide-react';
import { CompanyOnboarding } from './CompanyOnboarding';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, logout: storeLogout, isAdmin } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const needsOnboarding = Boolean(user && !user.onboardingCompleted);

  useEffect(() => {
    if (needsOnboarding && window.location.pathname !== '/onboarding') {
      window.location.replace('/onboarding');
    }
  }, [needsOnboarding]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login({ username, password });
      const data = response.data;
      setUser({
        token: data.token,
        username: data.username,
        fullName: data.fullName,
        role: data.role,
        companyId: data.companyId,
        companyName: data.companyName,
        onboardingCompleted: data.onboardingCompleted,
        authProvider: data.authProvider,
      });
      if (!data.onboardingCompleted) {
        window.location.replace('/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register({ username, password, fullName, email, role: 'EMPLOYEE' });
      const data = response.data;
      setUser({
        token: data.token,
        username: data.username,
        fullName: data.fullName,
        role: data.role,
        companyId: data.companyId,
        companyName: data.companyName,
        onboardingCompleted: data.onboardingCompleted,
        authProvider: data.authProvider,
      });
      if (!data.onboardingCompleted) {
        window.location.replace('/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;
    if (!clientId) {
      setError('Google OAuth no está configurado en el frontend. Configure VITE_GOOGLE_CLIENT_ID.');
      return;
    }

    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      include_granted_scopes: 'true',
      access_type: 'offline',
      prompt: 'select_account',
      state,
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = url;
  };

  const handleLogout = () => {
    storeLogout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#202983] via-[#39429b] to-[#202983] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#202983] rounded-2xl mb-4 shadow-lg">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-headline text-3xl font-bold text-[#202983]">Variedades JM</h1>
              <p className="text-on-surface-variant mt-2 text-sm">Sistema de Punto de Venta</p>
            </div>

            {/* Login / Register Form */}
            {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                    placeholder="Nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Usuario</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                      placeholder="Ingrese su usuario"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                      placeholder="Ingrese su contraseña"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#202983] hover:bg-[#39429b] text-on-primary font-headline font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
                <p className="text-center text-sm mt-3">
                  ¿Ya tienes cuenta? <button type="button" onClick={() => setIsRegister(false)} className="text-[#202983] font-semibold">Inicia sesión</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                    placeholder="Ingrese su usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent transition-all"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#202983] hover:bg-[#39429b] text-on-primary font-headline font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
              </form>
            )}

            <div className="mt-4">
              <button onClick={() => setIsRegister(true)} className="w-full mb-2 text-sm text-[#202983] underline">Crear cuenta</button>
              <button onClick={handleGoogleSignIn} className="w-full bg-white border border-outline-variant text-[#202983] py-2 rounded-xl">Iniciar con Google</button>
            </div>

            <p className="text-center text-xs text-outline mt-6">
              © 2026 Variedades JM · Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <CompanyOnboarding />;
  }

  return (
    <AuthContext.Provider value={{ user, logout: handleLogout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
