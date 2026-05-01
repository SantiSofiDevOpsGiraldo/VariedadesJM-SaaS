import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/api/serviceApi';
import { cashApi } from '@/api/cashApi';
import {
  Search,
  Plus,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  X,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react';
import type { ServiceOrder } from '@/types';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  IN_PROGRESS: { label: 'En Progreso', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  COMPLETED: { label: 'Completado', color: 'bg-secondary-container text-secondary', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelado', color: 'bg-error-container text-error', icon: XCircle },
};

export default function Services() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOrder | null>(null);
  const [newForm, setNewForm] = useState({
    title: '',
    clientName: '',
    phone: '',
    type: 'Impresión',
    budget: 0,
    advance: 0,
    method: 'EFECTIVO',
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: 'EFECTIVO',
    description: '',
  });

  const { data: services, isLoading } = useQuery<ServiceOrder[]>({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
  });

  const { data: cashSession } = useQuery({
    queryKey: ['cash-session-active'],
    queryFn: () => cashApi.getActiveSession().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => serviceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setShowNewModal(false);
      setNewForm({ title: '', clientName: '', phone: '', type: 'Impresión', budget: 0, advance: 0, method: 'EFECTIVO' });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => serviceApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => serviceApi.addPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setShowPaymentModal(false);
      setPaymentForm({ amount: 0, method: 'EFECTIVO', description: '' });
    },
  });

  const filteredServices = (services || []).filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const pendingServices = (services || []).filter(
    (s) => s.status === 'PENDING' || s.status === 'IN_PROGRESS'
  );

  const totalBudget = pendingServices.reduce((sum, s) => sum + s.budget, 0);
  const totalAdvance = pendingServices.reduce((sum, s) => sum + s.advance, 0);

  const openPayment = (service: ServiceOrder) => {
    setSelectedService(service);
    setPaymentForm({ amount: 0, method: 'EFECTIVO', description: '' });
    setShowPaymentModal(true);
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newForm);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      paymentMutation.mutate({ id: selectedService.id, data: paymentForm });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Servicios</h1>
          <p className="text-on-surface-variant text-sm mt-1">Pedidos y servicios personalizados</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Pedido
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Pendientes</p>
            <p className="font-headline text-lg font-bold text-on-surface">{pendingServices.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-[#202983]/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#202983]" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Presupuesto Total</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              ${totalBudget.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Adelantos</p>
            <p className="font-headline text-lg font-bold text-secondary">
              ${totalAdvance.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main list */}
        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent"
            />
          </div>

          {/* Service cards */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-outline-variant animate-pulse">
                  <div className="h-5 bg-surface-container-high rounded w-48 mb-3" />
                  <div className="h-4 bg-surface-container-high rounded w-32 mb-2" />
                  <div className="h-3 bg-surface-container-high rounded w-64" />
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant">
              <Wrench className="w-12 h-12 text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">No se encontraron servicios</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServices.map((service) => {
                const cfg = statusConfig[service.status] || statusConfig.PENDING;
                const progress = service.budget > 0 ? (service.advance / service.budget) * 100 : 0;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-4 border border-outline-variant hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-headline font-semibold text-on-surface truncate">
                            {service.title}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color} inline-flex items-center gap-1 shrink-0`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                          {service.clientName} · {service.phone}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Tipo: {service.type} · Presupuesto: ${service.budget.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#202983]">
                          ${service.advance.toLocaleString('es-CO')}
                        </p>
                        <p className="text-xs text-on-surface-variant">adelanto</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                        <span>Progreso de pago</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {(service.status === 'PENDING' || service.status === 'IN_PROGRESS') && (
                        <>
                          <button
                            onClick={() => openPayment(service)}
                            className="text-xs font-medium px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Abonar
                          </button>
                          {service.status === 'PENDING' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: service.id, status: 'IN_PROGRESS' })}
                              className="text-xs font-medium px-3 py-1.5 bg-[#202983] hover:bg-[#39429b] text-white rounded-lg transition-colors"
                            >
                              Iniciar
                            </button>
                          )}
                          {service.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: service.id, status: 'COMPLETED' })}
                              className="text-xs font-medium px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Completar
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Payments */}
                    {service.payments && service.payments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-outline-variant">
                        <p className="text-xs font-medium text-on-surface-variant mb-2">Pagos registrados:</p>
                        <div className="space-y-1">
                          {service.payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between text-xs">
                              <span className="text-on-surface-variant">{p.description}</span>
                              <span className="font-medium text-on-surface">
                                ${p.amount.toLocaleString('es-CO')} · {p.method}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Pending */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-outline-variant p-4 sticky top-0">
            <h3 className="font-headline font-semibold text-on-surface mb-3 inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pendientes
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
              {pendingServices.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-4">
                  Sin pedidos pendientes
                </p>
              ) : (
                pendingServices.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-surface-container-low rounded-xl"
                  >
                    <p className="text-sm font-medium text-on-surface truncate">{s.title}</p>
                    <p className="text-xs text-on-surface-variant">{s.clientName}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-on-surface-variant">
                        ${s.advance.toLocaleString('es-CO')} / ${s.budget.toLocaleString('es-CO')}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusConfig[s.status]?.color}`}>
                        {statusConfig[s.status]?.label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Service Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">Nuevo Pedido</h2>
              <button onClick={() => setShowNewModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form onSubmit={handleNewSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Título</label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Cliente</label>
                  <input
                    type="text"
                    value={newForm.clientName}
                    onChange={(e) => setNewForm({ ...newForm, clientName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Tipo</label>
                <select
                  value={newForm.type}
                  onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                >
                  <option>Impresión</option>
                  <option>Fotocopia</option>
                  <option>Empastado</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Presupuesto</label>
                  <input
                    type="number"
                    value={newForm.budget}
                    onChange={(e) => setNewForm({ ...newForm, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                    step="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Adelanto</label>
                  <input
                    type="number"
                    value={newForm.advance}
                    onChange={(e) => setNewForm({ ...newForm, advance: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              {newForm.advance > 0 && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Método de pago del adelanto</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewForm({ ...newForm, method: 'EFECTIVO' })}
                      className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                        newForm.method === 'EFECTIVO' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <Banknote className="w-3 h-3" /> Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewForm({ ...newForm, method: 'TRANSFERENCIA' })}
                      className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                        newForm.method === 'TRANSFERENCIA' ? 'bg-[#202983] text-white' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" /> Transfer.
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewForm({ ...newForm, method: 'TARJETA' })}
                      className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                        newForm.method === 'TARJETA' ? 'bg-tertiary text-white' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" /> Tarjeta
                    </button>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-2.5 bg-[#202983] hover:bg-[#39429b] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">Registrar Abono</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <p className="text-sm font-medium text-on-surface">{selectedService.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Saldo pendiente: ${((selectedService.budget - selectedService.advance)).toLocaleString('es-CO')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Monto</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  min="1"
                  step="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Método</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Descripción</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  placeholder="Abono parcial..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={paymentMutation.isPending}
                  className="flex-1 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Registrar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
