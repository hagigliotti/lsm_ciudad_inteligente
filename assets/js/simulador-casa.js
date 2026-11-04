// Simulador, catálogo y configurador de la casa inteligente. Todo ocurre en el navegador.
import { NIVELES, CATEGORIAS, EQUIPOS, TIPOS, ESCENAS, tipo, equiposDe, escenasDe, planificar, costo, equiposNivel, cobertura, SALAS_LUZ } from './casa-datos.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}, texto) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (texto != null) e.textContent = texto; return e; };
const crear = (tag, clase, texto) => { const e = document.createElement(tag); if (clase) e.className = clase; if (texto != null) e.textContent = texto; return e; };
const usd = (v) => `USD ${v.toLocaleString('es-AR')}`;
const rango = ([a, b]) => (a === b ? usd(a) : `${usd(a)} – ${b.toLocaleString('es-AR')}`);
const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* sin almacenamiento */ } };
const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } };
const EQ = Object.fromEntries(EQUIPOS.map((q) => [q.id, q]));
const ESTADOS = ['alerta', 'on', 'off', 'cerrado', 'ok'];
const CORTO = { hub: 'Puente', humo: 'Humo', co: 'Monóxido', agua: 'Agua', puerta: 'Puerta', enchufe: 'Enchufes', controlador: 'Controlador', luces: 'Luces', cortinas: 'Cortinas', presencia: 'Presencia', movimiento: 'Movimiento', temp: 'Temperatura', clima: 'Aire', luzamb: 'Luz natural', escena: 'Escenas', comedero: 'Comedero', medidor: 'Tablero', caudal: 'Medidor agua', tanque: 'Tanque', riego: 'Riego', suelo: 'Suelo', co2: 'Aire CO₂', ventana: 'Ventanas', reflector: 'Reflector', bebedero: 'Bebedero', heladera: 'Heladera', vibracion: 'Vibración', buzon: 'Buzón', lluvia: 'Estación', garrafa: 'Garrafa', humedadpared: 'Humedad', cerradura: 'Cerradura', camara: 'Cámara', timbre: 'Timbre', sirena: 'Alarma', vidrio: 'Vidrios', gas: 'Sensor gas', valvula: 'Válvula', porton: 'Portón', puertamascota: 'Gatera', ups: 'UPS', solar: 'Paneles', bateria: 'Batería', ev: 'Cargador', aspiradora: 'Aspiradora', cortacesped: 'Cortacésped', boton: 'Ayuda', caida: 'Caídas', cama: 'Cama', collar: 'Collar GPS', voz: 'Voz', pileta: 'Pileta', bomba: 'Bomba', starlink: 'Satélite', interruptores: 'Interruptores', miniswitch: 'Mini switch', aproximacion: 'Aproximación', pantalla: 'Pantalla', ventilador: 'Ventilador', multipresencia: 'Multipresencia', llavesconsumo: 'Llaves kWh', termosifon: 'Termosifón', lavarropas: 'Lavarropas', lavavajillas: 'Lavavajillas', ledcontorno: 'LED contorno', mirilla: 'Mirilla', valvulagas: 'Válvula gas' };
const HORA = { agua: '10:12', humo: '20:41', gas: '20:15', monoxido: '03:40', salir: '08:15', llegar: '18:47', despertar: '07:00', noche: '19:58', vacaciones: '09:30', tormenta: '16:20', corte: '21:10', calor: '15:02', mayor: '10:00', mascota: '13:00', visita: '11:34', intruso: '03:12', sol: '12:30', pileta: '17:45', tanque: '06:40' };

const estado = { tipo: leer('lsm-casa-tipo', 'casa'), nivel: leer('lsm-casa-nivel5', 3), internet: true, estilo: leer('lsm-casa-chat', 'wa'), escena: null };
if (!TIPOS.some((t) => t.id === estado.tipo)) estado.tipo = 'casa';

$('[data-cuenta-equipos]') && ($('[data-cuenta-equipos]').textContent = `${EQUIPOS.length} equipos`);
$('[data-cuenta-escenas]') && ($('[data-cuenta-escenas]').textContent = `${ESCENAS.length} situaciones`);

/* ---------- Plano ---------- */
const plano = $('[data-plano]');
const grupo = (cls, ...hijos) => { const g = svg('g', cls ? { class: cls } : {}); g.append(...hijos); return g; };

