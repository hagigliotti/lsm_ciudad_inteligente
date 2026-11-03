import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { crearApp, hashClave, verificarClave, crearLimitador, crearSesiones, auditarRutas } from '../plataforma/servidor.mjs';

let servidor, base, registros = [];
const usuarios = new Map([['admin', { hash: hashClave('una-clave-larga-y-segura'), rol: 'admin' }], ['vecino', { hash: hashClave('otra-clave-larga-segura'), rol: 'vecino' }]]);

before(async () => {
  const app = crearApp({ usuarios, registrar: (e) => registros.push(e) });
  servidor = createServer(app.manejar);
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${servidor.address().port}`;
});
after(() => servidor.close());

// Servidor aparte para pruebas que no deben compartir los límites de envío.
async function aparte(fn) {
  const srv = createServer(crearApp({ usuarios }).manejar);
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const anterior = base; base = `http://127.0.0.1:${srv.address().port}`;
  try { await fn(); } finally { base = anterior; srv.close(); }
}

const pedir = (camino, { metodo = 'GET', cuerpo, cookie, origen, tipo = 'application/json' } = {}) =>
  fetch(base + camino, {
    method: metodo,
    headers: { ...(cuerpo !== undefined ? { 'Content-Type': tipo } : {}), ...(cookie ? { Cookie: cookie } : {}), ...(origen ? { Origin: origen } : {}) },
    body: cuerpo === undefined ? undefined : (typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo)),
  });
const cookieDe = (r) => (r.headers.get('set-cookie') || '').split(';')[0];

test('cabeceras de seguridad en todas las respuestas', async () => {
  const r = await pedir('/api/salud');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.match(r.headers.get('content-security-policy'), /default-src 'none'/);
  assert.ok(r.headers.get('strict-transport-security'));
});

test('valida entradas: rechaza datos malos con 400 y lista de campos', () => aparte(async () => {
  const r = await pedir('/api/ideas', { metodo: 'POST', cuerpo: { nombre: '<b>', email: 'x', tema: 'z', mensaje: 'no' } });
  assert.equal(r.status, 400);
  const j = await r.json();
  assert.ok(j.campos.includes('email'));
}));

test('rechaza JSON roto, tipo incorrecto y cuerpos gigantes', () => aparte(async () => {
  assert.equal((await pedir('/api/ideas', { metodo: 'POST', cuerpo: '{roto' })).status, 400);
  assert.equal((await pedir('/api/ideas', { metodo: 'POST', cuerpo: 'a=1', tipo: 'application/x-www-form-urlencoded' })).status, 415);
  assert.equal((await pedir('/api/ideas', { metodo: 'POST', cuerpo: { mensaje: 'a'.repeat(20000) } })).status, 413);
}));

test('rate limit estricto por IP en el formulario', async () => {
  const idea = { nombre: 'Ana', email: 'ana@ejemplo.com', tema: 'salud', mensaje: 'Botón de ayuda para los geriátricos de la ciudad.', acepta: true };
  const estados = [];
  for (let i = 0; i < 5; i++) estados.push((await pedir('/api/ideas', { metodo: 'POST', cuerpo: idea })).status);
  assert.ok(estados.includes(429), `esperaba 429 en ${estados}`);
  const r = await pedir('/api/ideas', { metodo: 'POST', cuerpo: idea });
  assert.ok(r.headers.get('retry-after'));
});

test('rutas protegidas exigen sesión y rol', async () => {
  assert.equal((await pedir('/api/ideas')).status, 401);
  const login = await pedir('/api/sesion', { metodo: 'POST', cuerpo: { usuario: 'vecino', clave: 'otra-clave-larga-segura' } });
  assert.equal(login.status, 200);
  assert.equal((await pedir('/api/ideas', { cookie: cookieDe(login) })).status, 403);
});

