import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import {
  Search,
  Plus,
  Package,
  DollarSign,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Barcode,
} from 'lucide-react';
import type { Product } from '@/types';

export default function Inventory() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'PAPELERIA',
    price: 0,
    stock: 0,
    status: 'ACTIVE',
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = (products || []).reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = (products || []).filter((p) => p.stock <= 5).length;
  const totalProducts = (products || []).length;

  const openCreate = () => {
    setEditProduct(null);
    setForm({ code: '', name: '', category: 'PAPELERIA', price: 0, stock: 0, status: 'ACTIVE' });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      code: product.code,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Inventario</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gestión de productos y stock</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-[#202983]/10 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-[#202983]" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Productos</p>
            <p className="font-headline text-lg font-bold text-on-surface">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Valor Inventario</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              ${totalValue.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Bajo Stock</p>
            <p className="font-headline text-lg font-bold text-error">{lowStock}</p>
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
          placeholder="Buscar por nombre o código..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Código
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Producto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Categoría
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Precio
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-16 ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-10 ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-14 mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Package className="w-10 h-10 text-outline mx-auto mb-2" />
                    <p className="text-on-surface-variant text-sm">No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4 text-outline" />
                        <span className="text-sm font-mono text-on-surface-variant">{product.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-on-surface">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#202983]/10 text-[#202983]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-on-surface">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          product.stock <= 5 ? 'text-error' : 'text-on-surface'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.status === 'ACTIVE'
                            ? 'bg-secondary-container text-secondary'
                            : 'bg-error-container text-error'
                        }`}
                      >
                        {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este producto?')) deleteMutation.mutate(product.id);
                          }}
                          className="p-1.5 hover:bg-error-container/50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant">
              <h2 className="font-headline font-semibold text-on-surface">
                {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Código</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                >
                  <option value="PAPELERIA">Papelería</option>
                  <option value="REGALOS">Regalos</option>
                  <option value="FOTOCOPIAS">Fotocopias</option>
                  <option value="DULCES">Dulces</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Precio</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                    step="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-2.5 bg-[#202983] hover:bg-[#39429b] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {editProduct ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
