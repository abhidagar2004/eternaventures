import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import StudioHeader from './StudioHeader';
import StudioPreview from './StudioPreview';
import { useStudioDocument } from './useStudioDocument';
import { STUDIO_FONTS, THEME_DEFAULTS } from './theme';
import { emptyStudioDocument } from './types';
import { readStudioDocument } from './store';

export default function StudioTheme() {
  const { value, edit, published, loading, saving, dirty, loadError, save } = useStudioDocument('theme');
  const [tab, setTab] = useState('Colors & Typography');
  const [home, setHome] = useState(emptyStudioDocument);
  const theme = { ...THEME_DEFAULTS, ...value.theme };
  useEffect(() => { readStudioDocument('/').then(setHome).catch(() => {}); }, []);
  function change(key: string, setting: string) {
    edit(current => ({ ...current, theme: { ...THEME_DEFAULTS, ...current.theme, [key]: setting } }));
  }
  function input(key: string, label: string, type = 'number') {
    return <label key={key}>{label}<input type={type} min={0} value={theme[key]} onChange={event => change(key, event.target.value)} /></label>;
  }
  function color(key: string, label: string) {
    return <label className="studio-theme-color" key={key}>{label}<div className="studio-color-field"><input type="color" value={/^#[0-9a-f]{6}$/i.test(theme[key]) ? theme[key] : '#000000'} onChange={event => change(key, event.target.value)} /><input value={theme[key]} onChange={event => change(key, event.target.value)} /></div></label>;
  }
  return <div>
    <StudioHeader title="Global Theme" description="Manage the website’s colors, typography, buttons, and layout." path="/" dirty={dirty} saving={saving} disabled={loading || !!loadError} published={!!published.version && value.version === published.version} onSave={() => save(true)} onPublish={() => save(false)} />
    {loadError && <p className="studio-error" role="alert">{loadError}</p>}
    <div className="studio-theme-notice">Global styles apply across your website. Individual element styles take priority.</div>
    <div className="studio-page-tabs"><div>{['Colors & Typography', 'Components & States', 'Layout'].map(name => <button aria-pressed={tab === name} onClick={() => setTab(name)} key={name}>{name}</button>)}</div></div>
    <div className="studio-theme-grid"><div className="studio-theme-controls">
      {tab === 'Colors & Typography' ? <>
        <section className="studio-panel"><h2>Color Palette</h2><p>Define your brand colors and page surfaces.</p><div className="studio-field-grid">{[['accent', 'Accent'], ['dark', 'Dark background'], ['surface', 'Light surface'], ['textDark', 'Text on dark'], ['textLight', 'Text on light']].map(([key, label]) => color(key, label))}</div></section>
        <section className="studio-panel"><h2>Typography</h2><p>Set responsive heading sizes and body text.</p><div className="studio-form"><div className="studio-field-grid">{[['headingFont', 'Heading font'], ['bodyFont', 'Body font']].map(([key, label]) => <label key={key}>{label}<select value={theme[key]} onChange={event => change(key, event.target.value)}>{STUDIO_FONTS.map(font => <option key={font}>{font}</option>)}</select></label>)}</div><label>Heading weight<select value={theme.headingWeight} onChange={event => change('headingWeight', event.target.value)}>{['400', '500', '600', '700', '800', '900'].map(weight => <option key={weight}>{weight}</option>)}</select></label>
          <div className="studio-type-table"><div><strong>Type</strong><strong>Desktop</strong><strong>Tablet</strong><strong>Mobile</strong></div>{['h1', 'h2'].map(type => <div key={type}><strong>{type.toUpperCase()}</strong>{['Desktop', 'Tablet', 'Mobile'].map(device => <input key={device} aria-label={`${type} ${device} size`} type="number" min={20} max={140} value={theme[`${type}${device}`]} onChange={event => change(`${type}${device}`, event.target.value)} />)}</div>)}</div><div className="studio-field-grid">{input('bodySize', 'Paragraph size (px)')}{input('lineHeight', 'Paragraph line height', 'text')}</div>
        </div></section>
      </> : tab === 'Components & States' ? <section className="studio-panel"><h2>Buttons & Cards</h2><p>Style shared buttons and their hover state.</p><div className="studio-form"><h3>Default state</h3><div className="studio-field-grid">{color('buttonBackground', 'Button background')}{color('buttonText', 'Button text')}</div><h3>Hover state</h3><div className="studio-field-grid">{color('buttonHover', 'Hover background')}{color('buttonHoverText', 'Hover text')}</div><div className="studio-field-grid">{input('buttonRadius', 'Button radius (px)')}{input('buttonPadding', 'Vertical padding (px)')}{input('transition', 'Transition (ms)')}{input('cardRadius', 'Card radius (px)')}</div></div></section> : <section className="studio-panel"><h2>Layout Settings</h2><p>Configure content width and spacing across pages.</p><div className="studio-form">{input('containerWidth', 'Container maximum width (px)')}{input('sectionPadding', 'Section vertical padding (px)')}{input('gridGap', 'Grid gap (px)')}<label>Header behavior<select value={theme.headerPosition} onChange={event => change('headerPosition', event.target.value)}><option value="fixed">Fixed on scroll</option><option value="absolute">Scroll with the page</option></select></label></div></section>}
      <button className="studio-reset" onClick={() => edit({ ...value, theme: {} })}><RotateCcw size={16} />Reset to website defaults</button>
    </div><StudioPreview path="/" document={home} theme={value.theme} /></div>
  </div>;
}
