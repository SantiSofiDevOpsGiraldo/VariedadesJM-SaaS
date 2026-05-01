import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboardApi';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { DashboardKPIs, WeeklyPerformance, TopProduct, CriticalStock } from '@/types';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery<DashboardKPIs>({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardApi.getKpis().then((r) => r.data),
  });

  const { data: weekly } = useQuery<WeeklyPerformance[]>({
    queryKey: ['weekly-performance'],
    queryFn: () => dashboardApi.getWeeklyPerformance().then((r) => r.data),
  });

  const { data: topProducts } = useQuery<TopProduct[]>({
    queryKey: ['top-products'],
    queryFn: () => dashboardApi.getTopProducts().then((r) => r.data),
  });

  const { data: criticalStock } = useQuery<CriticalStock[]>({
    queryKey: ['critical-stock'],
    queryFn: () => dashboardApi.getCriticalStock().then((r) => r.data),
  });

  const maxWeekly = weekly ? Math.max(...weekly.map((w) => w.total), 1) : 1;
  const isCashOpen = kpis?.cashSessionStatus === 'ABIERTA';

  const kpiCards = [
    {
      label: 'Ventas del Día',
      value: kpis?.todaySales
        ? `$${kpis.todaySales.toLocaleString('es-CO')}`
        : '$0',
      icon: DollarSign,
      color: 'bg-[#202983]',
      trend: 'COP',
      trendUp: true,
    },
    {
      label: 'Transacciones',
      value: kpis?.todayTransactions?.toString() || '0',
      icon: ShoppingBag,
      color: 'bg-secondary',
      trend: 'ventas hoy',
      trendUp: true,
    },
    {
      label: 'Ganancia Estimada',
      value: kpis?.estimatedNetProfit
        ? `$${kpis.estimatedNetProfit.toLocaleString('es-CO')}`
        : '$0',
      icon: TrendingUp,
      color: 'bg-tertiary',
      trend: '~30% margen',
      trendUp: true,
    },
    {
      label: 'Estado de Caja',
      value: isCashOpen ? 'Abierta' : 'Cerrada',
      icon: Wallet,
      color: isCashOpen ? 'bg-secondary' : 'bg-error',
      trend: isCashOpen ? 'En operación' : 'Sin sesión',
      trendUp: isCashOpen,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Resumen general del negocio
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-outline-variant animate-pulse"
              >
                <div className="h-4 bg-surface-container-high rounded w-24 mb-3" />
                <div className="h-8 bg-surface-container-high rounded w-32 mb-2" />
                <div className="h-3 bg-surface-container-high rounded w-16" />
              </div>
            ))
          : kpiCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-outline-variant hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="font-headline text-2xl font-bold text-on-surface mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-2.5 rounded-xl`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {card.trendUp ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-error" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      card.trendUp ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {card.trend}
                  </span>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-outline-variant">
          <h2 className="font-headline font-semibold text-on-surface mb-4">
            Rendimiento Semanal
          </h2>
          <div className="flex items-end gap-3 h-48">
            {(weekly || []).map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-on-surface-variant">
                  ${day.total >= 1000 ? `${(day.total / 1000).toFixed(0)}k` : day.total}
                </span>
                <div
                  className="w-full bg-[#202983] rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${(day.total / maxWeekly) * 100}%` }}
                />
                <span className="text-xs text-on-surface-variant font-medium">
                  {day.day?.substring(0, 3) || ''}
                </span>
              </div>
            ))}
            {(!weekly || weekly.length === 0) &&
              ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-on-surface-variant">$0</span>
                  <div className="w-full bg-surface-container-high rounded-t-lg h-1" />
                  <span className="text-xs text-on-surface-variant font-medium">{d}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant">
          <h2 className="font-headline font-semibold text-on-surface mb-4">
            Productos Top
          </h2>
          <div className="space-y-3">
            {(topProducts || []).length > 0 ? (
              (topProducts || []).slice(0, 5).map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container transition-colors"
                >
                  <div className="w-8 h-8 bg-[#202983]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#202983] font-headline font-bold text-xs">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {p.productName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {p.totalQuantity} uds vendidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-on-surface">
                      ${p.totalRevenue?.toLocaleString('es-CO') || 0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">
                Sin datos disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Critical Stock Alerts */}
      <div className="bg-white rounded-2xl p-5 border border-outline-variant">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-error" />
          <h2 className="font-headline font-semibold text-on-surface">
            Alertas de Stock Crítico
          </h2>
        </div>
        {(criticalStock || []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(criticalStock || []).map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-error-container/50 rounded-xl border border-error/10"
              >
                <div className="w-10 h-10 bg-error-container rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-error font-medium">
                    Stock: {p.stock} unidades — {p.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Package className="w-10 h-10 text-outline mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant">
              No hay productos con stock crítico
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
