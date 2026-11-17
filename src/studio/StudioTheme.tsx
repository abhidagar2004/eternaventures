import { useEffect, useState, type CSSProperties } from 'react';
import { AlertCircle, ArrowRight, Badge, CheckCircle2, ChevronDown, CreditCard, Layers, Link2, Menu, Monitor, RotateCcw, Smartphone, Square, Tablet, TextCursorInput } from 'lucide-react';
import StudioHeader from './StudioHeader';
import StudioPreview from './StudioPreview';
import FontPicker from './FontPicker';
import { useStudioDocument } from './useStudioDocument';
import { COMPONENTS, COMPONENT_STATES, DEVICES, TYPE_ROWS, THEME_DEFAULTS, componentCssProperties, componentSettings, contrastRatio, layoutSettings, resolveTheme, type ComponentId, type ComponentState, type ThemeDevice } from './theme';
import { FONT_CATALOG } from './fonts';
import { emptyStudioDocument } from './types';
import { readStudioDocument } from './store';
import './StudioTheme.css';

function ColorControl({ label, value, onChange, disabled = false }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return <label className="theme-color-control"><span>{label}</span><div className="studio-color-field"><input aria-label={`${label} picker`} type="color" disabled={disabled} value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'} onChange={event => onChange(event.target.value)} /><input aria-label={label} disabled={disabled} value={value} onChange={event => onChange(event.target.value)} /></div></label>;
}

function NumberControl({ label, value, onChange, min = 0, max = 2000, step = 1 }: { label: string; value: string; onChange: (value: string) => void; min?: number; max?: number; step?: number }) {
  return <label className="theme-number-control"><span>{label}</span><input type="number" min={min} max={max} step={step} value={value} onChange={event => onChange(event.target.value)} /></label>;
}

function Switch({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <button className="theme-switch" type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}><span aria-hidden="true" /><span>{label}</span></button>;
}

function ContrastBadge({ background, foreground }: { background: string; foreground: string }) {
  const ratio = contrastRatio(background, foreground);
  const Icon = ratio >= 4.5 ? CheckCircle2 : AlertCircle;
  return <span className={`theme-contrast-badge${ratio < 4.5 ? ' needs-review' : ''}`} title={`${ratio.toFixed(2)}:1 contrast ratio`}><Icon size={13} />Contrast: {ratio >= 4.5 ? 'Pass' : 'Review'}<small>{ratio.toFixed(2)}:1</small></span>;
}

function ComponentSample({ component, state, theme }: { component: ComponentId; state: ComponentState; theme: Record<string, string> }) {
  const settings = componentSettings(theme, component, state);
  const css = componentCssProperties(settings, state);
  const styles = Object.fromEntries(Object.entries(css).map(([key, value]) => [key.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase()), value])) as CSSProperties;
  const common = { style: styles, 'aria-disabled': state === 'disabled' || undefined };
  if (component === 'field') return <input {...common} readOnly placeholder="Your work email" aria-label={`${state} form field example`} />;
  if (component === 'card') return <div {...common} className="theme-sample-card"><img src="/images/project-valia.jpg" alt="" /><strong>Project card</strong><span>A brand built to be remembered.</span></div>;
  if (component === 'badge') return <span {...common} className="theme-sample-badge">Brand Strategy</span>;
  if (['link', 'nav'].includes(component)) return <span {...common} className="theme-sample-link">{component === 'nav' ? 'Services' : 'Read Article'}{component === 'link' && <ArrowRight size={17} style={{ color: settings.icon }} />}</span>;
  return <button {...common} type="button" disabled={state === 'disabled'} className="theme-sample-button">{component === 'primary' ? 'START A PROJECT' : 'EXPLORE OUR WORK'}<ArrowRight size={18} style={{ color: settings.icon }} /></button>;
}

