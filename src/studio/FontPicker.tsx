import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { ensureStudioFont, FONT_CATALOG } from './fonts';

export default function FontPicker({ label, value, onChange }: { label: string; value: string; onChange: (font: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { ensureStudioFont(value); }, [value]);
  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const outside = (event: MouseEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);
  const results = FONT_CATALOG.filter(font => `${font.name} ${font.category}`.toLowerCase().includes(query.toLowerCase()));
  function choose(font: string) { onChange(font); setOpen(false); trigger.current?.focus(); }
  return <div className="theme-font-picker" ref={root} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    if (open && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      const options = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
      const index = options.findIndex(option => option === document.activeElement);
      const next = event.key === 'ArrowDown' ? Math.min(index + 1, options.length - 1) : Math.max(0, index - 1);
      event.preventDefault();
      options[next]?.focus();
    }
    if (event.key === 'Enter' && event.target === search.current && results.length === 1) { event.preventDefault(); choose(results[0].name); }
  }}>
    <span className="theme-control-label">{label}</span>
    <button ref={trigger} type="button" aria-label={label} aria-expanded={open} aria-haspopup="listbox" onClick={() => { setOpen(!open); setQuery(''); }}><span style={{ fontFamily: `"${value}",sans-serif` }}>{value}</span><ChevronDown size={15} /></button>
    {open && <div className="theme-font-menu"><div className="theme-font-search"><Search size={15} /><input ref={search} aria-label={`Search ${label.toLowerCase()}`} placeholder="Search fonts…" value={query} onChange={event => setQuery(event.target.value)} /></div><div role="listbox" aria-label={label}>
      {['Sans Serif', 'Serif', 'Display', 'Monospace'].map(category => {
        const fonts = results.filter(font => font.category === category);
        return fonts.length > 0 && <div role="group" aria-label={category} key={category}><p>{category}</p>{fonts.map(font => <button type="button" role="option" aria-selected={value === font.name} key={font.name} onMouseEnter={() => ensureStudioFont(font.name)} onFocus={() => ensureStudioFont(font.name)} onClick={() => choose(font.name)} style={{ fontFamily: `"${font.name}",sans-serif` }}>{font.name}{value === font.name && <Check size={15} />}</button>)}</div>;
      })}
      {!results.length && <p className="studio-note">No matching fonts.</p>}
    </div></div>}
  </div>;
}
