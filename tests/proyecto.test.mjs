import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PARTIDAS, AREAS, totales, CRONOGRAMA, LUGARES, CAPAS } from '../assets/js/proyecto-datos.js';

test('cada partida tiene área válida y rangos coherentes', () => {
  const ids = new Set();
  for (const p of PARTIDAS) {
    assert.ok(AREAS[p.area], `${p.id}: área desconocida`);
    assert.ok(!ids.has(p.id), `${p.id} repetido`); ids.add(p.id);
    for (const k of ['capex', 'opex']) {
      if (p[k] === null) continue;
      assert.equal(p[k].length, 2);
      assert.ok(p[k][0] >= 0 && p[k][0] <= p[k][1], `${p.id}.${k}: mínimo mayor que máximo`);
    }
  }
});

test('los totales suman las partidas más la gestión', () => {
  const t = totales();
  const min = PARTIDAS.reduce((s, p) => s + (p.capex ? p.capex[0] : 0), 0);
  assert.equal(t.base[0], min);
  assert.equal(t.capex[0], min + Math.round(min * 0.1));
  assert.equal(Object.values(t.porArea).reduce((s, v) => s + v[0], 0), min);
  assert.ok(t.capex[0] < t.capex[1]);
});

test('el cronograma está dentro de 2027–2031', () => {
  for (const c of CRONOGRAMA) assert.ok(c.t[0] >= 0 && c.t[1] <= 19 && c.t[0] <= c.t[1], c.nombre);
});

test('los lugares están dentro del ejido de Libertador San Martín', () => {
  for (const [k, l] of Object.entries(LUGARES)) {
    assert.ok(l.c[0] > -32.10 && l.c[0] < -32.04 && l.c[1] > -60.50 && l.c[1] < -60.42, `${k} fuera del área`);
  }
  for (const capa of Object.values(CAPAS)) for (const k of capa) assert.ok(LUGARES[k], `${k} no existe`);
});
