const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const router = require('react-router-dom');
function load(file, imports) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => name in imports ? imports[name] : require(name), console });
  return module.exports;
}
const shared = load('src/studio/sharedSettings.ts', {});
const oldNavbar = { logo: { type: 'text', text1: 'Saved brand', color2: '#123456' }, styling: { navbar_bg: 'bg-black/90', link_color: '#fefefe' }, links: [], buttons: [] };
const navbar = shared.mergeNavbar(oldNavbar);
assert.equal(navbar.logo.text1, 'Saved brand');
assert.equal(navbar.logo.color2, '#123456');
assert.equal(navbar.styling.link_hover_color, '#ffffff');
assert.equal(navbar.links.length, 0, 'An intentionally empty menu must stay empty');
assert.equal(navbar.buttons.length, 0);
assert.equal(navbar.mobile.position, 'right');
assert.equal(oldNavbar.logo.desktopSize, undefined, 'Merging must not mutate stored data');
assert.equal(shared.settingColor('bg-black/90'), 'rgba(0,0,0,0.9)');
assert.equal(shared.settingColor('bg-[#aabbcc]'), '#aabbcc');
assert.equal(shared.settingColor('text-white'), '#ffffff');
assert.equal(shared.settingColor('red;display:none'), '#000000');
for (const url of ['javascript:alert(1)', '//example.com', 'data:text/html,test']) assert.equal(shared.safeSettingHref(url), '/');
for (const url of ['/services', 'https://example.com/work', 'mailto:hello@example.com', 'tel:+919999999999']) assert.equal(shared.safeSettingHref(url), url);
const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
assert.equal(shared.moveSettingItem(items, 0, 2).map(item => item.id).join(','), '2,3,1');
assert.equal(items.map(item => item.id).join(','), '1,2,3');
assert.equal(shared.moveSettingItem(items, 0, -1), items);
const footer = shared.mergeFooter({ branding: { description: 'Existing description' }, columns: [], socials: [], cta: { active: false }, bottom_text: 'Saved copyright' });
assert.equal(footer.branding.description, 'Existing description');
assert.equal(footer.branding.color2, '#d4ff00');
assert.equal(footer.columns.length, 0);
assert.equal(footer.socials.length, 0);
assert.equal(footer.cta.active, false);
assert.equal(footer.bottom_text, 'Saved copyright');
const { FooterView } = load('src/components/Footer.tsx', { '../studio/sharedSettings': shared, '../lib/supabase': {}, './Footer.css': {} });
const preview = load('src/studio/NavigationPreview.tsx', { './sharedSettings': shared }).default;
const render = element => renderToStaticMarkup(React.createElement(router.MemoryRouter, null, element));
const footerConfig = shared.mergeFooter({ columns: [{ id: 'show', title: 'Shown', links: [{ id: 'one', label: 'Working link', href: '/about' }] }, { id: 'hide', title: 'Hidden column', visible: false, links: [] }], socials: [{ platform: 'instagram', active: false, url: 'https://instagram.com/' }], cta: { active: false }, cookies: { visible: false }, styling: { useGlobal: false, bg_color: '#224466', mobileBehavior: 'accordion', mobileColumns: 1, mobileAlign: 'center', mobileSocials: false } });
const footerHtml = render(React.createElement(FooterView, { config: footerConfig, previewMobile: true, preview: true }));
assert.ok(footerHtml.includes('Shown'));
assert.ok(footerHtml.includes('href="/about"'));
assert.ok(!footerHtml.includes('Hidden column'));
assert.ok(!footerHtml.includes('site-footer-cta'));
assert.ok(!footerHtml.includes('site-footer-cookies'));
assert.ok(!footerHtml.includes('https://instagram.com/'));
assert.ok(footerHtml.includes('--footer-bg:#224466'));
assert.ok(footerHtml.includes('data-mobile-behavior="accordion"'));
assert.ok(footerHtml.includes('footer-preview-mobile'));
const navConfig = shared.mergeNavbar({ links: [{ id: 'visible', name: 'Visible item', href: '/about' }, { id: 'hidden', name: 'Hidden item', href: '/services', visible: false }], buttons: [{ id: 'button', name: 'Visible CTA', href: '/contact', bgColor: '#fff', textColor: '#000' }, { id: 'hidden-button', name: 'Hidden CTA', href: '/', bgColor: '#fff', textColor: '#000', visible: false }] });
const navHtml = render(React.createElement(preview, { config: navConfig }));
assert.ok(navHtml.includes('Visible item'));
assert.ok(navHtml.includes('Visible CTA'));
assert.ok(!navHtml.includes('Hidden item'));
assert.ok(!navHtml.includes('Hidden CTA'));
const Navbar = load('src/components/Navbar.tsx', {
  react: { ...React, useState: initial => React.useState(typeof initial === 'function' ? navConfig : initial) },
  '../studio/sharedSettings': shared, '../lib/supabase': {}, './AuthPopup': { default: () => null }, './Navbar.css': {},
}).default;
const publicNavbar = render(React.createElement(Navbar));
assert.ok(publicNavbar.includes('Visible item'));
assert.ok(!publicNavbar.includes('Hidden item'));
assert.ok(!publicNavbar.includes('Hidden CTA'));
assert.ok(!publicNavbar.includes('Courses'), 'The public navbar must not restore removed menu links');
assert.ok(publicNavbar.includes('inert=""'), 'Closed mobile links must not remain keyboard focusable');
console.log('Shared settings checks passed — legacy configuration, intentional empty menus, visibility, safe links, ordering, and footer mobile/custom rendering.');

