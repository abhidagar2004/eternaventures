import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronRight, Eye, EyeOff, GripVertical, Image, Loader2, RotateCcw, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, uploadImage } from '../lib/supabase';
import { servicesData } from '../data/servicesData';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageCourses from '../pages/admin/ManageCourses';
import ManageBlogs from '../pages/admin/ManageBlogs';
import ManageCategories from '../pages/admin/ManageCategories';
import StudioHeader from './StudioHeader';
import StudioPreview from './StudioPreview';
import { readStudioDocument } from './store';
import { STUDIO_FONTS } from './theme';
import { STUDIO_PAGES, type StudioElement, type StudioOverride, type StudioSection } from './types';
import { useStudioDocument } from './useStudioDocument';

function colorHex(value: string) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const rgb = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return rgb ? '#' + rgb.slice(1).map(channel => Number(channel).toString(16).padStart(2, '0')).join('') : '#000000';
}

export default function StudioPageEditor() {
  const { page = 'home' } = useParams();
  const [searchParams] = useSearchParams();
  const config = STUDIO_PAGES.find(item => item.id === page) || STUDIO_PAGES[0];
  const [path, setPath] = useState(config.path);
  const [tab, setTab] = useState('Page Sections');
  const [editorTab, setEditorTab] = useState('Content');
  const [sections, setSections] = useState<StudioSection[]>([]);
  const [selected, setSelected] = useState('');
  const [theme, setTheme] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [device, setDevice] = useState('Desktop');
  const [detailPages, setDetailPages] = useState<{ title: string; slug: string }[]>([]);
  const { value, edit, published, loading, saving, dirty, loadError, save } = useStudioDocument(path);

  useEffect(() => { setPath(config.path); setTab('Page Sections'); setSelected(''); setSections([]); }, [config.path]);
  useEffect(() => { setEditorTab(searchParams.get('tab') === 'design' ? 'Design' : 'Content'); }, [page, searchParams]);
  useEffect(() => { setSelected(''); setSections([]); }, [path]);
  useEffect(() => {
    let active = true;
    readStudioDocument('theme').then(document => { if (active) setTheme(document.theme); }).catch(() => {});
    if (['blogs', 'courses'].includes(page)) {
      supabase.from(page).select('title,slug').then(({ data }) => { if (active) setDetailPages(data || []); });
    } else setDetailPages([]);
    return () => { active = false; };
  }, [page]);

  const ordered = [...sections].sort((a, b) => (value.overrides[a.selector]?.order ?? sections.indexOf(a)) - (value.overrides[b.selector]?.order ?? sections.indexOf(b)));
  const activeSection = ordered.find(section => section.elements.some(element => element.selector === selected)) || ordered[0];
  const element = activeSection?.elements.find(item => item.selector === selected) || activeSection?.elements[0];
  const override = element ? value.overrides[element.selector] || {} : {};
  const styleScope = device === 'Mobile' ? 'mobileStyles' : device === 'Tablet' ? 'tabletStyles' : 'styles';
  const elementStyles = { ...override.styles, ...(device !== 'Desktop' ? override.tabletStyles : {}), ...(device === 'Mobile' ? override.mobileStyles : {}) };

  function update(selector: string, changes: StudioOverride) {
    edit(current => ({ ...current, overrides: { ...current.overrides, [selector]: { ...current.overrides[selector], ...changes } } }));
  }
  function style(property: string, setting: string) {
    const length = ['font-size', 'letter-spacing', 'border-radius', 'border-width', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'gap', 'max-width'];
    const normalized = length.includes(property) && /^-?\d+(\.\d+)?$/.test(setting) ? `${setting}px` : setting;
    if (element) update(element.selector, { [styleScope]: { ...override[styleScope], [property]: normalized } });
  }
  function reset() {
    if (!element) return;
    edit(current => {
      const overrides = { ...current.overrides };
      delete overrides[element.selector];
      return { ...current, overrides };
    });
  }
  function moveSection(index: number, offset: number) {
    const reordered = [...ordered];
    const [section] = reordered.splice(index, 1);
    reordered.splice(index + offset, 0, section);
    edit(current => ({ ...current, overrides: { ...current.overrides, ...Object.fromEntries(reordered.map((item, order) => [item.selector, { ...current.overrides[item.selector], order }])) } }));
  }
  async function upload(file: File | undefined) {
    if (!file || !element) return;
    setUploading(true);
    try {
      const asset = new File([file], `${crypto.randomUUID()}-${file.name}`, { type: file.type });
      update(element.selector, { src: await uploadImage(asset) });
      toast.success('Media uploaded. Publish to use it on your page.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setUploading(false); }
  }

  const library = page === 'projects' ? <ManageProjects /> : page === 'courses' ? <ManageCourses /> : page === 'blogs' ? <ManageBlogs /> : page === 'services' ? <div><h2>Service Library</h2><p className="studio-note">Select a service to edit its hero, capabilities, deliverables, process, FAQs, and closing CTA.</p><div className="studio-service-library">{Object.values(servicesData).map(service => <button key={service.slug} onClick={() => { setPath(`/services/${service.slug}`); setTab('Page Sections'); }}><img src={service.heroImage} alt="" /><span><small>{service.category}</small><strong>{service.heroHeading} {service.heroHighlight}</strong></span><ChevronRight size={18} /></button>)}</div></div> : null;
  const detailOptions = page === 'services' ? Object.values(servicesData).map(service => ({ title: `${service.heroHeading} ${service.heroHighlight}`, slug: service.slug })) : detailPages;

  return <div className="studio-page-editor">
    <StudioHeader title={config.name} description={`Edit the ${config.name.toLowerCase()} page content, sections, media, and design.`} path={path} dirty={dirty} saving={saving} disabled={loading || !!loadError || uploading} published={!!published.version && value.version === published.version} onSave={() => save(true)} onPublish={() => save(false)} />
    <div className="studio-page-tabs"><div>{['Page Sections', ...(library ? [page === 'blogs' ? 'Posts' : 'Library'] : []), 'Categories'].map(name => <button key={name} aria-pressed={tab === name} onClick={() => setTab(name)}>{name}</button>)}</div>{page === 'services' ? <button onClick={() => setTab('Library')}>Edit service details</button> : <Link to={config.library}>Advanced content editor <ChevronRight size={15} /></Link>}</div>
    {loadError && <p className="studio-error" role="alert">{loadError} Reload this page before saving.</p>}
    {tab === 'Categories' ? <div className="studio-legacy studio-panel"><ManageCategories /></div> : tab !== 'Page Sections' && library ? <div className="studio-legacy studio-panel">{library}</div> : <>
      <div className="studio-page-target"><label>Editing page <select value={path} onChange={event => setPath(event.target.value)}><option value={config.path}>{config.name} — {config.path}</option>{detailOptions.map(item => <option key={item.slug} value={`${config.path}/${item.slug}`}>{item.title}</option>)}</select></label><span>{loading ? 'Loading saved content…' : dirty ? 'Changes ready to preview' : value.updatedAt ? `Last saved ${new Date(value.updatedAt).toLocaleString()}` : 'Select a section to start editing'}</span></div>
      <div className="studio-editor-grid">
        <aside className="studio-panel studio-sections"><header><h3>Page Sections</h3><p>Reorder, show, hide, and edit.</p></header>{ordered.length === 0 ? <p className="studio-empty">Loading sections from your live page…</p> : <div className="studio-section-list">{ordered.map((section, index) => {
          const hidden = value.overrides[section.selector]?.styles?.display === 'none';
          return <div key={section.selector} className={`studio-section-item${section.selector === activeSection?.selector ? ' is-active' : ''}`}>
            <button className="studio-section-select" onClick={() => setSelected(section.selector)}><GripVertical size={15} /><span>{section.label}</span></button>
            <div className="studio-section-controls"><button aria-label={`${hidden ? 'Show' : 'Hide'} ${section.label}`} onClick={() => update(section.selector, { styles: { ...value.overrides[section.selector]?.styles, display: hidden ? section.elements[0].styles.display : 'none' } })}>{hidden ? <EyeOff size={15} /> : <Eye size={15} />}</button><button disabled={index === 0} aria-label={`Move ${section.label} up`} onClick={() => moveSection(index, -1)}><ArrowUp size={13} /></button><button disabled={index === ordered.length - 1} aria-label={`Move ${section.label} down`} onClick={() => moveSection(index, 1)}><ArrowDown size={13} /></button></div>
          </div>;
        })}</div>}</aside>

        <section className="studio-panel studio-editor-controls"><header><h2>{activeSection?.label || 'Page editor'}</h2></header><div className="studio-segmented">{['Content', 'Design', 'SEO'].map(name => <button key={name} aria-pressed={editorTab === name} onClick={() => setEditorTab(name)}>{name}</button>)}</div>
          {editorTab === 'SEO' ? <div className="studio-form"><label>Page title<input value={value.seo.title} placeholder="EternaVentures" onChange={event => edit({ ...value, seo: { ...value.seo, title: event.target.value } })} /></label><label>Meta description<textarea rows={5} value={value.seo.description} onChange={event => edit({ ...value, seo: { ...value.seo, description: event.target.value } })} /></label><p className="studio-note">The title and description are applied when you publish this page.</p></div> : <>
            <label className="studio-element-picker">Select element<select value={element?.selector || ''} onChange={event => setSelected(event.target.value)}>{activeSection?.elements.map(item => <option key={item.selector} value={item.selector}>{item.type === 'section' ? 'Section layout' : `${item.type} — ${item.label}`}</option>)}</select></label>
            {element && (editorTab === 'Content' ? <div className="studio-form">
              {element.type === 'field' && <label>Placeholder<input value={override.placeholder ?? element.placeholder ?? ''} onChange={event => update(element.selector, { placeholder: event.target.value })} /></label>}
              {element.type === 'section' ? <><p className="studio-note">Choose a heading, paragraph, button, or image to edit its content.</p><div className="studio-content-list">{activeSection.elements.slice(1).map(item => <button key={item.selector} onClick={() => setSelected(item.selector)}>{item.type === 'image' && <img src={value.overrides[item.selector]?.src || item.src} alt="" />}<span><small>{item.type}</small>{value.overrides[item.selector]?.text || item.label}</span><ChevronRight size={15} /></button>)}</div></> : element.library ? <><p className="studio-note">Edit this item in its content library to update its title, images, and details everywhere it appears.</p><Link className="studio-reset" to={element.library}>Open content library <ChevronRight size={15} /></Link></> : <>
                {!['image', 'video'].includes(element.type) && (element.text || typeof override.text === 'string') && <label>Text<textarea rows={element.type === 'heading' ? 3 : 5} value={override.text ?? element.text} onChange={event => update(element.selector, { text: event.target.value })} /></label>}
                {['image', 'video'].includes(element.type) && <><div className="studio-media-preview">{element.type === 'image' ? <img src={override.src ?? element.src} alt={override.alt ?? element.alt} /> : <video src={override.src ?? element.src} controls />}</div><label>Media URL<input value={override.src ?? element.src} onChange={event => update(element.selector, { src: event.target.value })} /></label><label className="studio-upload-button">{uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}Replace Media<input type="file" accept={element.type === 'video' ? 'video/*' : 'image/*'} disabled={uploading} onChange={event => upload(event.target.files?.[0])} /></label><label>Alt text<input value={override.alt ?? element.alt} onChange={event => update(element.selector, { alt: event.target.value })} /></label></>}
                {element.href && <label>Link URL<input value={override.href ?? element.href} onChange={event => update(element.selector, { href: event.target.value })} /></label>}
              </>}
            </div> : <div className="studio-form">
              <p className="studio-note">Editing {device.toLowerCase()} styles. Choose a device in the preview to set responsive styles.</p>
              <div className="studio-field-grid">{[['color', 'Text color'], ['background-color', 'Background'], ['border-color', 'Border color']].map(([property, label]) => { const setting = override.styles?.[property] ?? element.styles[property]; return <label key={property}>{label}<div className="studio-color-field"><input type="color" value={colorHex(setting)} onChange={event => style(property, event.target.value)} /><input value={setting} onChange={event => style(property, event.target.value)} /></div></label>; })}</div>
              <div className="studio-field-grid"><label>Font family<select value={override.styles?.['font-family'] ?? element.styles['font-family']} onChange={event => style('font-family', event.target.value)}><option value={element.styles['font-family']}>{element.styles['font-family']}</option>{STUDIO_FONTS.map(font => <option key={font} value={font}>{font}</option>)}</select></label><label>Weight<select value={override.styles?.['font-weight'] ?? element.styles['font-weight']} onChange={event => style('font-weight', event.target.value)}>{['400', '500', '600', '700', '800', '900'].map(weight => <option key={weight}>{weight}</option>)}</select></label></div>
              <div className="studio-field-grid">{[['font-size', 'Font size'], ['line-height', 'Line height'], ['letter-spacing', 'Letter spacing'], ['border-radius', 'Radius'], ['padding-top', 'Padding top'], ['padding-bottom', 'Padding bottom'], ['padding-left', 'Padding left'], ['padding-right', 'Padding right'], ['gap', 'Gap'], ['max-width', 'Max width']].map(([property, label]) => <label key={property}>{label}<input value={override.styles?.[property] ?? element.styles[property]} placeholder="24px" onChange={event => style(property, event.target.value)} /></label>)}</div>
              <label>Text alignment<select value={override.styles?.['text-align'] ?? element.styles['text-align']} onChange={event => style('text-align', event.target.value)}>{['left', 'center', 'right', 'start'].map(alignment => <option key={alignment}>{alignment}</option>)}</select></label>
              {element.type === 'image' && <div className="studio-field-grid"><label>Image fit<select value={override.styles?.['object-fit'] ?? element.styles['object-fit']} onChange={event => style('object-fit', event.target.value)}>{['cover', 'contain', 'fill', 'none'].map(fit => <option key={fit}>{fit}</option>)}</select></label><label>Image position<input value={override.styles?.['object-position'] ?? element.styles['object-position']} onChange={event => style('object-position', event.target.value)} /></label></div>}
            </div>)}
            {element && <button className="studio-reset" onClick={reset}><RotateCcw size={15} />Reset this element</button>}
          </>}
        </section>
        <StudioPreview path={path} document={value} theme={theme} selected={selected} onSnapshot={setSections} onSelect={setSelected} />
      </div>
    </>}
  </div>;
}