test('cookie de sesión segura y cierre de sesión que revoca', async () => {
  const login = await pedir('/api/sesion', { metodo: 'POST', cuerpo: { usuario: 'admin', clave: 'una-clave-larga-y-segura' } });
  const sc = login.headers.get('set-cookie');
  for (const p of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', '__Host-']) assert.ok(sc.includes(p), `falta ${p}`);
  const c = cookieDe(login);
  assert.equal((await pedir('/api/ideas', { cookie: c })).status, 200);
  assert.equal((await pedir('/api/sesion', { metodo: 'DELETE', cookie: c })).status, 200);
  assert.equal((await pedir('/api/ideas', { cookie: c })).status, 401, 'el token viejo ya no sirve');
});

test('un token inventado no suplanta a nadie', async () => {
  assert.equal((await pedir('/api/ideas', { cookie: '__Host-lsm=' + 'A'.repeat(43) })).status, 401);
});

test('login: mismo mensaje con usuario inexistente o clave mala, y bloqueo por intentos', async () => {
  const a = await (await pedir('/api/sesion', { metodo: 'POST', cuerpo: { usuario: 'nadie', clave: 'cualquier-cosa' } })).json();
  const b = await (await pedir('/api/sesion', { metodo: 'POST', cuerpo: { usuario: 'admin', clave: 'mala-mala-mala' } })).json();
  assert.equal(a.error, b.error);
  let ultimo;
  for (let i = 0; i < 6; i++) ultimo = (await pedir('/api/sesion', { metodo: 'POST', cuerpo: { usuario: 'admin', clave: 'mala-mala-mala' } })).status;
  assert.equal(ultimo, 429);
});

test('CORS: solo orígenes permitidos', async () => {
  const mala = await pedir('/api/salud', { origen: 'https://sitio-malo.example' });
  assert.equal(mala.status, 403);
  assert.equal(mala.headers.get('access-control-allow-origin'), null);
  const buena = await pedir('/api/salud', { origen: 'https://hagigliotti.github.io' });
  assert.equal(buena.headers.get('access-control-allow-origin'), 'https://hagigliotti.github.io');
  assert.notEqual(buena.headers.get('access-control-allow-origin'), '*');
});

test('errores: sin detalles técnicos al cliente, con id para rastrear', async () => {
  const r = await pedir('/api/no-existe');
  assert.equal(r.status, 404);
  const j = await r.json();
  assert.ok(j.id && !JSON.stringify(j).includes('at '), 'no expone stack');
  assert.equal((await pedir('/api/salud', { metodo: 'DELETE' })).status, 405);
  assert.ok(registros.every((e) => !JSON.stringify(e).includes('clave')), 'los registros no guardan contraseñas');
});

test('sesiones expiran por inactividad y por tiempo máximo', () => {
  let ahora = 0;
  const s = crearSesiones({ inactividadMs: 1000, maximaMs: 5000 }, () => ahora);
  const t = s.crear('admin');
  ahora = 900; assert.ok(s.obtener(t));
  ahora = 2000; assert.equal(s.obtener(t), null, 'inactividad');
  const t2 = s.crear('admin');
  for (ahora = 2000; ahora <= 7100; ahora += 800) s.obtener(t2);
  assert.equal(s.obtener(t2), null, 'máximo absoluto');
});

test('contraseñas con scrypt y comparación de tiempo constante', () => {
  const h = hashClave('secreta-123');
  assert.ok(h.startsWith('scrypt$'));
  assert.ok(verificarClave('secreta-123', h));
  assert.equal(verificarClave('otra', h), false);
  assert.equal(verificarClave('x', 'basura'), false);
});

test('limitador de fichas se recarga con el tiempo', () => {
  let ahora = 0;
  const l = crearLimitador({ capacidad: 2, porMinuto: 60 }, () => ahora);
  assert.ok(l('k').ok); assert.ok(l('k').ok); assert.equal(l('k').ok, false);
  ahora = 1000; assert.ok(l('k').ok);
});

test('auditoría: toda ruta pública está justificada y toda ruta con datos se valida', () => {
  const app = crearApp();
  for (const r of auditarRutas(app.RUTAS)) {
    assert.notEqual(r.validacion, 'NO', `${r.ruta} no valida entradas`);
    if (r.autenticacion === 'NO') assert.ok(!r.justificacion.startsWith('FALTA'), `${r.ruta} es pública sin justificar`);
  }
});
