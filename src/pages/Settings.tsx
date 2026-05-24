import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Store,
  Save,
  CheckCircle2,
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'account', label: 'Mi Cuenta', icon: User },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    storeName: 'Variedades JM',
    address: 'Calle 10 # 5-23, Bogotá',
    phone: '601-234-5678',
    email: 'contacto@variedadesjm.com',
    nit: '900.123.456-7',
  });

  const [account, setAccount] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: true,
    newSale: false,
    cashClose: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Ajustes</h1>
        <p className="text-on-surface-variant text-sm mt-1">Configuración del sistema</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-secondary-container text-secondary rounded-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Cambios guardados exitosamente
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tabs sidebar */}
        <div className="w-full lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-outline-variant p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#202983] text-white'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-outline-variant p-6">
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-headline font-semibold text-on-surface mb-1">Información General</h2>
                  <p className="text-sm text-on-surface-variant">Datos de la tienda</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Nombre de la Tienda</label>
                    <input
                      type="text"
                      value={general.storeName}
                      onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">NIT</label>
                    <input
                      type="text"
                      value={general.nit}
                      onChange={(e) => setGeneral({ ...general, nit: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Dirección</label>
                    <input
                      type="text"
                      value={general.address}
                      onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={general.phone}
                      onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                    <input
                      type="email"
                      value={general.email}
                      onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-headline font-semibold text-on-surface mb-1">Mi Cuenta</h2>
                  <p className="text-sm text-on-surface-variant">Información de la cuenta</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={account.fullName}
                      onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                      placeholder="Ingrese su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                    <input
                      type="email"
                      value={account.email}
                      onChange={(e) => setAccount({ ...account, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Contraseña Actual</label>
                    <input
                      type="password"
                      value={account.currentPassword}
                      onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={account.newPassword}
                      onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-headline font-semibold text-on-surface mb-1">Notificaciones</h2>
                  <p className="text-sm text-on-surface-variant">Configurar alertas</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'lowStock' as const, label: 'Stock bajo', desc: 'Alertar cuando un producto tenga stock bajo' },
                    { key: 'dailyReport' as const, label: 'Reporte diario', desc: 'Recibir resumen de ventas al final del día' },
                    { key: 'newSale' as const, label: 'Nueva venta', desc: 'Notificar cada vez que se registre una venta' },
                    { key: 'cashClose' as const, label: 'Cierre de caja', desc: 'Recordar cerrar la caja al final del día' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                      <div>
                        <p className="text-sm font-medium text-on-surface">{item.label}</p>
                        <p className="text-xs text-on-surface-variant">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          notifications[item.key] ? 'bg-secondary' : 'bg-outline-variant'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-headline font-semibold text-on-surface mb-1">Seguridad</h2>
                  <p className="text-sm text-on-surface-variant">Opciones de seguridad de la cuenta</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface">Autenticación de dos factores</p>
                      <p className="text-xs text-on-surface-variant">Agrega una capa extra de seguridad</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-container text-on-surface-variant">
                      Próximamente
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface">Sesiones activas</p>
                      <p className="text-xs text-on-surface-variant">Administrar dispositivos conectados</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-container text-on-surface-variant">
                      1 sesión
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-headline font-semibold text-on-surface mb-1">Apariencia</h2>
                  <p className="text-sm text-on-surface-variant">Personalizar la interfaz</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Tema</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                        appearance.theme === 'light'
                          ? 'border-[#202983] bg-white'
                          : 'border-outline-variant bg-white'
                      }`}
                    >
                      <div className="w-full h-8 bg-surface rounded mb-2" />
                      <p className="text-xs font-medium text-on-surface">Claro</p>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                        appearance.theme === 'dark'
                          ? 'border-[#202983] bg-white'
                          : 'border-outline-variant bg-white'
                      }`}
                    >
                      <div className="w-full h-8 bg-gray-800 rounded mb-2" />
                      <p className="text-xs font-medium text-on-surface">Oscuro</p>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Tamaño de fuente</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setAppearance({ ...appearance, fontSize: size })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          appearance.fontSize === size
                            ? 'bg-[#202983] text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Modo compacto</p>
                    <p className="text-xs text-on-surface-variant">Reducir espaciado en la interfaz</p>
                  </div>
                  <button
                    onClick={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      appearance.compactMode ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        appearance.compactMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-[#202983] hover:bg-[#39429b] text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
