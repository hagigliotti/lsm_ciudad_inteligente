// Revisa cada página HTML del sitio antes de publicar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const paginas = readdirSync(RAIZ).filter((f) => f.endsWith('.html'));

test('hay páginas para revisar', () => assert.ok(paginas.length >= 3));

for (const p of paginas) {
  const html = readFileSync(join(RAIZ, p), 'utf8');
  test(`${p}: idioma, título, viewport y CSP`, () => {
    assert.match(html, /<html lang="es/);
    assert.match(html, /<title>[^<]{5,}<\/title>/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /Content-Security-Policy[^>]+default-src 'self'/);
    assert.match(html, /object-src 'none'/);
  });
  test(`${p}: sin scripts ni estilos en línea (los bloquea la CSP)`, () => {
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i, 'script en línea');
    assert.doesNotMatch(html, /\son[a-z]+="/i, 'manejador onclick/onload en línea');
    assert.doesNotMatch(html, /\sstyle="/i, 'atributo style');
  });
  test(`${p}: imágenes con alt y enlaces internos que existen`, () => {
    for (const img of html.match(/<img\b[^>]*>/g) || []) assert.match(img, /\salt="/, img);
    for (const [, href] of html.matchAll(/(?:href|src)="([^"#:?]+)(?:#[^"]*)?"/g)) {
      if (href.startsWith('//') || href === './') continue;
      assert.ok(existsSync(join(RAIZ, href)), `${p} apunta a ${href}, que no existe`);
    }
  });
  test(`${p}: enlaces externos sin http inseguro`, () => {
    assert.doesNotMatch(html, /(href|src)="http:\/\//);
  });
  test(`${p}: aviso de uso de IA y enlace a privacidad`, () => {
    assert.match(html, /inteligencia artificial/i);
    assert.match(html, /privacidad\.html/);
  });
}

test('Google Analytics solo con consentimiento', () => {
  const app = readFileSync(join(RAIZ, 'assets/js/app.js'), 'utf8');
  assert.match(app, /decision === 'si'\) cargarAnalytics/);
  for (const p of paginas) assert.doesNotMatch(readFileSync(join(RAIZ, p), 'utf8'), /googletagmanager\.com\/gtag/, `${p} carga GA sin preguntar`);
});