// Auto visto desde arriba: carrocería, parabrisas, luneta, techo, ruedas y faros.
function auto(x, y, color = 'p-auto') {
  return grupo('p-auto-g',
    svg('rect', { class: 'p-rueda', x: x + 8, y: y - 3, width: 12, height: 6, rx: 2 }), svg('rect', { class: 'p-rueda', x: x + 44, y: y - 3, width: 12, height: 6, rx: 2 }),
    svg('rect', { class: 'p-rueda', x: x + 8, y: y + 31, width: 12, height: 6, rx: 2 }), svg('rect', { class: 'p-rueda', x: x + 44, y: y + 31, width: 12, height: 6, rx: 2 }),
    svg('rect', { class: color, x, y, width: 64, height: 34, rx: 11 }),
    svg('path', { class: 'p-auto__vidrio', d: `M${x + 40} ${y + 5} q8 12 0 24 h-4 v-24z` }),
    svg('path', { class: 'p-auto__vidrio', d: `M${x + 14} ${y + 6} q-5 11 0 22 h3 v-22z` }),
    svg('rect', { class: 'p-auto__techo', x: x + 20, y: y + 6, width: 18, height: 22, rx: 4 }),
    svg('rect', { class: 'p-faro', x: x + 59, y: y + 4, width: 4, height: 6, rx: 1 }), svg('rect', { class: 'p-faro', x: x + 59, y: y + 24, width: 4, height: 6, rx: 1 }));
}

// Perro de costado, sentado.
function perro(x, y, k = 1) {
  const g = svg('g', { transform: `translate(${x} ${y}) scale(${k})`, class: 'p-perro' });
  g.append(svg('path', { class: 'p-perro__cola', d: 'M-14 6 C-24 2 -24 -8 -20 -14' }),
    svg('path', { class: 'p-perro__cuerpo', d: 'M-16 14 C-17 2 -13 -6 -4 -10 C2 -12 10 -10 12 -4 C14 2 14 10 13 14Z' }),
    svg('rect', { class: 'p-perro__pata', x: -6, y: 6, width: 5, height: 9, rx: 2 }), svg('rect', { class: 'p-perro__pata', x: 4, y: 6, width: 5, height: 9, rx: 2 }),
    svg('circle', { class: 'p-perro__cuerpo', cx: 8, cy: -16, r: 9 }),
    svg('path', { class: 'p-perro__cuerpo', d: 'M14 -19 C21 -20 26 -17 26 -13 C26 -9 21 -8 16 -9Z' }),
    svg('path', { class: 'p-perro__oreja', d: 'M2 -22 C-2 -21 -3 -13 -1 -7 C3 -9 5 -14 5 -19Z' }),
    svg('circle', { class: 'p-negro', cx: 26, cy: -14, r: 2 }), svg('circle', { class: 'p-negro', cx: 11, cy: -18, r: 1.6 }),
    svg('path', { class: 'p-perro__collar', d: 'M1 -9 Q8 -5 15 -9' }));
  return g;
}

function arbol(x, y, r) {
  return grupo('', svg('circle', { class: 'p-sombra', cx: x + r * 0.25, cy: y + r * 0.3, r }), svg('circle', { class: 'p-arbol', cx: x, cy: y, r }),
    svg('circle', { class: 'p-arbol2', cx: x - r * 0.35, cy: y - r * 0.3, r: r * 0.55 }), svg('circle', { class: 'p-arbol3', cx: x + r * 0.3, cy: y + r * 0.15, r: r * 0.35 }));
}

function huerta(x, y, w, h) {
  const g = grupo('p-huerta-g', svg('rect', { class: 'p-tierra', x, y, width: w, height: h, rx: 6 }));
  const filas = Math.max(2, Math.floor(h / 16));
  for (let f = 0; f < filas; f++) for (let c = 0; c < Math.floor((w - 8) / 14); c++) {
    g.append(svg('circle', { class: (c + f) % 3 ? 'p-planta' : 'p-planta2', cx: x + 10 + c * 14, cy: y + 9 + f * ((h - 14) / (filas - 1 || 1)), r: 4.5 }));
  }
  g.append(svg('text', { class: 'p-cartel', x: x + w / 2, y: y + h + 12 }, 'Huerta'));
  return g;
}

