import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { saleApi } from '@/api/saleApi';
import { cashApi } from '@/api/cashApi';
import { useCartStore } from '@/stores/cartStore';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  X,
  Package,
} from 'lucide-react';
import type { Product } from '@/types';

const categories = ['Todos', 'Papelería', 'Regalos', 'Fotocopias', 'Dulces'];

export default function Sales() {
  const queryClient = useQueryClient();
  const { items, addItem, updateQty, removeItem, clear, total } = useCartStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [checkoutMsg, setCheckoutMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getAll().then((r) => r.data),
  });

  const { data: cashSession } = useQuery({
    queryKey: ['cash-session-active'],
    queryFn: () => cashApi.getActiveSession().then((r) => r.data),
  });

  const createSaleMutation = useMutation({
    mutationFn: (data: { method: string; items: { productId: number; quantity: number }[] }) =>
      saleApi.create(data),
    onSuccess: () => {
      clear();
      setCheckoutMsg({ type: 'success', text: 'Venta registrada exitosamente' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['cash-session-active'] });
      setTimeout(() => setCheckoutMsg(null), 3000);
    },
    onError: () => {
      setCheckoutMsg({ type: 'error', text: 'Error al registrar la venta' });
      setTimeout(() => setCheckoutMsg(null), 3000);
    },
  });

  const filteredProducts = (products || []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || p.category === category;
    return matchesSearch && matchesCategory && p.status !== 'INACTIVE' && p.stock > 0;
  });

  const handleCheckout = (method: string) => {
    if (!cashSession) {
      setCheckoutMsg({ type: 'error', text: 'Debe abrir la caja antes de realizar ventas' });
      setTimeout(() => setCheckoutMsg(null), 3000);
      return;
    }
    if (items.length === 0) return;

    createSaleMutation.mutate({
      method,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
    });
  };

  const totalAmount = total();

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4">
          <h1 className="font-headline text-2xl font-bold text-on-surface">Ventas</h1>
          <p className="text-on-surface-variant text-sm mt-1">Terminal de punto de venta</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#202983] focus:border-transparent"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-[#202983] text-white'
                    : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                  })
                }
                className="bg-white rounded-xl p-3 border border-outline-variant hover:shadow-md hover:border-[#202983]/30 transition-all text-left group"
              >
                <div className="w-full aspect-square bg-surface-container rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  {product.img ? (
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-outline" />
                  )}
                </div>
                <p className="text-xs font-medium text-on-surface truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-bold text-[#202983]">
                    ${product.price.toLocaleString('es-CO')}
                  </p>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      product.stock <= 5
                        ? 'bg-error-container text-error'
                        : 'bg-secondary-container text-secondary'
                    }`}
                  >
                    {product.stock} uds
                  </span>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-outline-variant flex flex-col shrink-0">
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#202983]" />
            <h2 className="font-headline font-semibold text-on-surface">Carrito</h2>
            <span className="ml-auto text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
              {items.length} items
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-outline mx-auto mb-2" />
              <p className="text-sm text-on-surface-variant">El carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    ${item.price.toLocaleString('es-CO')} c/u
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="text-sm font-bold text-on-surface">
                    ${(item.price * item.qty).toLocaleString('es-CO')}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-outline hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout */}
        <div className="p-4 border-t border-outline-variant space-y-3">
          {/* Checkout message */}
          {checkoutMsg && (
            <div
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                checkoutMsg.type === 'success'
                  ? 'bg-secondary-container text-secondary'
                  : 'bg-error-container text-error'
              }`}
            >
              {checkoutMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {checkoutMsg.text}
              <button onClick={() => setCheckoutMsg(null)} className="ml-auto">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {!cashSession && (
            <div className="flex items-center gap-2 p-2.5 bg-error-container/50 rounded-xl text-xs text-error font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Caja cerrada — Abra caja para vender
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Total</span>
            <span className="font-headline text-xl font-bold text-[#202983]">
              ${totalAmount.toLocaleString('es-CO')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleCheckout('EFECTIVO')}
              disabled={items.length === 0 || createSaleMutation.isPending}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Banknote className="w-5 h-5" />
              Efectivo
            </button>
            <button
              onClick={() => handleCheckout('TRANSFERENCIA')}
              disabled={items.length === 0 || createSaleMutation.isPending}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-[#202983] hover:bg-[#39429b] text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Smartphone className="w-5 h-5" />
              Transferencia
            </button>
            <button
              onClick={() => handleCheckout('TARJETA')}
              disabled={items.length === 0 || createSaleMutation.isPending}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-tertiary hover:bg-tertiary/90 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5" />
              Tarjeta
            </button>
          </div>

          {items.length > 0 && (
            <button
              onClick={clear}
              className="w-full py-2 text-xs text-error hover:bg-error-container/50 rounded-xl transition-colors font-medium"
            >
              Vaciar carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
