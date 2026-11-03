// Plataforma LSM · servidor de referencia (Node 20+, sin dependencias).
// Es el punto de partida para la futura API vecinal. Implementa, con pruebas:
//  - validación de todas las entradas            - rate limiting por IP y por usuario
//  - sesiones seguras (expiran, rotan, se revocan) - CORS con lista de orígenes permitidos
//  - errores sin detalles técnicos al cliente     - auditoría de rutas sin autenticación/validación
//
// En producción: detrás de HTTPS (proxy), con el almacén de sesiones y de límites en Redis
// para poder correr varias instancias (escalado horizontal).
import { createServer } from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'node:crypto';
import { validarIdea } from '../assets/js/validar.js';

export const AJUSTES = {
  origenes: (process.env.ORIGENES || 'https://hagigliotti.github.io').split(',').map((s) => s.trim()).filter(Boolean),
  sesion: { inactividadMs: 30 * 60_000, maximaMs: 8 * 3600_000 },
  limiteIP: { capacidad: 60, porMinuto: 60 },          // general
  limiteLogin: { capacidad: 5, porMinuto: 1 },         // 5 intentos y luego 1 por minuto
  limiteUsuario: { capacidad: 120, porMinuto: 120 },
  limiteIdeas: { capacidad: 3, porMinuto: 0.05 },      // ~3 por hora por IP
  cuerpoMaxBytes: 16 * 1024,
  confiarProxy: process.env.CONFIAR_PROXY === '1',
};

/* ---------------- Errores ---------------- */
export class ErrorHttp extends Error {
  constructor(estado, mensaje, extra = {}) { super(mensaje); this.estado = estado; this.extra = extra; }
}

/* ---------------- Rate limiting (cubeta de fichas) ---------------- */
export function crearLimitador({ capacidad, porMinuto }, reloj = Date.now) {
  const cubetas = new Map();
  return function consumir(clave) {
    const ahora = reloj();
    const c = cubetas.get(clave) || { fichas: capacidad, t: ahora };
    c.fichas = Math.min(capacidad, c.fichas + ((ahora - c.t) / 60_000) * porMinuto);
    c.t = ahora;
    if (c.fichas < 1) {
      cubetas.set(clave, c);
      const espera = porMinuto > 0 ? Math.ceil(((1 - c.fichas) / porMinuto) * 60) : 3600;
      return { ok: false, espera };
    }
    c.fichas -= 1;
    cubetas.set(clave, c);
    if (cubetas.size > 50_000) for (const k of cubetas.keys()) { cubetas.delete(k); if (cubetas.size < 40_000) break; }
    return { ok: true, espera: 0 };
  };
}

