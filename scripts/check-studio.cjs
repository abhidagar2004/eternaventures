// Uses a temporary linkedom installation, leaving application dependencies unchanged.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { parseHTML } = require(path.join(process.env.TEMP, 'eterna-studio-qa/node_modules/linkedom'));

function loadModule(file, imports, globals = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: name => {
    if (!(name in imports)) throw new Error(`Unexpected import ${name}`);
    return imports[name];
  }, console, setTimeout, clearTimeout, ...globals });
  return module.exports;
}

async function main() {
  const types = loadModule('src/studio/types.ts', {});
  const theme = loadModule('src/studio/theme.ts', {});
  assert.equal(theme.studioThemeCss({}), '');
  const themeCss = theme.studioThemeCss({ buttonRadius: '0', sectionPadding: '0', h1Mobile: '38' });
  assert.match(themeCss, /border-radius:0px/);
  assert.match(themeCss, /padding-top:0px/);
  assert.match(themeCss, /font-size:38px/);

  const database = new Map();
  const client = { auth: { getSession: async () => ({ data: { session: { user: { id: 'admin-test' } } } }) }, from: () => ({
    select: () => ({ eq: (_field, key) => ({ maybeSingle: async () => ({ data: database.get(key) || null }) }) }),
    upsert: async payload => { database.set(payload.setting_key, payload); return {}; },
    insert: async payload => {
      if (database.has(payload.setting_key)) return { error: { code: '23505' } };
      database.set(payload.setting_key, payload);
      return {};
    },
    update: payload => {
      const filters = {};
      const query = {
        eq(field, value) { filters[field] = value; return query; },
        async select() {
          const key = filters.setting_key;
          const current = database.get(key);
          if (current?.setting_value.version !== filters['setting_value->>version']) return { data: [] };
          database.set(key, { ...current, ...payload });
          return { data: [{ setting_key: key }] };
        },
      };
      return query;
    },
  }) };
  let version = 0;
  const browserDrafts = new Map();
  const store = loadModule('src/studio/store.ts', { '../lib/supabase': { supabase: client }, './types': types }, { crypto: { randomUUID: () => `version-${++version}` }, localStorage: { getItem: key => browserDrafts.get(key), setItem: (key, value) => browserDrafts.set(key, value), removeItem: key => browserDrafts.delete(key) } });
  const draft = types.emptyStudioDocument();
  draft.seo.title = 'Draft heading';
  await store.saveStudioDocument('/about', draft, true);
  assert.equal(database.size, 0);
  assert.equal((await store.readStudioDocument('/about', true)).seo.title, 'Draft heading');
  assert.equal((await store.readStudioDocument('/about')).version, '');
  const first = await store.saveStudioDocument('/about', draft, false);
  const next = await store.saveStudioDocument('/about', draft, false, first.version);
  await assert.rejects(store.saveStudioDocument('/about', draft, false, first.version), /another session/);
  assert.equal((await store.readStudioDocument('/about')).version, next.version);

  const { window, document } = parseHTML('<html><head><title>Original title</title></head><body><main class="flex-grow"><div class="about-studio-page"><section class="about-studio-hero"><h1 id="hero-title">WE BUILD <span>BRANDS.</span></h1><a class="about-link" href="/projects">Explore <svg><path /></svg></a><img src="/original.jpg" alt="Original artwork"><input placeholder="Your name" value="Private form input"></section><section class="about-stats"><h2>Results</h2></section></div></main></body></html>');
  const messages = [];
  const parent = { location: { pathname: '/admin/studio/about' }, postMessage: message => messages.push(message) };
  window.parent = parent;
  window.location = { origin: 'https://studio.example', search: '?studio-preview=1' };
  window.innerWidth = 1440;
  window.getComputedStyle = () => ({ getPropertyValue: property => property === 'display' ? 'block' : '' });
  let effect;
  let cleanup;
  const pending = [];
  const runtime = loadModule('src/studio/StudioRuntime.tsx', {
    react: { useEffect: callback => { effect = callback; } },
    'react-router-dom': { useLocation: () => ({ pathname: '/about' }) },
    './store': { readStudioDocument: () => new Promise(resolve => pending.push(resolve)) },
    './types': types,
    './theme': theme,
  }, { window, document, URL, URLSearchParams, Element: window.Element, Node: window.Node, MutationObserver: window.MutationObserver, getComputedStyle: window.getComputedStyle, CSS: { escape: value => value } });
  runtime.default();
  cleanup = effect();
  function send(data) {
    const event = new window.Event('message');
    Object.assign(event, { data, origin: window.location.origin, source: parent });
    window.dispatchEvent(event);
  }
  const preview = types.emptyStudioDocument();
  preview.overrides['#hero-title'] = { text: 'DRAFT TITLE ', styles: { 'font-size': '60px' }, mobileStyles: { 'font-size': '30px' } };
  preview.overrides['.about-link'] = { href: 'javascript:alert(1)' };
  preview.overrides['img'] = { src: '/replacement.jpg' };
  send({ type: 'eterna-studio-preview', document: preview, theme: {}, inspect: false });
  pending.forEach(resolve => resolve(types.emptyStudioDocument()));
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(document.querySelector('h1').textContent, 'DRAFT TITLE BRANDS.');
  assert.equal(document.querySelectorAll('h1 span').length, 1);
  assert.equal(document.querySelectorAll('a svg').length, 1);
  assert.equal(document.querySelector('a').getAttribute('href'), '/projects');
  assert.equal(document.querySelector('img').getAttribute('src'), '/replacement.jpg');
  window.innerWidth = 390;
  window.dispatchEvent(new window.Event('resize'));
  assert.equal(document.querySelector('h1').style.fontSize, '30px');
  const form = document.createElement('form');
  document.querySelector('section').append(form);
  const submit = new window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submit);
  assert.equal(submit.defaultPrevented, true);
  preview.overrides['.about-stats'] = { order: 0, styles: { display: 'none' } };
  preview.overrides['.about-studio-hero'] = { order: 1 };
  send({ type: 'eterna-studio-preview', document: preview, theme: {}, inspect: false });
  assert.equal(document.querySelector('.about-stats').style.display, 'none');
  assert.equal(document.querySelector('.about-studio-hero').style.order, '1');
  assert.equal(document.querySelector('.about-studio-page').style.display, 'flex');
  send({ type: 'eterna-studio-capture' });
  const snapshot = messages.find(message => message.type === 'eterna-studio-snapshot');
  assert.equal(snapshot.sections.length, 2);
  assert.ok(!JSON.stringify(snapshot).includes('Private form input'));
  send({ type: 'eterna-studio-preview', document: types.emptyStudioDocument(), theme: {}, inspect: false });
  assert.equal(document.querySelector('h1').textContent, 'WE BUILD BRANDS.');
  assert.equal(document.querySelector('img').getAttribute('src'), '/original.jpg');
  assert.equal(document.querySelector('.about-stats').style.display, '');
  assert.equal(document.querySelector('.about-studio-page').style.display, '');
  cleanup();
  assert.equal(document.title, 'Original title');
  console.log('Studio checks passed — draft isolation, publish conflicts, theme values, live overrides, responsive styles, markup preservation, private form values, and reset.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
