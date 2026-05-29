import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashApi } from '@/api/cashApi';
import {
  Wallet,
  Lock,
  Unlock,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Clock,
  X,
  AlertCircle,
  CheckCircle2,
  Banknote,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import type { CashTransaction } from '@/types';

export default function Cash() {
  const queryClient = useQueryClient();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<'INGRESO' | 'EGRESO'>('INGRESO');
  const [openForm, setOpenForm] = useState({ initialBase: 0 });
  const [closeForm, setCloseForm] = useState({ actualTotal: 0, description: '' });
  const [txForm, setTxForm] = useState({ amount: 0, description: '', method: 'EFECTIVO' });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: session, isLoading } = useQuery({
    queryKey: ['cash-session-active'],
    queryFn: () => cashApi.getActiveSession().then((r) => r.data),
    retry: false,
  });

  const { data: transactions } = useQuery<CashTransaction[]>({
    queryKey: ['cash-transactions', session?.id],
    queryFn: () => cashApi.getTransactions(session.id).then((r) => r.data),
    enabled: !!session?.id,
  });

  const openMutation = useMutation({
    mutationFn: (data: any) => cashApi.openSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-session-active'] });
      setShowOpenModal(false);
      setMsg({ type: 'success', text: 'Caja abierta exitosamente' });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: () => {
      setMsg({ type: 'error', text: 'Error al abrir caja' });
      setTimeout(() => setMsg(null), 3000);
    },
  });

  const closeMutation = useMutation({
    mutationFn: (data: any) => cashApi.closeSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-session-active'] });
      setShowCloseModal(false);
      setMsg({ type: 'success', text: 'Caja cerrada exitosamente' });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: () => {
      setMsg({ type: 'error', text: 'Error al cerrar caja' });
      setTimeout(() => setMsg(null), 3000);
    },
  });

  const txMutation = useMutation({
    mutationFn: (data: any) => cashApi.addTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-transactions', session?.id] });
      setShowTxModal(false);
      setTxForm({ amount: 0, description: '', method: 'EFECTIVO' });
      setMsg({ type: 'success', text: 'Transacción registrada' });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: () => {
      setMsg({ type: 'error', text: 'Error al registrar transacción' });
      setTimeout(() => setMsg(null), 3000);
    },
  });

  const incomes = useMemo(
    () => (transactions || []).filter((t) => t.type === 'INGRESO').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const expenses = useMemo(
    () => (transactions || []).filter((t) => t.type === 'EGRESO').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const expectedTotal = session ? session.initialBase + incomes - expenses : 0;

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });
  };

  // No active session — show closed state
  if (!isLoading && !session) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Caja</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gestión de caja diaria</p>
        </div>

        {msg && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
              msg.type === 'success' ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-surface-container rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-outline" />
          </div>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-2">Caja Cerrada</h2>
          <p className="text-on-surface-variant text-sm mb-6 text-center max-w-xs">
            No hay una sesión de caja activa. Abra la caja para comenzar a operar.
          </p>
          <button
            onClick={() => setShowOpenModal(true)}
            className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Unlock className="w-5 h-5" />
            Abrir Caja
          </button>
        </div>

        {/* Open Modal */}
        {showOpenModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-outline-variant">
                <h2 className="font-headline font-semibold text-on-surface">Abrir Caja</h2>
                <button onClick={() => setShowOpenModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                  <X className="w-5 h-5 text-outline" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openMutation.mutate({ initialBase: openForm.initialBase });
                }}
                className="p-5 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Base Inicial</label>
                  <input
                    type="number"
                    value={openForm.initialBase}
                    onChange={(e) => setOpenForm({ initialBase: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOpenModal(false)}
                    className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={openMutation.isPending}
                    className="flex-1 py-2.5 bg-[#202983] hover:bg-[#39429b] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Abrir
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Caja</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gestión de caja diaria</p>
        </div>
        <button
          onClick={() => {
            setCloseForm({ actualTotal: expectedTotal, description: '' });
            setShowCloseModal(true);
          }}
          className="inline-flex items-center gap-2 bg-error hover:bg-error/90 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <Lock className="w-4 h-4" />
          Cerrar Caja
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            msg.type === 'success' ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-outline-variant animate-pulse">
              <div className="h-4 bg-surface-container-high rounded w-24 mb-3" />
              <div className="h-8 bg-surface-container-high rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-[#202983]" />
                <p className="text-xs text-on-surface-variant">Base Inicial</p>
              </div>
              <p className="font-headline text-xl font-bold text-on-surface">
                ${session?.initialBase?.toLocaleString('es-CO') || 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpCircle className="w-4 h-4 text-secondary" />
                <p className="text-xs text-on-surface-variant">Ingresos</p>
              </div>
              <p className="font-headline text-xl font-bold text-secondary">
                ${incomes.toLocaleString('es-CO')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownCircle className="w-4 h-4 text-error" />
                <p className="text-xs text-on-surface-variant">Egresos</p>
              </div>
              <p className="font-headline text-xl font-bold text-error">
                ${expenses.toLocaleString('es-CO')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#202983]" />
                <p className="text-xs text-on-surface-variant">Total Esperado</p>
              </div>
              <p className="font-headline text-xl font-bold text-[#202983]">
                ${expectedTotal.toLocaleString('es-CO')}
              </p>
            </div>
          </div>

          {/* Session info */}
          <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-secondary">Sesión Activa</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Clock className="w-3.5 h-3.5" />
              Abierta: {formatTime(session?.openedAt)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Wallet className="w-3.5 h-3.5" />
              Por: {session?.openedBy}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setTxType('INGRESO');
                setTxForm({ amount: 0, description: '', method: 'EFECTIVO' });
                setShowTxModal(true);
              }}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Registrar Ingreso
            </button>
            <button
              onClick={() => {
                setTxType('EGRESO');
                setTxForm({ amount: 0, description: '', method: 'EFECTIVO' });
                setShowTxModal(true);
              }}
              className="inline-flex items-center gap-2 bg-error hover:bg-error/90 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              <ArrowDownCircle className="w-4 h-4" />
              Registrar Egreso
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">Transacciones</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Método
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {(!transactions || transactions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center">
                        <Wallet className="w-8 h-8 text-outline mx-auto mb-2" />
                        <p className="text-sm text-on-surface-variant">Sin transacciones registradas</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 text-sm text-on-surface-variant">
                          {formatTime(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                              tx.type === 'INGRESO'
                                ? 'bg-secondary-container text-secondary'
                                : 'bg-error-container text-error'
                            }`}
                          >
                            {tx.type === 'INGRESO' ? (
                              <ArrowUpCircle className="w-3 h-3" />
                            ) : (
                              <ArrowDownCircle className="w-3 h-3" />
                            )}
                            {tx.type === 'INGRESO' ? 'Ingreso' : 'Egreso'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-on-surface">{tx.description}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-container text-on-surface-variant inline-flex items-center gap-1">
                            {tx.method === 'EFECTIVO' && <Banknote className="w-3 h-3" />}
                            {tx.method === 'TRANSFERENCIA' && <Smartphone className="w-3 h-3" />}
                            {tx.method === 'TARJETA' && <CreditCard className="w-3 h-3" />}
                            {tx.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              tx.type === 'INGRESO' ? 'text-secondary' : 'text-error'
                            }`}
                          >
                            {tx.type === 'INGRESO' ? '+' : '-'}${tx.amount.toLocaleString('es-CO')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Close Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">Cerrar Caja</h2>
              <button onClick={() => setShowCloseModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                closeMutation.mutate(closeForm);
              }}
              className="p-5 space-y-4"
            >
              <div className="p-3 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface-variant">
                  Total esperado: <span className="font-bold text-on-surface">${expectedTotal.toLocaleString('es-CO')}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Total Actual (Conteo físico)</label>
                <input
                  type="number"
                  value={closeForm.actualTotal}
                  onChange={(e) => setCloseForm({ ...closeForm, actualTotal: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Observaciones</label>
                <input
                  type="text"
                  value={closeForm.description}
                  onChange={(e) => setCloseForm({ ...closeForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  placeholder="Opcional..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={closeMutation.isPending}
                  className="flex-1 py-2.5 bg-error hover:bg-error/90 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cerrar Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">
                Registrar {txType === 'INGRESO' ? 'Ingreso' : 'Egreso'}
              </h2>
              <button onClick={() => setShowTxModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                txMutation.mutate({
                  type: txType,
                  amount: txForm.amount,
                  description: txForm.description,
                  method: txForm.method,
                });
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Monto</label>
                <input
                  type="number"
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  min="1"
                  step="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Descripción</label>
                <input
                  type="text"
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  placeholder="Ej: Pago proveedor, Venta adicional..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Método</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, method: 'EFECTIVO' })}
                    className={`py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                      txForm.method === 'EFECTIVO' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Banknote className="w-3 h-3" /> Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, method: 'TRANSFERENCIA' })}
                    className={`py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                      txForm.method === 'TRANSFERENCIA' ? 'bg-[#202983] text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" /> Transfer.
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, method: 'TARJETA' })}
                    className={`py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                      txForm.method === 'TARJETA' ? 'bg-tertiary text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <CreditCard className="w-3 h-3" /> Tarjeta
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={txMutation.isPending}
                  className={`flex-1 py-2.5 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                    txType === 'INGRESO' ? 'bg-secondary hover:bg-secondary/90' : 'bg-error hover:bg-error/90'
                  }`}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
