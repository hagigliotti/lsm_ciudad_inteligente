// El menú principal es igual en todas las páginas (lo genera scripts/menu.py).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const paginas = readdirSync(RAIZ).filter((f) => f.endsWith('.html'));
const menuDe = (html) => (html.match(/<!-- menu:inicio -->([\s\S]*?)<!-- menu:fin -->/) || [])[1];
const sinActual = (m) => m.replace(/ aria-current="page"/g, '').replace(/ menu__grupo--activo/g, '');

const ESPERADAS = ['ciudad-hoy.html', 'archivo-2009.html', 'fallas-2009.html', 'en-simple.html', 'plan-maestro.html',
  'proyecto-2026.html', 'barrio-simple.html', 'barrio-tecnico.html', 'casa-simple.html', 'casa-tecnico.html',
  'datos-personales.html', 'seguridad.html', 'escalas.html', 'la-lomada.html'];

test('todas las páginas del menú existen', () => {
  for (const p of ESPERADAS) assert.ok(existsSync(join(RAIZ, p)), p);
});

test('cada página tiene el mismo menú y pie (correr scripts/menu.py si falla)', () => {
  const base = sinActual(menuDe(readFileSync(join(RAIZ, 'index.html'), 'utf8')));
  for (const p of paginas) {
    const html = readFileSync(join(RAIZ, p), 'utf8');
    const menu = menuDe(html);
    assert.ok(menu, `${p} no tiene menú`);
    assert.equal(sinActual(menu), base, `${p} tiene un menú distinto`);
    assert.match(html, /<!-- pie:inicio -->[\s\S]*<!-- pie:fin -->/, `${p} no tiene pie`);
    for (const e of ESPERADAS) assert.match(menu, new RegExp(`href="${e}"`), `${p}: falta ${e} en el menú`);
  }
});

test('el menú marca la página actual', () => {
  for (const p of ESPERADAS) {
    const menu = menuDe(readFileSync(join(RAIZ, p), 'utf8'));
    assert.match(menu, new RegExp(`href="${p}" aria-current="page"`), p);
    assert.equal((menu.match(/aria-current="page"/g) || []).length, 1, p);
  }
});

test('menú accesible: botón con aria-expanded y nav con nombre', () => {
  const menu = menuDe(readFileSync(join(RAIZ, 'index.html'), 'utf8'));
  assert.match(menu, /<button[^>]*aria-expanded="false"[^>]*aria-controls="menu-principal"/);
  assert.match(menu, /<nav[^>]*aria-label="Menú principal"/);
});
