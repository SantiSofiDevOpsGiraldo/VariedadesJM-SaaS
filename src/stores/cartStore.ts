import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'qty'>) => void;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item.id === product.id);
    if (existing) {
      return { items: state.items.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      )};
    }
    return { items: [...state.items, { ...product, qty: 1 }] };
  }),
  updateQty: (id, delta) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ),
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
}));
