import { useEffect, useMemo, useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Store,
  Save,
  CheckCircle2,
  Image,
  Moon,
  SunMedium,
} from 'lucide-react';
import { applyAppearance, loadAppearance, saveAppearance } from '@/lib/appearance';

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

  const [appearance, setAppearance] = useState(loadAppearance());

  useEffect(() => {
    applyAppearance(appearance);
    saveAppearance(appearance);
  }, [appearance]);

  const previewStyle = useMemo(
    () => ({
      backgroundColor: appearance.backgroundColor,
      backgroundImage:
        appearance.backgroundMode === 'image' && appearance.backgroundImageUrl
          ? `linear-gradient(rgba(10, 12, 18, 0.4), rgba(10, 12, 18, 0.4)), url("${appearance.backgroundImageUrl}")`
          : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
    [appearance.backgroundColor, appearance.backgroundImageUrl, appearance.backgroundMode]
  );

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
          <div className="bg-white rounded-2xl border border-outline-variant p-6 dark:bg-slate-900 dark:border-slate-800 transition-colors">
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
                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">Tema</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                          className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 transition-colors ${
                            appearance.theme === 'light'
                              ? 'border-[#202983] bg-white dark:bg-slate-800'
                              : 'border-outline-variant bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-on-surface">Claro</p>
                            <p className="text-xs text-on-surface-variant">Interfaz luminosa</p>
                          </div>
                          <SunMedium className="w-5 h-5 text-[#202983]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                          className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 transition-colors ${
                            appearance.theme === 'dark'
                              ? 'border-[#202983] bg-white dark:bg-slate-800'
                              : 'border-outline-variant bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-on-surface">Oscuro</p>
                            <p className="text-xs text-on-surface-variant">Modo nocturno</p>
                          </div>
                          <Moon className="w-5 h-5 text-[#202983]" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">Fondo de la aplicación</label>
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setAppearance({ ...appearance, backgroundMode: 'color' })}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            appearance.backgroundMode === 'color'
                              ? 'bg-[#202983] text-white'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          Color
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppearance({ ...appearance, backgroundMode: 'image' })}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            appearance.backgroundMode === 'image'
                              ? 'bg-[#202983] text-white'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          Imagen
                        </button>
                      </div>
                      {appearance.backgroundMode === 'color' ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={appearance.backgroundColor}
                            onChange={(e) => setAppearance({ ...appearance, backgroundColor: e.target.value })}
                            className="h-12 w-16 rounded-xl border border-outline-variant bg-white p-1"
                          />
                          <input
                            type="text"
                            value={appearance.backgroundColor}
                            onChange={(e) => setAppearance({ ...appearance, backgroundColor: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                            placeholder="#f9f9f9"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Image className="w-4 h-4 text-[#202983]" />
                            <span className="text-xs text-on-surface-variant">URL de imagen de fondo</span>
                          </div>
                          <input
                            type="url"
                            value={appearance.backgroundImageUrl}
                            onChange={(e) => setAppearance({ ...appearance, backgroundImageUrl: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-[#202983]"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">Vista previa</label>
                      <div className="min-h-44 rounded-2xl border border-outline-variant overflow-hidden shadow-sm" style={previewStyle}>
                        <div className="min-h-44 bg-black/20 p-4 flex items-end">
                          <div className="bg-white/90 dark:bg-slate-900/85 backdrop-blur rounded-2xl p-4 max-w-xs border border-white/40 dark:border-slate-700">
                            <p className="text-sm font-semibold text-on-surface">Vista previa en vivo</p>
                            <p className="text-xs text-on-surface-variant mt-1">
                              El cambio se aplica al instante y queda guardado en el navegador.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">Tamaño de fuente</label>
                      <div className="flex gap-2 flex-wrap">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setAppearance({ ...appearance, fontSize: size as 'small' | 'medium' | 'large' })}
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
                        type="button"
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
                    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-xs text-on-surface-variant">
                      Los cambios se almacenan en `localStorage` para persistir entre sesiones.
                    </div>
                  </div>
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
