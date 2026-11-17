import { supabase } from '../lib/supabase';
import { emptyStudioDocument, type StudioDocument } from './types';
import { cachePublishedTheme } from './publishedThemeCache';

export function studioKey(path: string, draft = false) {
  return `studio:${draft ? 'draft' : 'published'}:${path}`;
}

async function draftStorageKey(path: string) {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Sign in to save a draft.');
  return `${studioKey(path, true)}:${data.session.user.id}`;
}

export async function readStudioDocument(path: string, draft = false): Promise<StudioDocument> {
  if (draft) {
    try {
      const value = JSON.parse(localStorage.getItem(await draftStorageKey(path)) || 'null');
      return value && typeof value === 'object' ? { ...emptyStudioDocument(), ...value } : emptyStudioDocument();
    } catch { return emptyStudioDocument(); }
  }
  const { data, error } = await supabase.from('site_settings').select('setting_value').eq('setting_key', studioKey(path, draft)).maybeSingle();
  if (error) throw error;
  const value = data?.setting_value;
  const defaults = emptyStudioDocument();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
  return { ...defaults, ...value, overrides: value.overrides || {}, seo: { ...defaults.seo, ...value.seo }, theme: value.theme || {} };
}

export async function saveStudioDocument(path: string, value: StudioDocument, draft: boolean, expectedVersion = '') {
  const document = { ...value, version: crypto.randomUUID(), updatedAt: new Date().toISOString() };
  const payload = { setting_key: studioKey(path, draft), setting_value: document };
  if (draft) {
    localStorage.setItem(await draftStorageKey(path), JSON.stringify(document));
  } else if (expectedVersion) {
    const { data, error } = await supabase.from('site_settings').update({ setting_value: document })
      .eq('setting_key', payload.setting_key).eq('setting_value->>version', expectedVersion).select('setting_key');
    if (error) throw error;
    if (!data?.length) throw new Error('This page was published in another session. Reload before publishing your changes.');
  } else {
    const { error } = await supabase.from('site_settings').insert(payload);
    if (error?.code === '23505') throw new Error('This page was published in another session. Reload before publishing your changes.');
    if (error) throw error;
  }
  if (!draft) {
    if (path === 'theme') cachePublishedTheme(document.theme);
    try { localStorage.removeItem(await draftStorageKey(path)); } catch { /* Publishing succeeded even when browser storage is unavailable. */ }
  }
  return document;
}
