// Simulador y configurador de la casa inteligente.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EQUIPOS, ESCENAS, planificar, costo, equiposNivel, cobertura } from '../assets/js/casa-datos.js';

const html = readFileSync(new URL('../casa-simulador.html', import.meta.url), 'utf8');

test('cada equipo de las escenas está en el plano y en el catálogo', () => {
  const ids = new Set(EQUIPOS.map((q) => q.id));
  for (const e of ESCENAS) for (const p of e.pasos) {
    if (p.dev === 'telefono') continue;
    assert.ok(ids.has(p.dev), `${e.id}: ${p.dev} no está en EQUIPOS`);
    assert.match(html, new RegExp(`data-dev="${p.dev}"`), `${p.dev} no está en el plano`);
  }
});

test('precios coherentes y niveles acumulativos', () => {
  for (const q of EQUIPOS) assert.ok(q.precio[0] > 0 && q.precio[0] <= q.precio[1] && q.cant >= 1, q.id);
  const [a, b, c] = [1, 2, 3].map((n) => costo(equiposNivel(n)));
  assert.ok(a[0] < b[0] && b[0] < c[0] && a[1] < b[1] && b[1] < c[1]);
  assert.deepEqual(costo([]), [0, 0]);
});

test('los precios de la página simple salen de los datos', () => {
  const simple = readFileSync(new URL('../casa-simple.html', import.meta.url), 'utf8');
  const f = (v) => v.toLocaleString('es-AR');
  const [lo] = costo(equiposNivel(1)); const [, hi] = costo(equiposNivel(1));
  assert.match(simple, new RegExp(`USD ${f(lo)} – ${f(hi)}`));
});

test('el nivel completo hace todas las acciones; el básico, menos', () => {
  assert.equal(cobertura(equiposNivel(3)).cubiertos, cobertura(equiposNivel(3)).total);
  assert.ok(cobertura(equiposNivel(1)).cubiertos < cobertura(equiposNivel(2)).cubiertos);
});

test('sin internet: lo local se ejecuta, los avisos esperan y la alerta oficial no llega', () => {
  const agua = planificar('agua', 3, false);
  assert.ok(agua.find((p) => p.dev === 'valvula').ejecuta);
  const aviso = agua.find((p) => p.dev === 'telefono');
  assert.ok(aviso.enCola && aviso.ejecuta);
  const t = planificar('tormenta', 3, false).find((p) => p.dev === 'controlador');
  assert.ok(t.sinSenal && !t.ejecuta);
  assert.ok(planificar('agua', 1).find((p) => p.dev === 'valvula').incluido === false);
  assert.throws(() => planificar('nada', 1));
});
