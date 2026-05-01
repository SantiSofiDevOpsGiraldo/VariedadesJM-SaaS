import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saleApi } from '@/api/saleApi';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Sale } from '@/types';

const PIE_COLORS = ['#202983', '#1b6d24', '#003e14', '#ba1a1a', '#737783', '#39429b'];

const ranges: Record<string, { label: string; days: number }> = {
  month: { label: 'Mes', days: 30 },
  quarter: { label: 'Trimestre', days: 90 },
  year: { label: 'Año', days: 365 },
};

export default function Reports() {
  const [range, setRange] = useState<'month' | 'quarter' | 'year'>('month');

  const toDate = new Date().toISOString().split('T')[0];
  const fromDate = new Date(Date.now() - ranges[range].days * 86400000)
    .toISOString()
    .split('T')[0];

  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ['sales-by-date', fromDate, toDate],
    queryFn: () => saleApi.getByDate(fromDate, toDate).then((r) => r.data),
  });

  // Category distribution for pie chart
  const categoryData = (() => {
    const map: Record<string, number> = {};
    (sales || []).forEach((sale) => {
      sale.items?.forEach((item) => {
        const cat = (item as any).category || 'Otros';
        map[cat] = (map[cat] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  // Daily revenue for bar chart
  const revenueData = (() => {
    const map: Record<string, number> = {};
    (sales || []).forEach((sale) => {
      const day = new Date(sale.createdAt).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
      });
      map[day] = (map[day] || 0) + sale.total;
    });
    return Object.entries(map).map(([date, total]) => ({ date, total }));
  })();

  const totalRevenue = (sales || []).reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = (sales || []).length;
  const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Reportes</h1>
          <p className="text-on-surface-variant text-sm mt-1">Análisis y estadísticas de ventas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container rounded-xl p-1">
            {Object.entries(ranges).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setRange(key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  range === key
                    ? 'bg-[#202983] text-white'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2 px-3 rounded-xl transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-[#202983]/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#202983]" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Ingresos Totales</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              ${totalRevenue.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Transacciones</p>
            <p className="font-headline text-lg font-bold text-on-surface">{totalTransactions}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-tertiary-container/30 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Ticket Promedio</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              ${avgTicket.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart - Sales by Category */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#202983]" />
            <h2 className="font-headline font-semibold text-on-surface">Ventas por Categoría</h2>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString('es-CO')}`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #c3c6d4',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value: string) => <span className="text-xs text-on-surface-variant">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <p className="text-on-surface-variant text-sm">Sin datos disponibles</p>
            </div>
          )}
        </div>

        {/* Bar Chart - Revenue Evolution */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#202983]" />
            <h2 className="font-headline font-semibold text-on-surface">Evolución de Ingresos</h2>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#737783" />
                <YAxis tick={{ fontSize: 11 }} stroke="#737783" />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString('es-CO')}`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #c3c6d4',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" fill="#202983" radius={[6, 6, 0, 0]} name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <p className="text-on-surface-variant text-sm">Sin datos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-headline font-semibold text-on-surface">Ventas Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Método
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-10" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : (sales || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <p className="text-on-surface-variant text-sm">No hay ventas en este período</p>
                  </td>
                </tr>
              ) : (
                (sales || []).slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-on-surface-variant">#{sale.id}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {new Date(sale.createdAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-container text-on-surface-variant">
                        {sale.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-on-surface">
                        ${sale.total.toLocaleString('es-CO')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
