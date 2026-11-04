// Plan Maestro (técnico) y versión simple.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (p) => readFileSync(join(RAIZ, p), 'utf8');

test('los documentos fuente están en docs/plan-maestro', () => {
  assert.ok(existsSync(join(RAIZ, 'docs/plan-maestro/LSM_Ciudad_Inteligente_Plan_Maestro_2027-2036.docx')));
  const md = leer('docs/plan-maestro/plan-director-v3.md');
  assert.match(md, /^# LIBERTADOR SAN MARTÍN, UNA CIUDAD INTELIGENTE 2026/);
  assert.doesNotMatch(md, /He generado el archivo/, 'quedó texto del chat en el documento');
});

test('el plan técnico tiene los 24 capítulos y los anexos, cada uno en el menú', () => {
  const html = leer('plan-maestro.html');
  const caps = [...html.matchAll(/<article class="cap" id="([^"]+)" data-cap>/g)].map((m) => m[1]);
  assert.equal(caps.length, 26, 'alcance + 24 capítulos + anexos');
  for (const id of caps) assert.match(html, new RegExp(`class="arch-menu"[\\s\\S]*href="#${id}"`), `${id} sin entrada en el menú`);
  assert.match(html, /AU915/, 'falta la corrección de banda LoRaWAN para Argentina');
});

test('las dos versiones se enlazan entre sí y desde el proyecto y la portada', () => {
  assert.match(leer('plan-maestro.html'), /href="en-simple\.html"/);
  assert.match(leer('en-simple.html'), /href="plan-maestro\.html"/);
  for (const p of ['index.html', 'proyecto-2026.html']) {
    assert.match(leer(p), /href="en-simple\.html"/, p);
    assert.match(leer(p), /href="plan-maestro\.html"/, p);
  }
});

test('la versión simple: cada ilustración tiene título o está oculta a lectores de pantalla', () => {
  const html = leer('en-simple.html');
  for (const svg of html.match(/<svg\b[^>]*>/g)) {
    assert.ok(/aria-hidden="true"/.test(svg) || /aria-labelledby="[^"]+"/.test(svg), svg);
  }
});

test('simulador de lluvia: niveles en orden y cubren 0 a 100 mm', async () => {
  globalThis.document = { querySelectorAll: () => [], querySelector: () => null };
  const { NIVELES, nivelPara } = await import('../assets/js/simple.js');
  delete globalThis.document;
  for (let i = 1; i < NIVELES.length; i++) assert.ok(NIVELES[i].desde > NIVELES[i - 1].desde);
  assert.equal(nivelPara(0), 0);
  assert.equal(nivelPara(25), 1);
  assert.equal(nivelPara(45), 2);
  assert.equal(nivelPara(100), NIVELES.length - 1);
});
