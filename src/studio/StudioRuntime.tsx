import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { readStudioDocument } from './store';
import { emptyStudioDocument, type StudioDocument, type StudioElement, type StudioSection } from './types';
import { studioThemeCss } from './theme';

const styleProperties = ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'border-radius', 'border-width', 'border-color', 'border-style', 'object-fit', 'object-position', 'gap', 'display', 'max-width', 'min-height', 'height'];
const directText = (element: Element) => Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
const safeUrl = (value: string) => /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(value);

function selectorFor(element: Element): string {
  if (element.id) return `#${CSS.escape(element.id)}`;
  const key = element.getAttribute('data-studio-key');
  if (key) return `[data-studio-key="${CSS.escape(key)}"]`;
  const parent = element.parentElement;
  if (!parent || element === document.body) return 'body';
  const className = Array.from(element.classList).find(name => /^(home|academy|practice|project|about|contact|service|insights)-/.test(name));
  let part = className ? `.${CSS.escape(className)}` : element.tagName.toLowerCase();
  if (className && document.querySelectorAll(part).length === 1) return part;
  const siblings = Array.from(parent.children).filter(child => child.matches(part));
  if (siblings.length > 1) part += `:nth-child(${Array.from(parent.children).indexOf(element) + 1})`;
  return `${selectorFor(parent)} > ${part}`;
}

function captureSections(overrides: Record<string, unknown> = {}): StudioSection[] {
  const main = document.querySelector('main.flex-grow');
  if (!main) return [];
  const home = main.querySelector('.home-reference');
  const sections = home ? Array.from(home.children).filter(child => child.hasAttribute('data-studio-key') && child.childElementCount > 0) : Array.from(main.querySelectorAll('section, dialog[open]')).filter(section => !section.parentElement?.closest('section,dialog'));
  if (!sections.length && main.firstElementChild) sections.push(main.firstElementChild);
  return sections.map((section, index) => {
    const selector = selectorFor(section);
    const title = section.querySelector('h1,h2,h3')?.textContent?.trim().replace(/\s+/g, ' ');
    const styles = getComputedStyle(section);
    const sectionElement: StudioElement = { selector, section: selector, label: 'Section', type: 'section', text: '', src: '', href: '', alt: '', styles: Object.fromEntries(styleProperties.map(property => [property, styles.getPropertyValue(property)])) };
    const elements = Array.from(section.querySelectorAll('h1,h2,h3,h4,p,a,button,span,strong,small,label,li,img,video,input:not([type="hidden"]),textarea')).filter(element => {
      if (element.closest('[aria-hidden="true"]') || element.closest('svg')) return false;
      return element.matches('img,video,a,input,textarea') || directText(element).length > 0 || selectorFor(element) in overrides;
    }).map(element => {
      const text = directText(element).map(node => node.textContent?.trim()).join(' ');
      const type: StudioElement['type'] = element.matches('img') ? 'image' : element.matches('video') ? 'video' : element.matches('input,textarea') ? 'field' : element.matches('h1,h2,h3,h4') ? 'heading' : element.matches('a,button') ? 'link' : 'text';
      const computed = getComputedStyle(element);
      return {
        selector: selectorFor(element), section: selector, label: (element.getAttribute('alt') || text || element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.getAttribute('name') || type).slice(0, 70), type, text,
        src: element.getAttribute('src') || '', href: element.getAttribute('href') || '', alt: element.getAttribute('alt') || '', placeholder: element.getAttribute('placeholder') || '',
        library: element.closest('[data-studio-library]')?.getAttribute('data-studio-library') || undefined,
        styles: Object.fromEntries(styleProperties.map(property => [property, computed.getPropertyValue(property)])),
      };
    });
    const homeLabels: Record<string, string> = { hero: 'Hero', marquee: 'Ticker', philosophy: 'Growth Manifesto', services: 'Featured Services', marquee_logos: 'Client Logos', method: 'Method', who_we_serve: 'Industries', work: 'Selected Work', testimonials: 'Testimonials', blogs: 'Latest Blogs', cta: 'Final CTA' };
    const homeLabel = homeLabels[section.getAttribute('data-studio-key') || ''];
    return { selector, label: section.tagName === 'DIALOG' ? 'Project popup' : homeLabel || (index === 0 ? 'Hero' : title?.slice(0, 48) || `Section ${index + 1}`), elements: [sectionElement, ...elements] };
  });
}