// Muebles livianos en la parte de abajo de cada ambiente, detrás de los equipos.
function muebles(id, x, y, w, h) {
  const bx = x + w / 2; const by = y + h - 14;
  const r = (cls, a, b, c, d, rx = 3) => svg('rect', { class: cls, x: a, y: b, width: c, height: d, rx });
  const tipoSala = id.replace(/\d+$/, '');
  if (tipoSala === 'living') return grupo('p-mueble', r('p-mue', bx - 50, by - 24, 100, 22, 8), r('p-mue2', bx - 46, by - 20, 30, 14, 4), r('p-mue2', bx - 14, by - 20, 30, 14, 4), r('p-mue2', bx + 18, by - 20, 28, 14, 4), r('p-mue', bx - 18, by - 50, 36, 16, 4));
  if (tipoSala === 'cocina') return grupo('p-mueble', r('p-mue', x + 8, by - 12, w - 16, 14, 2), ...[0, 1, 2, 3].map((i) => svg('circle', { class: 'p-hornalla', cx: x + w - 52 + (i % 2) * 14, cy: by - 8 + Math.floor(i / 2) * 7 - 3, r: 3.5 })), r('p-mue2', x + 16, by - 9, 20, 8, 2));
  if (tipoSala === 'dorm') return grupo('p-mueble', r('p-mue', bx - 30, by - 42, 60, 44, 6), r('p-mue2', bx - 26, by - 38, 24, 10, 3), r('p-mue2', bx + 2, by - 38, 24, 10, 3), r('p-manta', bx - 30, by - 22, 60, 24, 4));
  if (tipoSala === 'bano') return grupo('p-mueble', svg('ellipse', { class: 'p-mue', cx: x + 22, cy: by - 8, rx: 9, ry: 12 }), r('p-ducha', x + w - 40, by - 30, 32, 32, 4));
  if (tipoSala === 'lavadero') return grupo('p-mueble', r('p-mue', x + w - 34, by - 24, 26, 26, 4), svg('circle', { class: 'p-tambor', cx: x + w - 21, cy: by - 11, r: 8 }));
  if (tipoSala === 'estudio') return grupo('p-mueble', r('p-mue', bx - 36, by - 18, 72, 18, 3), r('p-pantallita', bx - 12, by - 16, 24, 10, 2), svg('circle', { class: 'p-mue2', cx: bx, cy: by + 4, r: 7 }));
  if (tipoSala === 'quincho') return grupo('p-mueble', r('p-mue', x + 8, y + h - 30, 38, 22, 3), r('p-parrilla', x + 12, y + h - 26, 30, 14, 2));
  if (tipoSala === 'galpon') return grupo('p-mueble', r('p-mue', x + 8, y + h - 34, 50, 26, 4), svg('circle', { class: 'p-rueda', cx: x + 18, cy: y + h - 8, r: 7 }), svg('circle', { class: 'p-rueda', cx: x + 48, cy: y + h - 8, r: 9 }));
  return null;
}

function dibujarDeco(g, d) {
  if (d.k === 'calle' || d.k === 'camino') {
    g.append(svg('rect', { class: d.k === 'calle' ? 'p-vereda' : 'p-banquina', x: 0, y: 470, width: 760, height: 22 }));
    if (d.k === 'calle') for (let i = 0; i < 760; i += 38) g.append(svg('path', { class: 'p-baldosa', d: `M${i} 470 v22` }));
    g.append(svg('rect', { class: d.k === 'calle' ? 'p-calle' : 'p-camino', x: 0, y: 492, width: 760, height: 68 }));
    if (d.k === 'calle') { g.append(svg('path', { class: 'p-linea', d: 'M10 526 H750' })); g.append(auto(560, 500, 'p-auto p-auto--2')); g.append(auto(250, 522, 'p-auto p-auto--3')); }
    else { g.append(svg('path', { class: 'p-huella', d: 'M0 512 H760 M0 540 H760' })); g.append(auto(420, 509, 'p-auto p-auto--2')); }
    g.append(svg('text', { class: 'p-calle__txt', x: 20, y: 548 }, d.k === 'calle' ? 'Calle' : 'Camino rural'));
  } else if (d.k === 'arbol') g.append(arbol(d.x, d.y, d.r));
  else if (d.k === 'auto') g.append(auto(d.x, d.y));
  else if (d.k === 'cucha') {
    g.append(svg('path', { class: 'p-cucha__techo', d: `M${d.x - 20} ${d.y - 2} L${d.x} ${d.y - 20} L${d.x + 20} ${d.y - 2}Z` }), svg('rect', { class: 'p-cucha', x: d.x - 16, y: d.y - 4, width: 32, height: 24, rx: 2 }),
      svg('path', { class: 'p-negro', d: `M${d.x - 6} ${d.y + 20} v-9 a6 6 0 0 1 12 0 v9z` }));
    g.append(perro(d.x - 36, d.y + 6, 0.8));
  } else if (d.k === 'porton') g.append(svg('path', { class: 'p-porton', d: `M${d.x} ${d.y} H${d.x + d.w}` }));
  else if (d.k === 'agua') {
    g.append(svg('rect', { class: 'p-pileta__borde', x: d.x - 5, y: d.y - 5, width: d.w + 10, height: d.h + 10, rx: 14 }), svg('rect', { class: 'p-pileta', x: d.x, y: d.y, width: d.w, height: d.h, rx: 12 }));
    g.append(svg('path', { class: 'p-ola', d: `M${d.x + 8} ${d.y + d.h * 0.35} h${d.w - 16} M${d.x + 8} ${d.y + d.h * 0.65} h${d.w - 16}` }));
  } else if (d.k === 'tanqueAlto') {
    g.append(svg('path', { class: 'p-torre', d: `M${d.x - 16} ${d.y - 6} L${d.x - 22} ${d.y + 60} M${d.x + 16} ${d.y - 6} L${d.x + 22} ${d.y + 60} M${d.x - 19} ${d.y + 26} H${d.x + 19} M${d.x - 18} ${d.y + 26} L${d.x + 20} ${d.y + 58}` }));
    g.append(svg('rect', { class: 'p-tanque', x: d.x - 22, y: d.y - 40, width: 44, height: 36, rx: 8 }), svg('path', { class: 'p-tanque__aro', d: `M${d.x - 22} ${d.y - 28} H${d.x + 22} M${d.x - 22} ${d.y - 16} H${d.x + 22}` }));
  } else if (d.k === 'macetas') {
    [0, 34, 68].forEach((dx) => { g.append(svg('rect', { class: 'p-maceta', x: d.x + dx, y: d.y, width: 24, height: 20, rx: 4 })); g.append(arbol(d.x + dx + 12, d.y - 6, 12)); });
  } else if (d.k === 'huerta') g.append(huerta(d.x, d.y, d.w, d.h));
  else if (d.k === 'perro') g.append(perro(d.x, d.y, d.s || 1));
  else if (d.k === 'flores') { for (let i = 0; i < d.n; i++) g.append(svg('circle', { class: i % 2 ? 'p-flor' : 'p-flor2', cx: d.x + i * 12, cy: d.y + (i % 2) * 5, r: 4 })); }
}

