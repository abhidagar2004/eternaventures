// Only public, published design values belong here. Drafts stay in the editor.
const CACHE_KEY = 'eterna:published-theme:v1';
let current: Record<string, string> | null = null;

export function cachedPublishedTheme(): Record<string, string> {
  if (current) return { ...current };
  try {
    const value = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      current = Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item === 'string')) as Record<string, string>;
    }
  } catch { /* Browser storage may be unavailable; in-memory navigation still works. */ }
  return { ...(current || {}) };
}

export function cachePublishedTheme(value: Record<string, string>) {
  current = Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item === 'string'));
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(current)); } catch { /* Keep the in-memory copy. */ }
}
