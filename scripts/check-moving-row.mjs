import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const source = readFileSync(new URL('../src/components/MovingRow.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', compiled)(createRequire(import.meta.url), module, module.exports);
const { loopRepeatCount, default: MovingRow } = module.exports;
let cases = 0;
for (const viewport of [320, 390, 768, 1280, 1920, 2560, 3840]) {
  for (const sequence of [180, 360, 720, 1325, 1568, 3000]) {
    const group = loopRepeatCount(viewport, sequence) * sequence;
    assert.ok(group >= viewport, 'A group must fill the viewport');
    for (const progress of [0, .25, .5, .75, .999, 1]) {
      const offset = group * progress;
      assert.ok(2 * group - offset >= viewport, 'The duplicate must cover the visible tail');
      assert.ok(Math.abs(((offset + group) % group) - (offset % group)) < .001, 'The loop boundary must repeat the same position');
      cases++;
    }
  }
}
assert.equal(loopRepeatCount(1920, 0), 1);
const markup = renderToStaticMarkup(React.createElement(MovingRow, { label: 'Projects' },
  React.createElement('a', { href: '/projects', className: 'home-project-tile' }, 'Valia')));
assert.ok(!markup.includes('inert'), 'Duplicates must accept pointer hover and clicks');
assert.match(markup, /aria-hidden="true"/);
assert.match(markup, /<a[^>]*tabindex="-1"/, 'Duplicates must not add keyboard stops');
assert.equal((markup.match(/home-project-tile/g) || []).length, 2);
assert.equal((markup.match(/href="\/projects"/g) || []).length, 2);
console.log(`Passed ${cases} loop coverage cases and duplicate pointer/keyboard markup checks.`);