async function checkPersistence() {
  const states = [], refs = []; let cursor = 0, refCursor = 0, effect, initialized = false, loadResolve, saveResolve, savedPayload;
  const notifications = [];
  const controls = load('src/studio/SettingsControls.tsx', {
    react: {
      useState(initial) { const index = cursor++; if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial; return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }]; },
      useRef(initial) { const index = refCursor++; return refs[index] ||= { current: initial }; },
      useEffect(callback) { if (!initialized) { effect = callback; initialized = true; } },
    },
    '../lib/supabase': { supabase: { from(table) { assert.equal(table, 'site_settings'); return {
      select() { return this; }, eq(field, key) { assert.equal(field, 'setting_key'); assert.equal(key, 'navbar_config'); return this; },
      maybeSingle() { return new Promise(resolve => { loadResolve = resolve; }); },
      upsert(payload, options) { savedPayload = payload; assert.equal(options.onConflict, 'setting_key'); return new Promise(resolve => { saveResolve = resolve; }); },
    }; } } },
    'react-hot-toast': { default: { success: value => notifications.push(value), error: value => notifications.push(value) } },
    './sharedSettings': shared, './StudioSettings.css': {},
  });
  const rerender = () => { cursor = 0; refCursor = 0; return controls.useSharedSetting('navbar_config', shared.mergeNavbar); };
  let hook = rerender(); assert.equal(hook.loading, true); effect();
  loadResolve({ data: { setting_value: oldNavbar }, error: null });
  await new Promise(resolve => setImmediate(resolve));
  hook = rerender(); assert.equal(hook.loading, false); assert.equal(hook.config.logo.text1, 'Saved brand');
  hook.update({ ...hook.config, links: [{ id: 'a', name: 'Saved menu', href: '/about' }] }); hook = rerender(); assert.equal(hook.dirty, true);
  const firstSave = hook.save(); assert.equal(savedPayload.setting_key, 'navbar_config'); assert.equal(savedPayload.setting_value.links[0].name, 'Saved menu');
  hook.update({ ...hook.config, links: [] }); saveResolve({ error: null }); await firstSave; hook = rerender();
  assert.equal(hook.dirty, true, 'Edits made during save must remain unsaved');
  const secondSave = hook.save(); saveResolve({ error: null }); await secondSave; hook = rerender(); assert.equal(hook.dirty, false);
  hook.update({ ...hook.config, links: [{ id: 'b', name: 'Retry me', href: '/projects' }] }); hook = rerender();
  const failedSave = hook.save(); saveResolve({ error: new Error('Network unavailable') }); await failedSave; hook = rerender();
  assert.equal(hook.dirty, true); assert.equal(hook.config.links[0].name, 'Retry me'); assert.ok(notifications.includes('Network unavailable'));
  console.log('Persistence checks passed — saved settings load, exact setting key, changes during save, successful save status, and failed-save recovery.');
}
checkPersistence().catch(error => { console.error(error); process.exitCode = 1; });
