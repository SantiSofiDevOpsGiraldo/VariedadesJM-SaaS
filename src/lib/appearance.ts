export type AppTheme = 'light' | 'dark';
export type AppBackgroundMode = 'color' | 'image';

export interface AppAppearance {
  theme: AppTheme;
  backgroundMode: AppBackgroundMode;
  backgroundColor: string;
  backgroundImageUrl: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

const STORAGE_KEY = 'variedades_jm_appearance';

export const defaultAppearance: AppAppearance = {
  theme: 'light',
  backgroundMode: 'color',
  backgroundColor: '#f9f9f9',
  backgroundImageUrl: '',
  fontSize: 'medium',
  compactMode: false,
};

export function loadAppearance(): AppAppearance {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultAppearance;
  }

  try {
    return { ...defaultAppearance, ...JSON.parse(raw) };
  } catch {
    return defaultAppearance;
  }
}

export function saveAppearance(appearance: AppAppearance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
}

export function applyAppearance(appearance: AppAppearance) {
  const root = document.documentElement;

  if (appearance.theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const backgroundImage =
    appearance.backgroundMode === 'image' && appearance.backgroundImageUrl
      ? `linear-gradient(rgba(10, 12, 18, 0.35), rgba(10, 12, 18, 0.35)), url("${appearance.backgroundImageUrl}")`
      : 'none';

  root.style.setProperty('--app-background-color', appearance.backgroundColor || '#f9f9f9');
  root.style.setProperty('--app-background-image', backgroundImage);
}