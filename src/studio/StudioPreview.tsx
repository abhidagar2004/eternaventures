import { useEffect, useRef, useState } from 'react';
import { Crosshair, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { StudioDocument, StudioSection } from './types';

export default function StudioPreview({ path, document, theme, selected = '', onSnapshot, onSelect, onDeviceChange }: {
  path: string;
  document: StudioDocument;
  theme: Record<string, string>;
  selected?: string;
  onSnapshot?: (sections: StudioSection[]) => void;
  onSelect?: (selector: string) => void;
  onDeviceChange?: (device: string) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState('Desktop');
  const [inspect, setInspect] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [width, setWidth] = useState(600);
  const container = useRef<HTMLDivElement>(null);
  const state = useRef({ document, theme, selected, inspect });
  state.current = { document, theme, selected, inspect };
  const callbacks = useRef({ onSnapshot, onSelect });
  callbacks.current = { onSnapshot, onSelect };
  const viewport = device === 'Desktop' ? 1440 : device === 'Tablet' ? 820 : 390;
  const scale = Math.min(1, width / viewport);
  function send() {
    frame.current?.contentWindow?.postMessage({ type: 'eterna-studio-preview', ...state.current }, window.location.origin);
  }
  useEffect(() => {
    setReady(false);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'eterna-studio-snapshot' && event.data.path === path) {
        setReady(true);
        callbacks.current.onSnapshot?.(event.data.sections);
      }
      if (event.data?.type === 'eterna-studio-select') callbacks.current.onSelect?.(event.data.selector);
      if (event.data?.type === 'eterna-studio-preview-submit') setNotice('Form preview. Open the live page to submit an inquiry.');
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [path]);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (ready) send(); }, [document, theme, selected, inspect, ready]);
  useEffect(() => {
    if (selected && ready) frame.current?.contentWindow?.postMessage({ type: 'eterna-studio-scroll', selector: selected }, window.location.origin);
  }, [selected, ready]);
  return <section className="studio-preview studio-panel">
    <div className="studio-preview-header"><div><h3>Live Preview</h3><span>{path}</span></div><div className="studio-device-tabs">{[{ label: 'Desktop', icon: Monitor }, { label: 'Tablet', icon: Tablet }, { label: 'Mobile', icon: Smartphone }].map(({ label, icon: Icon }) => <button type="button" key={label} aria-label={`${label} preview`} aria-pressed={device === label} onClick={() => { setDevice(label); onDeviceChange?.(label); }}><Icon size={16} /><span>{label}</span></button>)}</div></div>
    <div className="studio-preview-tools">{onSelect ? <button type="button" aria-pressed={inspect} onClick={() => setInspect(!inspect)}><Crosshair size={15} />{inspect ? 'Select an element in the preview' : 'Select element'}</button> : <span>Responsive website preview</span>}<a href={path} target="_blank" rel="noopener noreferrer" aria-label="Open live page"><ExternalLink size={16} /></a></div>
    {notice && <p className="studio-note" role="status">{notice}</p>}
    <div className="studio-preview-stage" ref={container}>
      <div className="studio-preview-device" style={{ width: viewport * scale, height: 860 * scale }}>
        <iframe ref={frame} title={`Live ${device.toLowerCase()} preview of ${path}`} src={`${path}?studio-preview=1`} style={{ width: viewport, height: 860, transform: `scale(${scale})` }} onLoad={() => { send(); frame.current?.contentWindow?.postMessage({ type: 'eterna-studio-capture' }, window.location.origin); }} />
      </div>
      {!ready && <p className="studio-preview-loading">Loading live page…</p>}
    </div>
  </section>;
}