// Ubica los equipos de cada ambiente en una grilla; si no entran, achica los íconos.
function posiciones(t) {
  const pos = {};
  for (const [salaId, lista] of Object.entries(t.equipos)) {
    const [, , x, y, w, h] = t.salas.find((v) => v[0] === salaId);
    let paso = 54; let cols = 1;
    for (const s of [54, 50, 46, 42, 38, 34, 30, 26]) {
      paso = s; cols = Math.max(1, Math.floor((w - 6) / s));
      const filas = Math.ceil(lista.length / cols);
      if (24 + filas * s * 0.96 <= h) break;
    }
    const k = paso / 54;
    const x0 = x + (w - cols * paso) / 2 + paso / 2;
    const y0 = y + 24 + paso * 0.42;
    lista.forEach((id, i) => { pos[id] = [x0 + (i % cols) * paso, y0 + Math.floor(i / cols) * paso * 0.96, k]; });
  }
  return pos;
}

function dibujarPlano() {
  const t = tipo(estado.tipo);
  const titulo = plano.querySelector('title');
  plano.replaceChildren(titulo);
  titulo.textContent = `Plano de ${t.nombre.toLowerCase()}: ${t.salas.map((s) => s[1]).join(', ')}, con sus equipos inteligentes`;
  plano.append(svg('rect', { class: t.id === 'depto' ? 'p-edificio' : t.id === 'campo' ? 'p-campo' : 'p-lote', x: 10, y: 10, width: 740, height: 460, rx: 8 }));
  const deco = svg('g');
  t.deco.filter((d) => d.k === 'calle' || d.k === 'camino').forEach((d) => dibujarDeco(deco, d));
  plano.append(deco);
  for (const [id, nombre, x, y, w, h, tp] of t.salas) {
    plano.append(svg('rect', { class: `p-sala p-sala--${tp}`, x, y, width: w, height: h }));
    if (tp === 'in') plano.append(svg('rect', { class: 'plano__luz', 'data-sala': id, x, y, width: w, height: h }));
  }
  const pos = posiciones(t);
  const fondoUsado = {};
  for (const [id, [, py, k]] of Object.entries(pos)) { const sala = Object.keys(t.equipos).find((sl) => t.equipos[sl].includes(id)); fondoUsado[sala] = Math.max(fondoUsado[sala] || 0, py + 32 * k); }
  for (const [id, , x, y, w, h, tp] of t.salas) {
    if (!(tp === 'in' || id === 'quincho' || id === 'galpon')) continue;
    if (y + h - (fondoUsado[id] || y + 30) < 40) continue; // sin lugar libre, no se dibujan muebles
    const m = muebles(id, x, y, w, h); if (m) plano.append(m);
  }
  const interiores = t.salas.filter((v) => v[6] === 'in');
  const minX = Math.min(...interiores.map((v) => v[2])), minY = Math.min(...interiores.map((v) => v[3]));
  const maxX = Math.max(...interiores.map((v) => v[2] + v[4])), maxY = Math.max(...interiores.map((v) => v[3] + v[5]));
  plano.append(svg('rect', { class: 'p-contorno', 'data-led': '', x: minX - 6, y: minY - 6, width: maxX - minX + 12, height: maxY - minY + 12, rx: 6 }));
  for (const [, , x, y, w, h, tp] of t.salas) if (tp === 'in') plano.append(svg('rect', { class: 'p-muro', x, y, width: w, height: h }));
  const deco2 = svg('g');
  t.deco.filter((d) => d.k !== 'calle' && d.k !== 'camino').forEach((d) => dibujarDeco(deco2, d));
  plano.append(deco2);
  for (const [, nombre, x, y] of t.salas) plano.append(svg('text', { class: 'plano__sala', x: x + 10, y: y + 20 }, nombre));
  for (const [id, [x, y, k]] of Object.entries(pos)) {
    const q = EQ[id];
    const g = svg('g', { class: k < 0.8 ? 'dev dev--chico' : 'dev', 'data-dev': id, transform: `translate(${x} ${y}) scale(${k})`, tabindex: 0, role: 'button', 'aria-label': `${q.nombre}: ${q.que}` });
    g.append(svg('circle', { r: 16 }), svg('text', { class: 'dev__ico', y: 6 }, q.ico), svg('text', { class: 'dev__nom', y: 30 }, CORTO[id] || q.nombre));
    g.addEventListener('click', () => info(id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); info(id); } });
    plano.append(g);
  }
  pintarNivel();
  pintarMia();
}

