import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Chatbot } from './Chatbot';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wrench,
  Wallet,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sales', icon: ShoppingCart, label: 'Ventas' },
  { to: '/inventory', icon: Package, label: 'Inventario' },
  { to: '/services', icon: Wrench, label: 'Servicios' },
  { to: '/cash', icon: Wallet, label: 'Caja' },
  { to: '/affiliates', icon: Users, label: 'Afiliados' },
  { to: '/reports', icon: BarChart3, label: 'Reportes' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-outline-variant flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-outline-variant">
          <div className="w-10 h-10 bg-[#202983] rounded-xl flex items-center justify-center shadow">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-[#202983] text-lg leading-tight">Caja Clara</h1>
            <p className="text-[10px] text-outline font-medium">Sistema POS</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1 hover:bg-surface-container rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-outline" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#202983] text-white shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-outline-variant">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 bg-[#202983]/10 rounded-full flex items-center justify-center">
              <span className="text-[#202983] font-headline font-bold text-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{user?.fullName}</p>
              <p className="text-xs text-outline truncate">{user?.role === 'ADMIN' ? 'Administrador' : 'Cajero'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-error-container text-outline hover:text-error transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-outline-variant flex items-center px-4 lg:px-6 shrink-0">
          <button
            className="lg:hidden p-2 hover:bg-surface-container rounded-lg mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-on-surface" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-on-surface-variant">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>En línea</span>
            </div>
            <div className="w-8 h-8 bg-[#202983]/10 rounded-full flex items-center justify-center">
              <span className="text-[#202983] font-headline font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
