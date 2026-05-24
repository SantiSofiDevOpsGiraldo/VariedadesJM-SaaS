import React, { useEffect, useState } from 'react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';

export default function GoogleOAuthCallback() {
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const saved = sessionStorage.getItem('oauth_state');
    if (!code) {
      setError('No se recibió código de autorización.');
      return;
    }
    if (!state || state !== saved) {
      setError('Parámetro state inválido. Posible ataque CSRF.');
      return;
    }

    // remove state now that it's validated
    sessionStorage.removeItem('oauth_state');

    (async () => {
      try {
        const resp = await authApi.oauthGoogleCallback({ code });
        const data = resp.data;
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
        window.location.replace(data.onboardingCompleted ? '/' : '/onboarding');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error durante intercambio de código de Google.');
      }
    })();
  }, [setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">
        {error ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Error de autenticación</h2>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-2">Iniciando sesión con Google...</h2>
            <p className="text-sm text-muted-foreground">Espere un momento, será redirigido.</p>
          </div>
        )}
      </div>
    </div>
  );
}