function pintarNivel() {
  const incl = new Set(equiposNivel(estado.nivel, estado.tipo));
  $$('.dev', plano).forEach((g) => g.classList.toggle('dev--fuera', !incl.has(g.dataset.dev)));
}

function info(id) {
  const q = EQ[id];
  const caja = $('[data-info]');
  caja.replaceChildren(crear('b', null, `${q.ico} ${q.nombre}`), crear('span', null, q.que),
    crear('small', null, `Nivel ${q.n} · ${NIVELES[q.n].nombre} · ${CATEGORIAS[q.cat]} · ${q.proto} · ${rango(q.p)} c/u${q.c > 1 ? ` (típico: ${q.c})` : ''}`));
  $$('.dev', plano).forEach((g) => g.classList.toggle('dev--elegido', g.dataset.dev === id));
}

/* ---------- Celular ---------- */
const cel = $('[data-celular]');
const chat = $('[data-chat]');
const resp = $('[data-resp]');
let horaActual = '9:41';

function burbuja(texto, quien = 'casa', extra = '') {
  $('.chat__vacio', chat)?.remove();
  const b = crear('div', `burbuja burbuja--${quien} ${extra}`.trim());
  b.append(crear('span', 'burbuja__txt', texto));
  const meta = crear('span', 'burbuja__meta', extra.includes('cola') ? '🕓 al volver internet' : horaActual);
  if (quien === 'yo') meta.textContent = `${horaActual} ✓✓`;
  b.append(meta);
  chat.append(b);
  chat.scrollTop = chat.scrollHeight;
}

function respuestas(lista) {
  resp.replaceChildren(...(lista || []).map((r) => {
    const b = crear('button', 'chip-resp', r);
    b.type = 'button';
    b.addEventListener('click', () => { resp.replaceChildren(); burbuja(r, 'yo'); setTimeout(() => burbuja(contestar(r)), quieto() ? 0 : 700); });
    return b;
  }));
}

function contestar(r) {
  const tiene = (id) => equiposNivel(estado.nivel, estado.tipo).includes(id);
  if (!estado.internet) return '🕓 Sin internet: tu respuesta se envía cuando vuelva la conexión.';
  if (/cerrar el gas/i.test(r)) return tiene('valvulagas') ? '✅ Cerré la válvula de gas de la casa. Ventilá antes de volver a encender.' : 'No hay válvula de gas en tu nivel: cerrá la llave de paso a mano.';
  if (/gasista/i.test(r)) return '📞 Te paso el contacto del gasista matriculado.';
  if (/cerrar la llave/i.test(r)) return tiene('valvula') ? '✅ Listo, cerré la llave de paso de toda la casa.' : 'No tengo válvula de corte en tu nivel: cerrá la llave a mano. Está en la entrada de agua.';
  if (/cámara/i.test(r)) return tiene('camara') ? '📷 Te mando la imagen en vivo de la cámara (grabada en casa, no en la nube).' : 'Todavía no hay cámara en tu nivel.';
  if (/abrir una vez/i.test(r)) return tiene('cerradura') ? '🔐 Abrí la puerta. El código de un solo uso vence a las 18 h.' : 'No hay cerradura inteligente en tu nivel.';
  if (/hablar/i.test(r)) return '🎙 Conectado con el timbre: ya podés hablar.';
  if (/persianas/i.test(r)) return tiene('cortinas') ? '✅ Bajé todas las persianas.' : 'No hay cortinas motorizadas en tu nivel.';
  if (/24 °C/.test(r)) return '❄️ Listo, aire del living a 24 °C.';
  if (/llamar al|llamar a/i.test(r)) return '📞 Abriendo el teléfono para llamar… (en el simulador no se llama a nadie).';
  if (/llamarla|vecina/i.test(r)) return '📞 Te paso con ella. Si no atiende, aviso a la vecina de confianza.';
  if (/ubicación/i.test(r)) return '🗺️ Toby está a 120 m, en la calle de enfrente.';
  if (/pedir garrafa/i.test(r)) return '🛒 Te dejo el contacto del distribuidor. No hago pedidos solo.';
  if (/si llueve/i.test(r)) return '👍 Te aviso si el pronóstico marca lluvia.';
  return '👍 Anotado.';
}

