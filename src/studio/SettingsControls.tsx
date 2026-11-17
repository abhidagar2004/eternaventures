import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Loader2, Monitor, Save, Smartphone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { settingColor } from './sharedSettings';
import './StudioSettings.css';

export function useSharedSetting<T>(key: string, merge: (value?: Partial<T>) => T) {
  const [config, setConfig] = useState<T>(() => merge());
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [error, setError] = useState(''), [dirty, setDirty] = useState(false);
  const revision = useRef(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.resolve(supabase.from('site_settings').select('setting_value').eq('setting_key', key).maybeSingle()).then(({ data, error }) => {
      if (!active) return;
      if (error) throw error;
      setConfig(merge(data?.setting_value)); setLoading(false);
    }).catch(error => { if (active) { setError(error.message || 'Unable to load settings. Please reload.'); setLoading(false); } });
    return () => { active = false; };
  }, [key, merge]);
  function update(next: T | ((value: T) => T)) { revision.current++; setConfig(next); setDirty(true); }
  async function save() {
    if (error || saving || loading) return;
    setSaving(true);
    const snapshot = config;
    const savedRevision = revision.current;
    try {
      const { error } = await supabase.from('site_settings').upsert({ setting_key: key, setting_value: snapshot }, { onConflict: 'setting_key' });
      if (error) throw error;
      if (revision.current === savedRevision) setDirty(false);
      toast.success('Settings saved to your website.');
    } catch (error) { toast.error(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Unable to save settings.'); }
    finally { setSaving(false); }
  }
  return { config, update, loading, saving, error, dirty, save };
}
export function SettingsHeader({ title, subtitle, section, saving, disabled, dirty, onSave, onPreview }: { title: string; subtitle: string; section: string; saving: boolean; disabled: boolean; dirty: boolean; onSave: () => void; onPreview: () => void }) {
  return <><div className="studio-breadcrumb"><Link to="/admin/overview">Studio</Link><span>›</span><Link to="/admin/settings">Global Settings</Link><span>›</span>{section}</div><header className="studio-page-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="studio-publish-actions">{dirty && <span className="studio-status studio-status-draft">Unsaved changes</span>}<button onClick={onPreview}><Eye size={18} />Preview</button><button className="studio-primary" onClick={onSave} disabled={disabled || saving}>{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}Save {title.replace('Manage ', '')}</button></div></header></>;
}
export function SettingsPanel({ title, icon, children, action }: { title: string; icon?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="studio-panel settings-panel"><header><h2>{icon && <span className="settings-heading-icon">{icon}</span>}{title}</h2>{action}</header>{children}</section>;
}
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="settings-field"><span>{label}</span>{children}</label>; }
export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const color = settingColor(value);
  return <Field label={label}><span className="settings-color"><input aria-label={`${label} color picker`} type="color" value={/^#[\da-f]{6}$/i.test(color) ? color : '#000000'} onChange={e => onChange(e.target.value)} /><input aria-label={`${label} color value`} value={value} onChange={e => onChange(e.target.value)} /></span></Field>;
}
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) { return <button type="button" className="settings-toggle" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}><span className="settings-switch" />{label}</button>; }
export function DeviceTabs({ mobile, setMobile }: { mobile: boolean; setMobile: (value: boolean) => void }) { return <div className="settings-segments settings-device"><button aria-pressed={!mobile} onClick={() => setMobile(false)}><Monitor size={18} />Desktop</button><button aria-pressed={mobile} onClick={() => setMobile(true)}><Smartphone size={18} />Mobile</button></div>; }
export function OrderControls({ index, count, move, remove, name }: { index: number; count: number; move: (to: number) => void; remove: () => void; name: string }) {
  return <details className="settings-order"><summary aria-label={`Actions for ${name}`}><GripVertical size={16} /></summary><div><button disabled={index === 0} onClick={() => move(index - 1)} aria-label={`Move ${name} up`}><ArrowUp size={14} />Move up</button><button disabled={index === count - 1} onClick={() => move(index + 1)} aria-label={`Move ${name} down`}><ArrowDown size={14} />Move down</button><button onClick={remove}><Trash2 size={14} />Remove</button></div></details>;
}
export function Visibility({ visible, onChange }: { visible: boolean; onChange: (value: boolean) => void }) { return <button className={`settings-visibility ${visible ? 'is-visible' : ''}`} aria-pressed={visible} onClick={() => onChange(!visible)}>{visible ? <Eye size={15} /> : <EyeOff size={15} />}{visible ? 'Visible' : 'Hidden'}</button>; }
export function SettingsLoad({ loading, error }: { loading: boolean; error: string }) { return loading ? <div className="settings-loading"><Loader2 className="animate-spin" />Loading settings…</div> : error ? <div className="settings-error" role="alert">{error} <button onClick={() => window.location.reload()}>Reload settings</button></div> : null; }
