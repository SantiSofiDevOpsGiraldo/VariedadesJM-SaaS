import React, { useState } from 'react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { Building2, Loader2 } from 'lucide-react';

export function CompanyOnboarding() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    companyName: '',
    legalName: '',
    taxId: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.completeOnboarding(form);
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
      window.location.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'No fue posible completar el registro empresarial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#202983] via-[#39429b] to-[#10152f] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-outline-variant flex items-center gap-4">
          <div className="w-14 h-14 bg-[#202983] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-outline">Onboarding empresarial</p>
            <h1 className="text-2xl font-bold text-[#202983]">Bienvenido, {user?.fullName || 'usuario'}</h1>
          </div>
        </div>

        <form onSubmit={submit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre comercial" value={form.companyName} onChange={(v) => update('companyName', v)} required />
          <Field label="Razón social" value={form.legalName} onChange={(v) => update('legalName', v)} required />
          <Field label="NIT / ID fiscal" value={form.taxId} onChange={(v) => update('taxId', v)} required />
          <Field label="Correo de la empresa" value={form.email} onChange={(v) => update('email', v)} type="email" required />
          <Field label="Teléfono" value={form.phone} onChange={(v) => update('phone', v)} required />
          <Field label="Ciudad" value={form.city} onChange={(v) => update('city', v)} required />
          <Field label="Dirección" value={form.address} onChange={(v) => update('address', v)} className="md:col-span-2" required />
          <Field label="País" value={form.country} onChange={(v) => update('country', v)} className="md:col-span-2" required />

          {error && <div className="md:col-span-2 rounded-2xl bg-error-container text-on-error-container px-4 py-3 text-sm">{error}</div>}

          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
            <p className="text-sm text-on-surface-variant">El registro empresarial es obligatorio para continuar.</p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#202983] px-5 py-3 text-white font-semibold shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Crear empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-on-surface">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#202983]"
      />
    </label>
  );
}