export default function StudioTheme() {
  const { value, edit, published, loading, saving, dirty, loadError, save } = useStudioDocument('theme');
  const [tab, setTab] = useState('Colors & Typography');
  const [home, setHome] = useState(emptyStudioDocument);
  const [component, setComponent] = useState<ComponentId>('primary');
  const [state, setState] = useState<ComponentState>('hover');
  const [device, setDevice] = useState<ThemeDevice>('Mobile');
  const [guides, setGuides] = useState(true);
  const theme = resolveTheme(value.theme);
  const settings = componentSettings(value.theme, component, state);
  const layout = layoutSettings(value.theme, device);
  const linkedLayout = device !== 'Desktop' && theme[`useDesktop${device}`] === 'true';
  const highlightBg = theme.highlightUseAccent === 'true' ? theme.accent : theme.highlightBackground;
  const highlightFg = theme.highlightUseAccent === 'true' ? theme.textAccent : theme.highlightText;
  useEffect(() => { readStudioDocument('/').then(setHome).catch(() => {}); }, []);

  function change(key: string, setting: string) {
    edit(current => ({ ...current, theme: { ...current.theme, [key]: setting } }));
  }
  function batch(changes: Record<string, string>) {
    edit(current => ({ ...current, theme: { ...current.theme, ...changes } }));
  }
  function componentChange(property: string, setting: string) { change(`component.${component}.${state}.${property}`, setting); }
  function componentAccent(checked: boolean) {
    const prefix = `component.${component}.${state}.`;
    batch({ [`${prefix}useAccent`]:String(checked), ...(!checked ? { [`${prefix}fill`]:settings.fill,[`${prefix}text`]:settings.text,[`${prefix}icon`]:settings.icon } : {}) });
  }
  function resetState() {
    const prefix = `component.${component}.${state}.`;
    edit(current => ({ ...current, theme: Object.fromEntries(Object.entries(current.theme).filter(([key]) => !key.startsWith(prefix))) }));
  }
  function resetLayout() {
    const keys = ['gutter', 'paddingTop', 'paddingBottom', 'columns', 'columnGap', 'rowGap', 'headerHeight', 'footerColumns', 'showHeader', 'showFooter'];
    batch({ ...Object.fromEntries(keys.map(key => [`${key}${device}`, THEME_DEFAULTS[`${key}${device}`]])), ...(device !== 'Desktop' ? { [`useDesktop${device}`]: 'false' } : { containerWidth: '1280' }) });
  }
  function color(key: string, label: string, disabled = false, setting = theme[key]) { return <ColorControl key={key} label={label} value={setting} disabled={disabled} onChange={next => change(key, next)} />; }
  function number(key: string, label: string, min = 0, max = 2000, step = 1) { return <NumberControl key={key} label={label} value={theme[key]} min={min} max={max} step={step} onChange={next => change(key, next)} />; }
  function componentNumber(property: string, label: string, max = 80) { return <NumberControl key={property} label={label} value={settings[property]} max={max} onChange={next => componentChange(property, next)} />; }
  const componentIcons = [CreditCard, Square, Link2, Layers, Badge, TextCursorInput, Menu];

  return <div className={`studio-global-theme theme-mode-${tab === 'Layout' ? 'layout' : tab === 'Components & States' ? 'components' : 'colors'}`}>
    <StudioHeader title="Global Theme" description="Manage the website’s colors, typography, buttons, and layout." path="/" dirty={dirty} saving={saving} disabled={loading || !!loadError} published={!!published.version && value.version === published.version} onSave={() => save(true)} onPublish={() => save(false)} />
    {loadError && <p className="studio-error" role="alert">{loadError}</p>}
    <div className="studio-theme-notice">Global styles apply across your website. Individual element styles take priority.</div>
    <div className="studio-page-tabs"><div>{['Colors & Typography', 'Components & States', 'Layout'].map(name => <button aria-pressed={tab === name} onClick={() => setTab(name)} key={name}>{name}</button>)}</div></div>
    <div className="studio-theme-grid"><div className="studio-theme-controls">
      {tab === 'Colors & Typography' ? <>
        <section className="studio-panel theme-palette"><h2>Color Palette</h2><p>Define your brand colors and page surfaces.</p>
          <div className="theme-color-table"><div className="theme-color-table-head"><strong>Color Role</strong><strong>Background</strong><strong>Foreground</strong></div>
            <div><strong>Brand Accent</strong>{color('accent', 'Accent Background')}{color('textAccent', 'Text on Accent')}</div>
            <div><strong>Dark Surface</strong>{color('dark', 'Dark Background')}{color('textDark', 'Text on Dark')}</div>
            <div><strong>Light Surface</strong>{color('surface', 'Light Background')}{color('textLight', 'Text on Light')}</div>
            <div><div><strong>Heading Highlight</strong><Switch label="Use Accent Pair" checked={theme.highlightUseAccent === 'true'} onChange={checked => batch({ highlightUseAccent:String(checked), ...(!checked ? { highlightBackground:highlightBg,highlightText:highlightFg } : {}) })} /></div>{color('highlightBackground', 'Highlight Background', theme.highlightUseAccent === 'true', highlightBg)}{color('highlightText', 'Highlight Text', theme.highlightUseAccent === 'true', highlightFg)}</div>
          </div>
          <details className="theme-details"><summary><ChevronDown size={14} /><strong>More colors</strong><span>Links & hover · Muted text · Borders & dividers</span></summary><div className="studio-field-grid">{color('linkColor', 'Links')}{color('linkHover', 'Link hover')}{color('mutedText', 'Muted text')}{color('divider', 'Borders & dividers')}</div></details>
        </section>
        <section className="studio-panel theme-typography"><h2>Typography</h2><p>Set responsive heading sizes and body text.</p>
          <div className="studio-field-grid theme-font-row"><FontPicker label="Heading font" value={theme.headingFont} onChange={next => change('headingFont', next)} /><FontPicker label="Body font" value={theme.bodyFont} onChange={next => change('bodyFont', next)} /></div>
          <div className="theme-typography-table-wrap"><table className="theme-typography-table"><thead><tr><th>Type</th><th>Desktop (px)</th><th>Tablet (px)</th><th>Mobile (px)</th><th>Weight</th></tr></thead><tbody>{TYPE_ROWS.map(row => <tr key={row.id}><th>{row.label}</th>{DEVICES.map(screen => <td key={screen}><input aria-label={`${row.label} ${screen} size`} type="number" min={10} max={160} value={theme[`${row.id}${screen}`]} onChange={event => change(`${row.id}${screen}`, event.target.value)} /></td>)}<td><select aria-label={`${row.label} font weight`} value={theme[`${row.id}Weight`]} onChange={event => change(`${row.id}Weight`, event.target.value)}>{[100,200,300,400,500,600,700,800,900].map(weight => <option key={weight}>{weight}</option>)}</select></td></tr>)}</tbody></table></div>
          <details className="theme-details"><summary><ChevronDown size={14} /><strong>Advanced typography</strong><span>Line height · Letter spacing · Text case</span></summary><div className="studio-field-grid">{number('headingLineHeight', 'Heading line height', .8, 2, .05)}{number('lineHeight', 'Body line height', 1, 2.5, .05)}{number('headingTracking', 'Heading letter spacing (px)', -8, 20, .1)}{number('bodyTracking', 'Body letter spacing (px)', -3, 12, .1)}{[['headingStyle', 'Heading style'], ['bodyStyle', 'Body style']].map(([key, label]) => <label className="theme-select-control" key={key}>{label}<select value={theme[key]} onChange={event => change(key, event.target.value)}><option value="normal">Normal</option><option value="italic">Italic</option></select></label>)}{[['headingCase', 'Heading text case'], ['bodyCase', 'Body text case']].map(([key, label]) => <label className="theme-select-control" key={key}>{label}<select value={theme[key]} onChange={event => change(key, event.target.value)}>{['none','uppercase','lowercase','capitalize'].map(option => <option key={option}>{option}</option>)}</select></label>)}</div><p className="studio-note">{FONT_CATALOG.length} font families available. Fonts load as you select them.</p></details>
        </section>
      </> : tab === 'Components & States' ? <section className="studio-panel theme-component-editor"><h2>Buttons & Cards</h2>
        <div className="theme-component-tabs">{COMPONENTS.map((item, index) => { const Icon = componentIcons[index]; return <button key={item.id} aria-pressed={component === item.id} onClick={() => setComponent(item.id)}><Icon size={15} />{item.name}</button>; })}</div>
        <div className="theme-state-toolbar"><div className="studio-segmented">{COMPONENT_STATES.map(item => <button key={item} aria-pressed={state === item} onClick={() => setState(item)}>{item === 'pressed' ? 'Pressed' : item[0].toUpperCase() + item.slice(1)}</button>)}</div><Switch label="Use Accent Pair" checked={settings.useAccent === 'true'} onChange={componentAccent} /><button className="theme-state-reset" onClick={resetState}><RotateCcw size={13} />Reset this state</button></div>
        <fieldset className="theme-group"><legend>Color & Border</legend><div className="theme-control-grid theme-five-columns">{[['fill', 'Fill'], ['text', 'Text'], ['border', 'Border color']].map(([key,label]) => <ColorControl key={key} label={label} value={settings[key]} disabled={settings.useAccent === 'true' && ['fill','text'].includes(key)} onChange={next => componentChange(key,next)} />)}{componentNumber('borderWidth', 'Border width (px)',12)}<ColorControl label="Icon color" value={settings.icon} disabled={settings.useAccent === 'true'} onChange={next => componentChange('icon', next)} /></div></fieldset>
        <fieldset className="theme-group"><legend>Shape & Type</legend><div className="theme-control-grid theme-three-columns">{componentNumber('radius','Radius (px)',100)}{componentNumber('paddingX','X padding (px)')}{componentNumber('paddingY','Y padding (px)')}<label className="theme-select-control">Font weight<select value={settings.weight} onChange={event => componentChange('weight', event.target.value)}>{[400,500,600,700,800,900].map(weight => <option key={weight}>{weight}</option>)}</select></label>{componentNumber('gap','Icon gap (px)',40)}<label className="theme-select-control">Shadow<select value={settings.shadow} onChange={event => componentChange('shadow', event.target.value)}>{['None','Soft','Medium','Strong'].map(shadow => <option key={shadow}>{shadow}</option>)}</select></label></div>{['link','nav'].includes(component) && <Switch label="Underline" checked={settings.underline === 'true'} onChange={checked => componentChange('underline', String(checked))} />}</fieldset>
        {state === 'focus' && <fieldset className="theme-group"><legend>Focus outline</legend><div className="studio-field-grid"><ColorControl label="Focus color" value={settings.focusColor} onChange={next => componentChange('focusColor', next)} />{componentNumber('focusWidth','Outline width (px)',8)}</div></fieldset>}
        <fieldset className="theme-group"><legend>Motion</legend><div className="theme-control-grid theme-three-columns">{componentNumber('duration','Duration (ms)',3000)}<label className="theme-select-control">Easing<select value={settings.easing} onChange={event => componentChange('easing', event.target.value)}>{['ease','ease-in','ease-out','ease-in-out','linear'].map(ease => <option key={ease}>{ease}</option>)}</select></label><Switch label="Respect reduced motion" checked={theme.respectReducedMotion === 'true'} onChange={checked => change('respectReducedMotion',String(checked))} /></div></fieldset>
        <details className="theme-details"><summary><ChevronDown size={14} /><Layers size={15} /><strong>Card & form presets</strong></summary><div className="theme-preset-buttons"><button onClick={() => batch({ 'component.card.default.radius':'12','component.card.default.shadow':'Soft','component.card.default.borderWidth':'1' })}>Soft card</button><button onClick={() => batch({ 'component.field.default.radius':'6','component.field.default.borderWidth':'1','component.field.default.fill':'#ffffff','component.field.focus.border':theme.accent })}>Outlined fields</button></div></details>
      </section> : <section className="studio-panel theme-layout-editor"><h2>Layout Settings</h2><p>Configure content width and spacing across pages.</p>
        <div className="theme-layout-device-tabs">{DEVICES.map((screen,index) => { const Icon = [Monitor,Tablet,Smartphone][index]; return <button key={screen} aria-pressed={device === screen} onClick={() => setDevice(screen)}><Icon size={16} />{screen}</button>; })}</div>
        <fieldset className="theme-group" disabled={linkedLayout}><legend>Container & Spacing</legend><div className="studio-field-grid">{number('containerWidth','Container maximum width (px)',600,1920)}<NumberControl label="Page gutter (px)" value={layout.gutter} max={200} onChange={next => change(`gutter${device}`,next)} /><NumberControl label="Section padding top (px)" value={layout.top} max={240} onChange={next => change(`paddingTop${device}`,next)} /><NumberControl label="Section padding bottom (px)" value={layout.bottom} max={240} onChange={next => change(`paddingBottom${device}`,next)} /></div></fieldset>
        <fieldset className="theme-group" disabled={linkedLayout}><legend>Grid</legend><div className="theme-control-grid theme-three-columns"><label className="theme-select-control">Practice columns<select value={layout.columns} onChange={event => change(`columns${device}`, event.target.value)}>{[1,2,3,4,5,6].map(columns => <option key={columns}>{columns}</option>)}</select></label><NumberControl label="Column gap (px)" value={layout.columnGap} max={100} onChange={next => change(`columnGap${device}`,next)} /><NumberControl label="Row gap (px)" value={layout.rowGap} max={100} onChange={next => change(`rowGap${device}`,next)} /></div></fieldset>
        <fieldset className="theme-group" disabled={linkedLayout}><legend>Header & Footer</legend><div className="studio-field-grid"><label className="theme-select-control">Header behavior<select value={theme.headerPosition} onChange={event => change('headerPosition', event.target.value)}><option value="fixed">Sticky</option><option value="absolute">Scroll away</option></select></label><NumberControl label="Header height (px)" value={layout.header} min={40} max={160} onChange={next => change(`headerHeight${device}`,next)} /><label className="theme-select-control">Mobile menu style<select value={theme.mobileMenu} onChange={event => change('mobileMenu',event.target.value)}><option value="dropdown">Dropdown</option><option value="drawer">Drawer</option></select></label><label className="theme-select-control">Footer columns<select value={layout.footerColumns} onChange={event => change(`footerColumns${device}`,event.target.value)}>{[1,2,3,4,5,6].map(columns => <option key={columns}>{columns}</option>)}</select></label></div></fieldset>
        <details className="theme-details"><summary><ChevronDown size={14} /><strong>Breakpoints & visibility</strong></summary><p className="studio-note">Desktop above 1000px · Tablet 601–1000px · Mobile up to 600px</p><div className="theme-visibility"><Switch label={`Show header on ${device.toLowerCase()}`} checked={layout.showHeader === 'true'} disabled={linkedLayout} onChange={checked => change(`showHeader${device}`,String(checked))} /><Switch label={`Show footer on ${device.toLowerCase()}`} checked={layout.showFooter === 'true'} disabled={linkedLayout} onChange={checked => change(`showFooter${device}`,String(checked))} /></div></details>
        <div className="theme-layout-footer"><button onClick={resetLayout}><RotateCcw size={14} />Reset {device} Layout</button>{device !== 'Desktop' && <Switch label="Use Desktop Defaults" checked={linkedLayout} onChange={checked => change(`useDesktop${device}`,String(checked))} />}</div>
      </section>}
      {tab !== 'Layout' && <button className="studio-reset" onClick={() => edit({ ...value, theme: {} })}><RotateCcw size={16} />Reset to website defaults</button>}
    </div>
    <aside className="studio-theme-preview-stack">
      {tab === 'Layout' ? <section className="studio-panel theme-layout-previews"><header><div><h2>Live Preview</h2><p>Responsive website preview</p></div><Switch label="Show spacing guides" checked={guides} onChange={setGuides} /></header><div className="theme-dual-preview"><StudioPreview path="/" document={home} theme={value.theme} fixedDevice={device === 'Tablet' ? 'Tablet' : 'Desktop'} viewportWidth={device === 'Tablet' ? 820 : 1280} guides={guides ? layoutSettings(value.theme,device === 'Tablet' ? 'Tablet' : 'Desktop') : undefined} /><StudioPreview path="/" document={home} theme={value.theme} fixedDevice="Mobile" viewportWidth={375} guides={guides ? layoutSettings(value.theme,'Mobile') : undefined} /></div></section> : <StudioPreview path="/" document={home} theme={value.theme} />}
      {tab === 'Colors & Typography' && <section className="studio-panel theme-readability"><h2>Color readability</h2><p>Check your color combinations for accessibility and legibility.</p><div><div><span className="theme-readability-button" style={{ background:theme.accent,color:theme.textAccent }}>START A PROJECT <ArrowRight size={16} /></span><ContrastBadge background={theme.accent} foreground={theme.textAccent} /></div><div><span className="theme-readability-highlight" style={{ background:highlightBg,color:highlightFg }}>IT’S A DISCIPLINE.</span><ContrastBadge background={highlightBg} foreground={highlightFg} /></div></div><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener noreferrer">4.5:1 contrast target for normal text</a></section>}
      {tab === 'Components & States' && <section className="studio-panel theme-state-comparison"><header><h2>State comparison</h2><label>View state<select value={state} onChange={event => setState(event.target.value as ComponentState)}>{COMPONENT_STATES.map(option => <option key={option}>{option}</option>)}</select></label></header><div>{(['default',state,'focus'] as ComponentState[]).map((sample,index) => <div key={`${sample}-${index}`} className={index === 1 ? 'is-selected' : ''}><ComponentSample component={component} state={sample} theme={value.theme} /><span>{sample[0].toUpperCase()+sample.slice(1)}</span></div>)}</div></section>}
    </aside></div>
  </div>;
}
