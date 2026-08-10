import React, { useEffect, useState } from 'react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

export default function GoogleOAuthCallback() {
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const saved = sessionStorage.getItem('oauth_state');

    if (!code) {
      setErrorMsg('No se recibió código de autorización de Google.');
      setStatus('error');
      return;
    }
    if (!state || state !== saved) {
      setErrorMsg('Parámetro state inválido. Posible ataque CSRF. Intenta iniciar sesión de nuevo.');
      setStatus('error');
      return;
    }

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

        setStatus('success');

        // Redirige a onboarding si es primera vez, o al dashboard si ya completó
        setTimeout(() => {
          window.location.replace(data.onboardingCompleted ? '/' : '/onboarding');
        }, 800);

      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          'Google rechazó el inicio de sesión. Revisa que el correo esté verificado y que el redirect URI coincida con Google Cloud Console.';
        setErrorMsg(msg);
        setStatus('error');
      }
    })();
  }, [setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#202983] via-[#39429b] to-[#202983] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-[#202983] animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#202983]">Iniciando sesión con Google...</h2>
            <p className="text-sm text-gray-500 mt-2">Verificando tu cuenta, espera un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800">¡Autenticación exitosa!</h2>
            <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Error de autenticación</h2>
            <p className="text-sm text-red-600 mb-6">{errorMsg}</p>
            <button
              onClick={() => window.location.replace('/')}
              className="w-full bg-[#202983] hover:bg-[#39429b] text-white font-semibold py-2.5 rounded-xl transition-all"
            >
              Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
