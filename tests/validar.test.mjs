import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarIdea, puedeEnviar, limpiar, escaparHTML } from '../assets/js/validar.js';

const buena = { nombre: 'María José Núñez', email: 'maria@ejemplo.com.ar', barrio: 'Puiggari', tema: 'ambiente', mensaje: 'Sensores de lluvia en la calle que se inunda siempre.', acepta: true, trampa: '' };

test('una idea correcta pasa', () => {
  const r = validarIdea(buena);
  assert.equal(r.ok, true, JSON.stringify(r.errores));
});

test('rechaza campos vacíos, demasiado largos o con formato raro', () => {
  assert.ok(validarIdea({ ...buena, nombre: '' }).errores.nombre);
  assert.ok(validarIdea({ ...buena, nombre: '<script>alert(1)</script>' }).errores.nombre);
  assert.ok(validarIdea({ ...buena, nombre: 'x'.repeat(81) }).errores.nombre);
  assert.ok(validarIdea({ ...buena, email: 'no-es-email' }).errores.email);
  assert.ok(validarIdea({ ...buena, email: 'a@b' }).errores.email);
  assert.ok(validarIdea({ ...buena, tema: 'drop table' }).errores.tema);
  assert.ok(validarIdea({ ...buena, mensaje: 'corto' }).errores.mensaje);
  assert.ok(validarIdea({ ...buena, mensaje: 'a'.repeat(2001) }).errores.mensaje);
  assert.ok(validarIdea({ ...buena, acepta: false }).errores.acepta);
});

test('bloquea spam: muchos enlaces y campo trampa', () => {
  assert.ok(validarIdea({ ...buena, mensaje: 'mirá http://a.com http://b.com http://c.com ahora mismo' }).errores.mensaje);
  assert.ok(validarIdea({ ...buena, trampa: 'soy un bot' }).errores._bot);
});

test('acepta tipos incorrectos sin romperse', () => {
  const r = validarIdea({ nombre: 42, email: null, mensaje: { a: 1 }, tema: ['x'] });
  assert.equal(r.ok, false);
  assert.equal(validarIdea(undefined).ok, false);
});

test('limpia caracteres de control y de dirección de texto', () => {
  assert.equal(limpiar('Hola\u0000‮ mundo  \t  '), 'Hola mundo');
  assert.equal(limpiar(undefined), '');
});

test('escapa HTML', () => {
  assert.equal(escaparHTML('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
});

test('límite de envíos por navegador', () => {
  const ahora = 10_000_000;
  assert.equal(puedeEnviar([], ahora).ok, true);
  assert.equal(puedeEnviar([ahora - 10_000], ahora).ok, false, 'espera mínima entre envíos');
  assert.equal(puedeEnviar([ahora - 3000_000, ahora - 2000_000, ahora - 1000_000], ahora).ok, false, 'máximo por hora');
  assert.equal(puedeEnviar([ahora - 4000_000, ahora - 3700_000, ahora - 3650_000], ahora).ok, true, 'los viejos ya no cuentan');
  assert.equal(puedeEnviar('basura', ahora).ok, true);
});
