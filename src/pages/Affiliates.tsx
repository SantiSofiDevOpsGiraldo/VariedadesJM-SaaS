import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '@/api/affiliateApi';
import {
  Search,
  Plus,
  Users,
  Award,
  Gift,
  X,
  Star,
  Crown,
  Medal,
} from 'lucide-react';
import type { Affiliate } from '@/types';

const levelConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  ORO: { label: 'Oro', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Crown },
  PLATA: { label: 'Plata', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: Medal },
  BRONCE: { label: 'Bronce', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Star },
};

export default function Affiliates() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    idDocument: '',
    phone: '',
    email: '',
    level: 'BRONCE',
    points: 0,
  });

  const { data: affiliates, isLoading } = useQuery<Affiliate[]>({
    queryKey: ['affiliates'],
    queryFn: () => affiliateApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => affiliateApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      setShowModal(false);
      setForm({ name: '', idDocument: '', phone: '', email: '', level: 'BRONCE', points: 0 });
    },
  });

  const filteredAffiliates = (affiliates || []).filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.idDocument.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAffiliates = (affiliates || []).length;
  const totalPoints = (affiliates || []).reduce((sum, a) => sum + a.points, 0);
  const estimatedRewards = Math.floor(totalPoints / 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Afiliados</h1>
          <p className="text-on-surface-variant text-sm mt-1">Programa de fidelización</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar Afiliado
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-[#202983]/10 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-[#202983]" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Afiliados</p>
            <p className="font-headline text-lg font-bold text-on-surface">{totalAffiliates}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Puntos Emitidos</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              {totalPoints.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Recompensas Estimadas</p>
            <p className="font-headline text-lg font-bold text-on-surface">{estimatedRewards}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, documento o email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Documento
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Email
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Nivel
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Puntos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-16 mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-outline mx-auto mb-2" />
                    <p className="text-on-surface-variant text-sm">No se encontraron afiliados</p>
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((affiliate) => {
                  const lvl = levelConfig[affiliate.level] || levelConfig.BRONCE;
                  const LevelIcon = lvl.icon;
                  return (
                    <tr key={affiliate.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#202983]/10 rounded-full flex items-center justify-center">
                            <span className="text-[#202983] font-headline font-bold text-xs">
                              {affiliate.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-on-surface">{affiliate.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{affiliate.idDocument}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{affiliate.phone}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{affiliate.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${lvl.bgColor} ${lvl.color}`}
                        >
                          <LevelIcon className="w-3 h-3" />
                          {lvl.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-on-surface">
                          {affiliate.points.toLocaleString('es-CO')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">Nuevo Afiliado</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(form);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Documento</label>
                  <input
                    type="text"
                    value={form.idDocument}
                    onChange={(e) => setForm({ ...form, idDocument: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Nivel</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  >
                    <option value="BRONCE">Bronce</option>
                    <option value="PLATA">Plata</option>
                    <option value="ORO">Oro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Puntos Iniciales</label>
                  <input
                    type="number"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-2.5 bg-[#202983] hover:bg-[#39429b] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Crear Afiliado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
