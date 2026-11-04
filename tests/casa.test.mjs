// Simulador, catálogo y configurador de la casa inteligente.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NIVELES, CATEGORIAS, EQUIPOS, TIPOS, ESCENAS, equiposDe, escenasDe, planificar, costo, equiposNivel, cobertura } from '../assets/js/casa-datos.js';

const IDS = new Set(EQUIPOS.map((q) => q.id));

test('catálogo: ids únicos, categoría y nivel válidos, precios coherentes', () => {
  assert.equal(IDS.size, EQUIPOS.length);
  for (const q of EQUIPOS) {
    assert.ok(CATEGORIAS[q.cat], `${q.id}: categoría`);
    assert.ok(NIVELES[q.n], `${q.id}: nivel`);
    assert.ok(q.p[0] > 0 && q.p[0] <= q.p[1] && q.c >= 1, `${q.id}: precio`);
    assert.ok(q.que && q.proto && q.ico, `${q.id}: descripción`);
  }
  assert.ok(EQUIPOS.length >= 50);
});

test('cada tipo de casa: salas existentes, equipos del catálogo y sin repetir', () => {
  const ubicados = new Set();
  for (const t of TIPOS) {
    const salas = new Set(t.salas.map((s) => s[0]));
    const vistos = new Set();
    for (const [sala, lista] of Object.entries(t.equipos)) {
      assert.ok(salas.has(sala), `${t.id}: sala ${sala}`);
      for (const id of lista) { assert.ok(IDS.has(id), `${t.id}: ${id}`); assert.ok(!vistos.has(id), `${t.id}: ${id} repetido`); vistos.add(id); ubicados.add(id); }
    }
    for (const [, , x, y, w, h] of t.salas) assert.ok(x >= 0 && y >= 0 && x + w <= 760 && y + h <= 470, `${t.id}: sala fuera del plano`);
  }
  for (const id of IDS) assert.ok(ubicados.has(id), `${id} no aparece en ningún plano`);
});

test('escenas: equipos válidos y escenas exclusivas solo en su tipo', () => {
  for (const e of ESCENAS) for (const p of e.pasos) assert.ok(p.dev === 'telefono' || IDS.has(p.dev), `${e.id}: ${p.dev}`);
  assert.ok(escenasDe('pileta').some((e) => e.id === 'pileta'));
  assert.ok(!escenasDe('depto').some((e) => e.id === 'pileta' || e.id === 'tanque'));
  assert.ok(ESCENAS.length >= 15);
});

test('niveles acumulativos: más nivel, más costo y más cobertura', () => {
  for (const t of TIPOS) {
    let antes = [0, 0]; let cob = -1;
    for (const n of [1, 2, 3, 4, 5]) {
      const ids = equiposNivel(n, t.id);
      const c = costo(ids);
      assert.ok(c[0] > antes[0] && c[1] > antes[1], `${t.id} nivel ${n}`);
      const k = cobertura(ids, t.id);
      assert.ok(k.cubiertos > cob, `${t.id} cobertura ${n}`);
      antes = c; cob = k.cubiertos;
    }
    const k = cobertura(equiposNivel(5, t.id), t.id);
    assert.equal(k.cubiertos, k.total, `${t.id}: nivel 5 cubre todo`);
  }
  assert.deepEqual(costo([]), [0, 0]);
});

test('los precios de la página simple salen de los datos', () => {
  const simple = readFileSync(new URL('../casa-simple.html', import.meta.url), 'utf8');
  const f = (v) => v.toLocaleString('es-AR');
  for (const n of [1, 2, 3, 4, 5]) { const [a, b] = costo(equiposNivel(n)); assert.match(simple, new RegExp(`USD ${f(a)} – ${f(b)}`), `nivel ${n}`); }
});

test('sin internet: lo local funciona, los mensajes esperan, la alerta oficial no llega', () => {
  const agua = planificar('agua', 5, false, 'casa');
  assert.ok(agua.find((p) => p.dev === 'valvula').ejecuta);
  const msg = agua.find((p) => p.dev === 'telefono');
  assert.ok(msg.enCola && msg.ejecuta);
  const t = planificar('tormenta', 5, false, 'casa').find((p) => p.dev === 'controlador');
  assert.ok(t.sinSenal && !t.ejecuta);
  assert.equal(planificar('agua', 1).find((p) => p.dev === 'valvula').incluido, false);
  assert.equal(planificar('llegar', 5, true, 'depto').find((p) => p.dev === 'porton').aplica, false);
  assert.ok(equiposDe('campo').has('starlink') && !equiposDe('depto').has('porton'));
  assert.throws(() => planificar('nada', 1));
});

test('cada efecto visual de las escenas existe', async () => {
  const { FX } = await import('../assets/js/casa-fx.js');
  for (const e of ESCENAS) for (const p of e.pasos) for (const f of p.fx || []) assert.ok(FX[f.split(':')[0]], `${e.id}: efecto ${f}`);
});
