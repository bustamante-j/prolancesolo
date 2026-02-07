export type Theme = 'system' | 'dark' | 'light';
const THEME_KEY = 'theme';

export function getStoredTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (!t) return null;
    if (t === 'dark' || t === 'light' || t === 'system') return t as Theme;
    return null;
  } catch (e) {
    return null;
  }
}

export function setStoredTheme(theme: Theme | null) {
  try {
    if (theme === null) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_KEY, newValue: theme as string } as any));
  } catch (e) {}
}

export function prefersDark(): boolean {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
}

export function applyTheme(theme: Theme | null) {
  const effective = theme === 'system' || theme === null ? (prefersDark() ? 'dark' : 'light') : theme;
  document.documentElement.classList.toggle('dark', effective === 'dark');
}

export function initThemeOnLoad() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    const theme = stored === 'dark' || stored === 'light' || stored === 'system' ? stored : null;
    applyTheme(theme as any);
  } catch (e) {}
}