export default function StudioRuntime() {
  const { pathname } = useLocation();
  useEffect(() => {
    let active = true;
    let documentValue = emptyStudioDocument();
    let theme: Record<string, string> = {};
    let inspect = false;
    let selected = '';
    let preview = false;
    let receivedPreview = false;
    try { preview = window.parent !== window && window.parent.location.pathname.startsWith('/admin') && new URLSearchParams(window.location.search).has('studio-preview'); } catch { /* Cross-origin frames receive published content only. */ }
    const originals = new Map<Element, { text?: { node: ChildNode; value: string }[]; attributes: Record<string, string | null>; styles: Record<string, string> }>();
    const style = document.createElement('style');
    style.dataset.studioTheme = 'true';
    document.head.append(style);
    const originalTitle = document.title;
    const originalMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const originalDescription = originalMeta?.content || '';
    let createdMeta: HTMLMetaElement | null = null;
    let timer = 0;

    function apply() {
      style.textContent = studioThemeCss(theme);
      for (const [selector, override] of Object.entries(documentValue.overrides)) {
        let element: HTMLElement | null;
        try { element = document.querySelector<HTMLElement>(selector); } catch { continue; }
        if (!element) continue;
        if (!originals.has(element)) originals.set(element, { attributes: {}, styles: {} });
        const original = originals.get(element)!;
        if (typeof override.text === 'string') {
          const nodes = directText(element);
          if (!original.text) original.text = nodes.map(node => ({ node, value: node.textContent || '' }));
          // Keep highlight spans, icons, and other nested markup intact.
          if (nodes.length && nodes.map(node => node.textContent).join('') !== override.text) {
            if (!('white-space' in original.styles)) original.styles['white-space'] = element.style.whiteSpace;
            element.style.whiteSpace = 'pre-line';
            const breaks = Array.from(element.children).filter(child => child.tagName === 'BR') as HTMLElement[];
            breaks.forEach((lineBreak, index) => {
              if (index === breaks.length - 1 && lineBreak.nextElementSibling?.tagName !== 'BR' && lineBreak.nextElementSibling) return;
              if (!originals.has(lineBreak)) originals.set(lineBreak, { attributes: {}, styles: { display: lineBreak.style.display } });
              lineBreak.style.display = 'none';
            });
            nodes[0].textContent = override.text;
            nodes.slice(1).forEach(node => { node.textContent = ''; });
          }
        }
        for (const property of ['src', 'href', 'alt', 'placeholder'] as const) {
          const value = override[property];
          if (typeof value !== 'string' || (['src', 'href'].includes(property) && !safeUrl(value))) continue;
          if (!(property in original.attributes)) original.attributes[property] = element.getAttribute(property);
          if (element.getAttribute(property) !== value) element.setAttribute(property, value);
          if (property === 'src' && element.closest('[data-studio-crop="reference"]') && value !== original.attributes.src) {
            const imageStyles = { width: '100%', height: '100%', 'max-width': '100%', transform: 'none', 'object-fit': 'cover' };
            Object.entries(imageStyles).forEach(([name, setting]) => {
              if (!(name in original.styles)) original.styles[name] = element.style.getPropertyValue(name);
              element.style.setProperty(name, setting);
            });
          }
        }
        const responsiveStyles = { ...override.styles, ...(window.innerWidth <= 1000 ? override.tabletStyles : {}), ...(window.innerWidth <= 600 ? override.mobileStyles : {}) };
        for (const [property, value] of Object.entries(responsiveStyles)) {
          if (!styleProperties.includes(property)) continue;
          if (!(property in original.styles)) original.styles[property] = element.style.getPropertyValue(property);
          if (element.style.getPropertyValue(property) !== value) element.style.setProperty(property, value, 'important');
        }
        if (typeof override.order === 'number') {
          const root = document.querySelector('main.flex-grow')?.firstElementChild as HTMLElement | null;
          if (root && root !== element && root.contains(element)) {
            let branch = element;
            while (branch.parentElement && branch.parentElement !== root) branch = branch.parentElement;
            for (const target of [root, branch]) if (!originals.has(target)) originals.set(target, { attributes: {}, styles: {} });
            const rootStyles = originals.get(root)!.styles;
            const branchStyles = originals.get(branch)!.styles;
            if (!('display' in rootStyles)) rootStyles.display = root.style.display;
            if (!('flex-direction' in rootStyles)) rootStyles['flex-direction'] = root.style.flexDirection;
            if (!('order' in branchStyles)) branchStyles.order = branch.style.order;
            root.style.display = 'flex';
            root.style.flexDirection = 'column';
            branch.style.order = String(override.order);
          }
        }
      }
      if (documentValue.seo.title) document.title = documentValue.seo.title;
      if (documentValue.seo.description) {
        const meta = originalMeta || createdMeta || document.createElement('meta');
        meta.name = 'description';
        meta.content = documentValue.seo.description;
        if (!meta.isConnected) { document.head.append(meta); createdMeta = meta; }
      }
      if (preview && selected) {
        document.querySelectorAll('[data-studio-selected]').forEach(element => element.removeAttribute('data-studio-selected'));
        try { document.querySelector(selected)?.setAttribute('data-studio-selected', 'true'); } catch { /* A deleted item has no selection. */ }
      }
    }

    function restore() {
      originals.forEach((original, element) => {
        if (original.text) {
          original.text.forEach(({ node, value }) => { if (node.parentNode === element) node.textContent = value; });
        }
        Object.entries(original.attributes).forEach(([name, value]) => { if (value === null) element.removeAttribute(name); else element.setAttribute(name, value); });
        Object.entries(original.styles).forEach(([name, value]) => { (element as HTMLElement).style.setProperty(name, value); });
      });
      originals.clear();
      document.title = originalTitle;
      if (originalMeta) originalMeta.content = originalDescription;
      createdMeta?.remove();
      createdMeta = null;
    }

    function snapshot() {
      if (preview) window.parent.postMessage({ type: 'eterna-studio-snapshot', path: pathname, sections: captureSections(documentValue.overrides) }, window.location.origin);
    }
    function resize() { restore(); apply(); snapshot(); }
    function receive(event: MessageEvent) {
      if (!preview || event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === 'eterna-studio-preview') {
        receivedPreview = true;
        restore();
        documentValue = event.data.document || emptyStudioDocument();
        theme = event.data.theme || theme;
        inspect = Boolean(event.data.inspect);
        selected = event.data.selected || '';
        apply();
      }
      if (event.data?.type === 'eterna-studio-capture') snapshot();
      if (event.data?.type === 'eterna-studio-scroll' && typeof event.data.selector === 'string') {
        try { document.querySelector(event.data.selector)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch { /* Selection may have been removed by a library edit. */ }
      }
    }
    function click(event: MouseEvent) {
      if (!preview || !(event.target instanceof Element)) return;
      if (!inspect) {
        const link = event.target.closest('a');
        const href = link?.getAttribute('href');
        if (href && !href.startsWith('#')) {
          const destination = new URL(href, window.location.origin);
          if (destination.pathname !== pathname || destination.origin !== window.location.origin) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
        return;
      }
      const sections = captureSections(documentValue.overrides);
      let target: Element | null = event.target;
      while (target && target !== document.body) {
        const selector = selectorFor(target);
        if (sections.some(section => section.elements.some(element => element.selector === selector))) {
          event.preventDefault();
          event.stopPropagation();
          window.parent.postMessage({ type: 'eterna-studio-select', selector }, window.location.origin);
          break;
        }
        target = target.parentElement;
      }
    }
    function submit(event: Event) {
      if (!preview) return;
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage({ type: 'eterna-studio-preview-submit' }, window.location.origin);
    }
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (active) { apply(); snapshot(); } }, 250);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['src', 'href', 'alt'] });
    window.addEventListener('message', receive);
    document.addEventListener('click', click, true);
    document.addEventListener('submit', submit, true);
    window.addEventListener('resize', resize);
    if (preview) {
      const selectionStyle = document.createElement('style');
      selectionStyle.textContent = '[data-studio-selected] { outline:2px dashed #b9e300 !important; outline-offset:4px; }';
      style.after(selectionStyle);
      style.dataset.selectionStyle = '';
      selectionStyle.dataset.studioSelection = 'true';
    }
    Promise.allSettled([readStudioDocument(pathname), readStudioDocument('theme')]).then(results => {
      if (!active) return;
      if (!receivedPreview && results[0].status === 'fulfilled') documentValue = results[0].value;
      if (!receivedPreview && results[1].status === 'fulfilled') theme = results[1].value.theme;
      apply();
      snapshot();
    });
    return () => {
      active = false;
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener('message', receive);
      document.removeEventListener('click', click, true);
      document.removeEventListener('submit', submit, true);
      window.removeEventListener('resize', resize);
      restore();
      style.remove();
      document.querySelector('[data-studio-selection]')?.remove();
    };
  }, [pathname]);
  return null;
}