function aplicarEstilo() {
  cel.classList.toggle('chat--wa', estado.estilo === 'wa');
  cel.classList.toggle('chat--im', estado.estilo === 'im');
  $$('[data-estilo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.estilo === estado.estilo)));
  $('[data-estado-chat]').textContent = estado.internet ? (estado.estilo === 'wa' ? 'en línea' : 'Casa · iMessage') : 'sin conexión';
}

/* ---------- Escenas ---------- */
const log = $('[data-log]');
let timers = [];

function limpiar() {
  timers.forEach(clearTimeout); timers = [];
  $$('.dev', plano).forEach((g) => g.classList.remove(...ESTADOS, 'activo'));
  $$('.plano__luz', plano).forEach((r) => r.classList.remove('encendida'));
  $('[data-led]', plano)?.classList.remove('encendido');
  log.replaceChildren();
  respuestas([]);
}

function luces(sala, prender) {
  const lista = sala === 'todas' ? SALAS_LUZ(tipo(estado.tipo)) : [sala];
  lista.forEach((s) => $(`.plano__luz[data-sala="${s}"]`, plano)?.classList.toggle('encendida', prender));
}

function aplicar(p) {
  const cls = !p.aplica ? 'paso paso--na' : !p.ejecuta ? 'paso paso--fuera' : p.enCola ? 'paso paso--cola' : 'paso';
  const tag = !p.aplica ? 'No aplica a esta casa' : !p.incluido ? `Con nivel ${p.n} · ${NIVELES[p.n].nombre}` : p.sinSenal ? 'No llega sin internet' : p.enCola ? 'Mensaje en espera' : `Nivel ${p.n} · ${NIVELES[p.n].nombre}`;
  const li = crear('li', cls);
  const quien = p.dev === 'telefono' ? '📱' : EQ[p.dev]?.ico || '';
  li.append(crear('span', 'paso__tag', tag), crear('span', null, `${quien} ${p.texto}`));
  log.append(li);
  if (!p.ejecuta) return;
  const g = $(`.dev[data-dev="${p.dev}"]`, plano);
  if (g) { g.classList.remove(...ESTADOS); g.classList.add(p.estado, 'activo'); setTimeout(() => g.classList.remove('activo'), 900); }
  if (p.sala) luces(p.sala, p.estado === 'on');
  if (p.dev === 'ledcontorno') $('[data-led]', plano)?.classList.toggle('encendido', p.estado === 'on');
  if (p.msg) { burbuja(p.msg, 'casa', p.enCola ? 'burbuja--cola' : ''); if (!p.enCola) respuestas(p.resp); }
}

function correr(id) {
  limpiar();
  estado.escena = id;
  const e = ESCENAS.find((x) => x.id === id);
  horaActual = HORA[id] || '9:41';
  $('[data-hora-cel]').textContent = horaActual;
  $$('[data-escenas] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.escena === id)));
  $('[data-resumen]').textContent = `${e.ico} ${e.titulo} · ${horaActual} h — ${e.resumen}`;
  const pasos = planificar(id, estado.nivel, estado.internet, estado.tipo);
  const demora = quieto() ? 0 : 850;
  pasos.forEach((p, i) => timers.push(setTimeout(() => aplicar(p), demora * (i + 1))));
  timers.push(setTimeout(() => {
    const validos = pasos.filter((p) => p.aplica);
    const hechos = validos.filter((p) => p.ejecuta).length;
    const falta = validos.find((p) => !p.incluido);
    const li = crear('li', 'paso paso--fin');
    li.append(crear('span', 'paso__tag', 'Resultado'), crear('span', null,
      `${hechos} de ${validos.length} acciones con nivel ${estado.nivel} (${NIVELES[estado.nivel].nombre}).` +
      (falta ? ` Para hacer todo hace falta nivel ${Math.max(...validos.map((p) => p.n))}.` : ' La casa hizo todo.') +
      (hechos < validos.length && e.sin ? ` ${e.sin}` : '') +
      (!estado.internet ? ' Sin internet, lo local sigue funcionando y los mensajes esperan.' : '')));
    log.append(li);
  }, demora * (pasos.length + 1)));
}

function dibujarEscenas() {
  const caja = $('[data-escenas]');
  caja.replaceChildren(...escenasDe(estado.tipo).map((e) => {
    const b = crear('button', 'escena');
    b.type = 'button'; b.dataset.escena = e.id; b.setAttribute('aria-pressed', 'false');
    b.append(crear('span', 'escena__ico', e.ico), crear('span', null, e.titulo));
    b.addEventListener('click', () => correr(e.id));
    return b;
  }));
}

/* ---------- Controles ---------- */
function dibujarControles() {
  const tipos = $('[data-tipos]');
  tipos.querySelector('p')?.remove();
  TIPOS.forEach((t) => {
    const l = crear('label', 'tipo');
    const i = crear('input'); i.type = 'radio'; i.name = 'tipo'; i.value = t.id; i.checked = t.id === estado.tipo;
    const c = crear('span', 'tipo__caja');
    c.append(crear('span', 'tipo__ico', t.ico), crear('b', null, t.nombre), crear('small', null, t.desc));
    l.append(i, c);
    i.addEventListener('change', () => { estado.tipo = t.id; guardar('lsm-casa-tipo', t.id); cambiarTipo(); });
    tipos.append(l);
  });
  const niv = $('[data-niveles]');
  Object.entries(NIVELES).forEach(([n, v]) => {
    const l = crear('label');
    const i = crear('input'); i.type = 'radio'; i.name = 'nivel'; i.value = n; i.checked = Number(n) === estado.nivel;
    const c = crear('span'); c.append(crear('b', null, `${n} · ${v.nombre}`), crear('small', null, v.detalle));
    l.append(i, c);
    i.addEventListener('change', () => { estado.nivel = Number(n); guardar('lsm-casa-nivel5', estado.nivel); pintarNivel(); if (estado.escena) correr(estado.escena); });
    niv.append(l);
  });
  $('[data-internet]').addEventListener('change', (e) => { estado.internet = e.target.checked; aplicarEstilo(); if (estado.escena) correr(estado.escena); });
  $('[data-nombres]').addEventListener('change', (e) => plano.classList.toggle('sin-nombres', !e.target.checked));
  $$('[data-estilo]').forEach((b) => b.addEventListener('click', () => { estado.estilo = b.dataset.estilo; guardar('lsm-casa-chat', estado.estilo); aplicarEstilo(); }));
}

function cambiarTipo() {
  limpiar();
  estado.escena = null;
  chat.replaceChildren(crear('p', 'chat__fecha', 'Hoy'), crear('p', 'chat__vacio', 'Elegí una situación y los avisos de la casa llegan acá.'));
  $('[data-resumen]').textContent = 'Elegí una situación para empezar.';
  dibujarPlano(); dibujarEscenas(); dibujarCatalogo(); actualizarConfig();
}

/* ---------- Mi lista: lo que tengo y lo que quiero ---------- */
const mia = leer('lsm-casa-mia', {});
function marcar(id, valor) {
  if (mia[id] === valor) delete mia[id]; else mia[id] = valor;
  guardar('lsm-casa-mia', mia);
  resumenMia(); dibujarCatalogo(); pintarMia();
}
function pintarMia() { $$('.dev', plano).forEach((g) => { g.classList.toggle('dev--tengo', mia[g.dataset.dev] === 'tengo'); g.classList.toggle('dev--quiero', mia[g.dataset.dev] === 'quiero'); }); }
function resumenMia() {
  const caja = $('[data-mia]'); if (!caja) return;
  const tengo = Object.keys(mia).filter((k) => mia[k] === 'tengo' && EQ[k]);
  const quiero = Object.keys(mia).filter((k) => mia[k] === 'quiero' && EQ[k]);
  $('[data-mia-tengo]').textContent = String(tengo.length);
  $('[data-mia-quiero]').textContent = String(quiero.length);
  $('[data-mia-costo]').textContent = quiero.length ? rango(costo(quiero)) : 'USD 0';
}

/* ---------- Catálogo ---------- */
const filtro = { cat: 'todas', texto: '', mia: false };
function dibujarCatalogo() {
  const hay = equiposDe(estado.tipo);
  const t = filtro.texto.toLowerCase();
  const lista = EQUIPOS.filter((q) => (!filtro.mia || mia[q.id]) && (filtro.cat === 'todas' || q.cat === filtro.cat) && (!t || `${q.nombre} ${q.que} ${q.proto} ${CATEGORIAS[q.cat]}`.toLowerCase().includes(t)));
  const caja = $('[data-catalogo]');
  caja.replaceChildren(...lista.map((q) => {
    const a = crear('article', 'eq');
    const cab = crear('div', 'eq__cab');
    cab.append(crear('span', 'eq__ico', q.ico), crear('span', `estado-chip nivel-chip nivel-chip--${q.n}`, `Nivel ${q.n}`));
    a.append(cab, crear('h3', null, q.nombre), crear('p', null, q.que));
    const pie = crear('p', 'eq__pie');
    pie.append(crear('span', null, q.proto), crear('span', null, `${rango(q.p)} c/u`));
    a.append(pie);
    const acc = crear('div', 'eq__mia');
    [['tengo', '✓ Lo tengo'], ['quiero', '★ Lo quiero']].forEach(([v, txt]) => { const b = crear('button', `eq__marca eq__marca--${v}`, txt); b.type = 'button'; b.setAttribute('aria-pressed', String(mia[q.id] === v)); b.addEventListener('click', () => marcar(q.id, v)); acc.append(b); });
    a.append(acc);
    if (mia[q.id]) a.classList.add(`eq--${mia[q.id]}`);
    if (hay.has(q.id)) { const b = crear('button', 'eq__ver', 'Ver en el plano'); b.type = 'button'; b.addEventListener('click', () => { info(q.id); $('#simulador').scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth' }); }); a.append(b); }
    return a;
  }));
  if (!lista.length) caja.append(crear('p', 'fuentes', 'No hay equipos con ese filtro.'));
}
function controlesCatalogo() {
  const chips = $('[data-cats]');
  [['todas', 'Todas'], ...Object.entries(CATEGORIAS)].forEach(([id, nombre]) => {
    const b = crear('button', 'chip-filtro', nombre); b.type = 'button'; b.dataset.cat = id; b.setAttribute('aria-pressed', String(id === 'todas'));
    b.addEventListener('click', () => { filtro.cat = id; $$('button', chips).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); dibujarCatalogo(); });
    chips.append(b);
  });
  $('[data-buscar]').addEventListener('input', (e) => { filtro.texto = e.target.value; dibujarCatalogo(); });
  $('[data-mia-solo]').addEventListener('click', (e) => { filtro.mia = !filtro.mia; e.target.setAttribute('aria-pressed', String(filtro.mia)); dibujarCatalogo(); });
  $('[data-mia-config]').addEventListener('click', () => { elegidos = new Set(Object.keys(mia).filter((k) => EQ[k])); actualizarConfig(); $('#configurador').scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth' }); });
  $('[data-mia-borrar]').addEventListener('click', () => { for (const k of Object.keys(mia)) delete mia[k]; guardar('lsm-casa-mia', mia); resumenMia(); dibujarCatalogo(); pintarMia(); });
  resumenMia();
}

/* ---------- Configurador ---------- */
let elegidos = new Set(leer('lsm-casa-equipos5', equiposNivel(2, estado.tipo)));
function actualizarConfig() {
  const hay = equiposDe(estado.tipo);
  const ids = [...elegidos].filter((i) => hay.has(i));
  $('[data-tipo-config]').textContent = `Tu ${tipo(estado.tipo).nombre.toLowerCase()}`;
  $('[data-total]').textContent = ids.length ? rango(costo(ids)) : 'USD 0';
  const n = ids.reduce((s, i) => s + EQ[i].c, 0);
  $('[data-cantidad]').textContent = `${n} ${n === 1 ? 'equipo' : 'equipos'}`;
  const c = cobertura(ids, estado.tipo);
  $('[data-cobertura]').textContent = `Hace ${c.cubiertos} de las ${c.total} acciones del simulador`;
  $('[data-barra]').style.width = `${Math.round((c.cubiertos / c.total) * 100)}%`;
  $$('[data-equipos] input').forEach((i) => { i.checked = elegidos.has(i.value); i.closest('label').hidden = !hay.has(i.value); });
  guardar('lsm-casa-equipos5', [...elegidos]);
}
function dibujarConfig() {
  const lista = $('[data-equipos]');
  lista.replaceChildren(...Object.entries(NIVELES).map(([n, v]) => {
    const grupo = crear('fieldset', 'config__grupo');
    grupo.append(crear('legend', null, `Nivel ${n} · ${v.nombre} — ${v.detalle}`));
    EQUIPOS.filter((q) => q.n === Number(n)).forEach((q) => {
      const l = crear('label', 'equipo');
      const i = crear('input'); i.type = 'checkbox'; i.value = q.id;
      i.addEventListener('change', () => { i.checked ? elegidos.add(q.id) : elegidos.delete(q.id); actualizarConfig(); });
      l.append(i, crear('span', 'equipo__nom', `${q.ico} ${q.nombre}${q.c > 1 ? ` ×${q.c}` : ''}`), crear('span', 'equipo__precio', rango([q.p[0] * q.c, q.p[1] * q.c])));
      grupo.append(l);
    });
    return grupo;
  }));
  const pre = $('[data-preset]');
  [...Object.entries(NIVELES).map(([n, v]) => [n, `${n} · ${v.nombre}`]), ['0', 'Vaciar']].forEach(([n, txt]) => {
    const b = crear('button', 'boton boton--sec', txt); b.type = 'button';
    b.addEventListener('click', () => { elegidos = new Set(equiposNivel(Number(n), estado.tipo)); actualizarConfig(); });
    pre.append(b);
  });
}

/* ---------- Inicio ---------- */
if (plano) {
  dibujarControles();
  controlesCatalogo();
  dibujarConfig();
  aplicarEstilo();
  cambiarTipo();
}