/* ---------------- Contraseñas y sesiones ---------------- */
export function hashClave(clave, sal = randomBytes(16)) {
  const h = scryptSync(String(clave), sal, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${sal.toString('base64')}$${h.toString('base64')}`;
}
export function verificarClave(clave, guardado) {
  const [, salB64, hB64] = String(guardado).split('$');
  if (!salB64 || !hB64) return false;
  const esperado = Buffer.from(hB64, 'base64');
  const obtenido = scryptSync(String(clave), Buffer.from(salB64, 'base64'), esperado.length, { N: 16384, r: 8, p: 1 });
  return timingSafeEqual(esperado, obtenido);
}

let ficticio = null;
const hashFicticio = () => (ficticio ||= hashClave(randomBytes(16).toString('hex')));

export function crearSesiones({ inactividadMs, maximaMs }, reloj = Date.now) {
  const sesiones = new Map();
  return {
    crear(usuario) {
      // Token opaco y aleatorio: no contiene datos, no se puede adivinar ni falsificar.
      const token = randomBytes(32).toString('base64url');
      const ahora = reloj();
      sesiones.set(token, { usuario, creada: ahora, usada: ahora });
      return token;
    },
    obtener(token) {
      if (typeof token !== 'string' || token.length !== 43) return null;
      const s = sesiones.get(token);
      if (!s) return null;
      const ahora = reloj();
      if (ahora - s.usada > inactividadMs || ahora - s.creada > maximaMs) { sesiones.delete(token); return null; }
      s.usada = ahora;
      return s;
    },
    revocar(token) { sesiones.delete(token); },
    revocarUsuario(usuario) { for (const [k, s] of sesiones) if (s.usuario === usuario) sesiones.delete(k); },
    get cantidad() { return sesiones.size; },
  };
}

const COOKIE = '__Host-lsm';
const cookieSesion = (token, maxAgeSeg) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeg}`;
function leerCookie(req) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([A-Za-z0-9_-]{43})(?:;|$)`));
  return m ? m[1] : null;
}

/* ---------------- Validadores de rutas ---------------- */
const validar = {
  idea: (cuerpo) => {
    const r = validarIdea({ ...cuerpo, acepta: cuerpo?.acepta === true });
    if (!r.ok) throw new ErrorHttp(400, 'Hay datos que corregir.', { campos: Object.keys(r.errores).filter((k) => k !== '_bot') });
    return r.datos;
  },
  login: (c) => {
    const usuario = typeof c?.usuario === 'string' ? c.usuario.trim().toLowerCase() : '';
    const clave = typeof c?.clave === 'string' ? c.clave : '';
    if (!/^[a-z0-9._-]{3,40}$/.test(usuario) || clave.length < 8 || clave.length > 200) throw new ErrorHttp(400, 'Usuario o contraseña con formato inválido.');
    return { usuario, clave };
  },
  id: (p) => {
    if (!/^[0-9a-f-]{36}$/.test(p.id || '')) throw new ErrorHttp(400, 'Identificador inválido.');
    return p.id;
  },
  nada: () => null,
};

/* ---------------- Aplicación ---------------- */
export function crearApp({ usuarios = new Map(), reloj = Date.now, registrar = () => {} } = {}) {
  const sesiones = crearSesiones(AJUSTES.sesion, reloj);
  const porIP = crearLimitador(AJUSTES.limiteIP, reloj);
  const login = crearLimitador(AJUSTES.limiteLogin, reloj);
  const porUsuario = crearLimitador(AJUSTES.limiteUsuario, reloj);
  const ideasIP = crearLimitador(AJUSTES.limiteIdeas, reloj);
  const ideas = new Map();

  // Declaración de rutas: cada una dice si exige sesión, qué rol y cómo se valida.
  const RUTAS = [
    { metodo: 'GET', ruta: '/api/salud', auth: false, validar: validar.nada, publica: 'chequeo de estado sin datos', manejar: () => ({ ok: true }) },
    { metodo: 'POST', ruta: '/api/ideas', auth: false, validar: validar.idea, limite: ideasIP, publica: 'formulario vecinal, con rate limit estricto',
      manejar: ({ datos }) => { const id = randomUUID(); ideas.set(id, { ...datos, creada: reloj() }); return { id }; } },
    { metodo: 'POST', ruta: '/api/sesion', auth: false, validar: validar.login, limite: login, publica: 'inicio de sesión, con rate limit estricto',
      manejar: ({ datos, res }) => {
        const u = usuarios.get(datos.usuario);
        // Misma respuesta y mismo costo de cálculo exista o no el usuario (no revela cuentas).
        const ok = verificarClave(datos.clave, u?.hash || hashFicticio());
        if (!u || !ok) throw new ErrorHttp(401, 'Usuario o contraseña incorrectos.');
        sesiones.revocarUsuario(datos.usuario); // una sesión activa por usuario; evita sesiones viejas olvidadas
        const token = sesiones.crear(datos.usuario);
        res.setHeader('Set-Cookie', cookieSesion(token, AJUSTES.sesion.maximaMs / 1000));
        return { usuario: datos.usuario, rol: u.rol };
      } },
    { metodo: 'DELETE', ruta: '/api/sesion', auth: true, validar: validar.nada,
      manejar: ({ token, res }) => { sesiones.revocar(token); res.setHeader('Set-Cookie', cookieSesion('', 0)); return { ok: true }; } },
    { metodo: 'GET', ruta: '/api/ideas', auth: true, rol: 'admin', validar: validar.nada,
      manejar: () => ({ ideas: [...ideas].map(([id, x]) => ({ id, tema: x.tema, barrio: x.barrio, mensaje: x.mensaje, creada: x.creada })) }) },
    { metodo: 'DELETE', ruta: '/api/ideas/:id', auth: true, rol: 'admin', validar: (_, p) => validar.id(p),
      manejar: ({ datos }) => { if (!ideas.delete(datos)) throw new ErrorHttp(404, 'No existe.'); return { borrada: datos }; } },
  ];

  function buscar(metodo, camino) {
    let otroMetodo = false;
    for (const r of RUTAS) {
      const partes = r.ruta.split('/'), reales = camino.split('/');
      if (partes.length !== reales.length) continue;
      const params = {};
      if (partes.every((p, i) => (p.startsWith(':') ? ((params[p.slice(1)] = decodeURIComponent(reales[i])), true) : p === reales[i]))) {
        if (r.metodo === metodo) return { r, params };
        otroMetodo = true;
      }
    }
    return otroMetodo ? { otroMetodo } : null;
  }

  function cabecerasSeguridad(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Cache-Control', 'no-store');
  }

  // CORS: solo los orígenes de la lista. Nunca "*" con credenciales.
  function cors(req, res) {
    const origen = req.headers.origin;
    if (!origen) return true; // misma web o cliente sin navegador
    if (!AJUSTES.origenes.includes(origen)) return false;
    res.setHeader('Access-Control-Allow-Origin', origen);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600');
    return true;
  }

  function ipDe(req) {
    if (AJUSTES.confiarProxy) {
      const xff = String(req.headers['x-forwarded-for'] || '').split(',').pop().trim();
      if (xff) return xff;
    }
    return req.socket.remoteAddress || 'desconocida';
  }

  async function leerCuerpo(req) {
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return null;
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw new ErrorHttp(415, 'Se espera JSON.');
    let largo = 0; const trozos = [];
    for await (const t of req) {
      largo += t.length;
      if (largo > AJUSTES.cuerpoMaxBytes) throw new ErrorHttp(413, 'El envío es demasiado grande.');
      trozos.push(t);
    }
    try { return JSON.parse(Buffer.concat(trozos).toString('utf8') || '{}'); } catch { throw new ErrorHttp(400, 'JSON inválido.'); }
  }

  function enviar(res, estado, cuerpo, extra = {}) {
    if (res.headersSent) return;
    res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8', ...extra });
    res.end(JSON.stringify(cuerpo));
  }

  async function manejar(req, res) {
    const idSolicitud = randomUUID();
    cabecerasSeguridad(res);
    res.setHeader('X-Request-Id', idSolicitud);
    try {
      if (!cors(req, res)) throw new ErrorHttp(403, 'Origen no permitido.');
      if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
      const ip = ipDe(req);
      const g = porIP(`ip:${ip}`);
      if (!g.ok) throw new ErrorHttp(429, 'Demasiadas solicitudes. Probá en un momento.', { espera: g.espera });

      const url = new URL(req.url, 'http://local');
      const encontrada = buscar(req.method, url.pathname.replace(/\/+$/, '') || '/');
      if (!encontrada) throw new ErrorHttp(404, 'No existe.');
      if (encontrada.otroMetodo) throw new ErrorHttp(405, 'Método no permitido.');
      const { r, params } = encontrada;

      if (r.limite) {
        const l = r.limite(`${r.ruta}:${ip}`);
        if (!l.ok) throw new ErrorHttp(429, 'Demasiados intentos. Probá más tarde.', { espera: l.espera });
      }

      let token = null, sesion = null;
      if (r.auth) {
        token = leerCookie(req);
        sesion = sesiones.obtener(token);
        if (!sesion) throw new ErrorHttp(401, 'Tenés que iniciar sesión.');
        const u = porUsuario(`u:${sesion.usuario}`);
        if (!u.ok) throw new ErrorHttp(429, 'Demasiadas solicitudes. Probá en un momento.', { espera: u.espera });
        if (r.rol && usuarios.get(sesion.usuario)?.rol !== r.rol) throw new ErrorHttp(403, 'No tenés permiso.');
      }

      const cuerpo = await leerCuerpo(req);
      const datos = r.validar(cuerpo, params);
      const resultado = await r.manejar({ datos, req, res, token, sesion });
      enviar(res, 200, resultado);
    } catch (err) {
      const conocido = err instanceof ErrorHttp;
      const estado = conocido ? err.estado : 500;
      // Al registro: id, ruta, estado y tipo de error. Nunca contraseñas, cuerpos ni cookies.
      registrar({ id: idSolicitud, metodo: req.method, ruta: (req.url || '').split('?')[0], estado, error: conocido ? err.message : err?.name || 'Error' });
      const extra = conocido && err.extra.espera ? { 'Retry-After': String(err.extra.espera) } : {};
      const cuerpo = { error: conocido ? err.message : 'Ocurrió un error inesperado. Ya quedó registrado.', id: idSolicitud };
      if (conocido && err.extra.campos) cuerpo.campos = err.extra.campos;
      enviar(res, estado, cuerpo, extra);
    }
  }

  return { manejar, RUTAS, sesiones };
}

// Auditoría: lista las rutas sin autenticación o sin validación, para revisarlas a mano.
export function auditarRutas(rutas) {
  return rutas.map((r) => ({
    ruta: `${r.metodo} ${r.ruta}`,
    autenticacion: r.auth ? (r.rol ? `sí (rol ${r.rol})` : 'sí') : 'NO',
    validacion: r.validar && r.validar !== validar.nada ? 'sí' : (['GET', 'DELETE'].includes(r.metodo) && !r.ruta.includes(':') ? 'no recibe datos' : 'NO'),
    rateLimit: r.limite ? 'estricto' : 'general',
    justificacion: r.auth ? '' : (r.publica || 'FALTA JUSTIFICAR: ¿por qué es pública?'),
  }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const usuarios = new Map();
  if (process.env.ADMIN_USUARIO && process.env.ADMIN_HASH) usuarios.set(process.env.ADMIN_USUARIO, { hash: process.env.ADMIN_HASH, rol: 'admin' });
  const app = crearApp({ usuarios, registrar: (e) => console.log(JSON.stringify(e)) });
  if (process.argv.includes('--auditar')) { console.table(auditarRutas(app.RUTAS)); process.exit(0); }
  const puerto = Number(process.env.PUERTO || 8080);
  createServer(app.manejar).listen(puerto, () => console.log(`Plataforma LSM escuchando en :${puerto}`));
}
