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
const CORTO = { hub: 'Puente', humo: 'Humo', co: 'Monóxido', agua: 'Agua', puerta: 'Puerta', enchufe: 'Enchufes', controlador: 'Controlador', luces: 'Luces', cortinas: 'Cortinas', presencia: 'Presencia', movimiento: 'Movimiento', temp: 'Temperatura', clima: 'Aire', luzamb: 'Luz natural', escena: 'Escenas', comedero: 'Comedero', medidor: 'Tablero', caudal: 'Medidor agua', tanque: 'Tanque', riego: 'Riego', suelo: 'Suelo', co2: 'Aire CO₂', ventana: 'Ventanas', reflector: 'Reflector', bebedero: 'Bebedero', heladera: 'Heladera', vibracion: 'Lavarropas', buzon: 'Buzón', lluvia: 'Estación', garrafa: 'Garrafa', humedadpared: 'Humedad', cerradura: 'Cerradura', camara: 'Cámara', timbre: 'Timbre', sirena: 'Alarma', vidrio: 'Vidrios', gas: 'Gas', valvula: 'Válvula', porton: 'Portón', puertamascota: 'Gatera', ups: 'UPS', solar: 'Paneles', bateria: 'Batería', ev: 'Cargador', aspiradora: 'Aspiradora', cortacesped: 'Cortacésped', boton: 'Ayuda', caida: 'Caídas', cama: 'Cama', collar: 'Collar GPS', voz: 'Voz', pileta: 'Pileta', bomba: 'Bomba', starlink: 'Satélite' };
const HORA = { agua: '10:12', humo: '20:41', gas: '23:05', salir: '08:15', llegar: '18:47', despertar: '07:00', noche: '19:58', vacaciones: '09:30', tormenta: '16:20', corte: '21:10', calor: '15:02', mayor: '10:00', mascota: '13:00', visita: '11:34', intruso: '03:12', sol: '12:30', pileta: '17:45', tanque: '06:40' };

const estado = { tipo: leer('lsm-casa-tipo', 'casa'), nivel: leer('lsm-casa-nivel5', 3), internet: true, estilo: leer('lsm-casa-chat', 'wa'), escena: null };
if (!TIPOS.some((t) => t.id === estado.tipo)) estado.tipo = 'casa';

$('[data-cuenta-equipos]') && ($('[data-cuenta-equipos]').textContent = `${EQUIPOS.length} equipos`);
$('[data-cuenta-escenas]') && ($('[data-cuenta-escenas]').textContent = `${ESCENAS.length} situaciones`);

/* ---------- Plano ---------- */
const plano = $('[data-plano]');
function dibujarDeco(g, d) {
  if (d.k === 'calle' || d.k === 'camino') {
    g.append(svg('rect', { class: d.k === 'calle' ? 'p-vereda' : 'p-banquina', x: 0, y: 470, width: 760, height: 22 }));
    g.append(svg('rect', { class: d.k === 'calle' ? 'p-calle' : 'p-camino', x: 0, y: 492, width: 760, height: 68 }));
    if (d.k === 'calle') g.append(svg('path', { class: 'p-linea', d: 'M10 526 H750' }));
    g.append(svg('text', { class: 'p-calle__txt', x: 20, y: 548 }, d.k === 'calle' ? 'Calle' : 'Camino rural'));
  } else if (d.k === 'arbol') {
    g.append(svg('circle', { class: 'p-arbol', cx: d.x, cy: d.y, r: d.r }));
    g.append(svg('circle', { class: 'p-arbol2', cx: d.x - d.r / 3, cy: d.y - d.r / 3, r: d.r / 2 }));
  } else if (d.k === 'auto') {
    g.append(svg('rect', { class: 'p-auto', x: d.x, y: d.y, width: 64, height: 34, rx: 10 }));
    g.append(svg('rect', { class: 'p-auto__vidrio', x: d.x + 14, y: d.y + 6, width: 36, height: 22, rx: 5 }));
  } else if (d.k === 'cucha') {
    g.append(svg('path', { class: 'p-cucha', d: `M${d.x - 16} ${d.y} L${d.x} ${d.y - 16} L${d.x + 16} ${d.y} V${d.y + 18} H${d.x - 16}Z` }));
    g.append(svg('text', { class: 'p-emoji', x: d.x, y: d.y + 40 }, '🐕'));
  } else if (d.k === 'porton') {
    g.append(svg('path', { class: 'p-porton', d: `M${d.x} ${d.y} H${d.x + d.w}` }));
  } else if (d.k === 'agua') {
    g.append(svg('rect', { class: 'p-pileta', x: d.x, y: d.y, width: d.w, height: d.h, rx: 12 }));
    g.append(svg('path', { class: 'p-ola', d: `M${d.x + 8} ${d.y + d.h * 0.35} h${d.w - 16} M${d.x + 8} ${d.y + d.h * 0.65} h${d.w - 16}` }));
  } else if (d.k === 'tanqueAlto') {
    g.append(svg('rect', { class: 'p-tanque', x: d.x - 20, y: d.y - 40, width: 40, height: 34, rx: 6 }));
    g.append(svg('path', { class: 'p-torre', d: `M${d.x - 16} ${d.y - 6} L${d.x - 22} ${d.y + 60} M${d.x + 16} ${d.y - 6} L${d.x + 22} ${d.y + 60} M${d.x - 19} ${d.y + 26} H${d.x + 19}` }));
  } else if (d.k === 'macetas') {
    [0, 34, 68].forEach((dx) => { g.append(svg('rect', { class: 'p-maceta', x: d.x + dx, y: d.y, width: 24, height: 20, rx: 4 })); g.append(svg('circle', { class: 'p-arbol', cx: d.x + dx + 12, cy: d.y - 6, r: 12 })); });
  }
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
  for (const [, , x, y, w, h, tp] of t.salas) if (tp === 'in') plano.append(svg('rect', { class: 'p-muro', x, y, width: w, height: h }));
  const deco2 = svg('g');
  t.deco.filter((d) => d.k !== 'calle' && d.k !== 'camino').forEach((d) => dibujarDeco(deco2, d));
  plano.append(deco2);
  for (const [, nombre, x, y] of t.salas) plano.append(svg('text', { class: 'plano__sala', x: x + 10, y: y + 20 }, nombre));
  const pos = posiciones(t);
  for (const [id, [x, y, k]] of Object.entries(pos)) {
    const q = EQ[id];
    const g = svg('g', { class: k < 0.8 ? 'dev dev--chico' : 'dev', 'data-dev': id, transform: `translate(${x} ${y}) scale(${k})`, tabindex: 0, role: 'button', 'aria-label': `${q.nombre}: ${q.que}` });
    g.append(svg('circle', { r: 16 }), svg('text', { class: 'dev__ico', y: 6 }, q.ico), svg('text', { class: 'dev__nom', y: 30 }, CORTO[id] || q.nombre));
    g.addEventListener('click', () => info(id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); info(id); } });
    plano.append(g);
  }
  pintarNivel();
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

/* ---------- Catálogo ---------- */
const filtro = { cat: 'todas', texto: '' };
function dibujarCatalogo() {
  const hay = equiposDe(estado.tipo);
  const t = filtro.texto.toLowerCase();
  const lista = EQUIPOS.filter((q) => (filtro.cat === 'todas' || q.cat === filtro.cat) && (!t || `${q.nombre} ${q.que} ${q.proto} ${CATEGORIAS[q.cat]}`.toLowerCase().includes(t)));
  const caja = $('[data-catalogo]');
  caja.replaceChildren(...lista.map((q) => {
    const a = crear('article', 'eq');
    const cab = crear('div', 'eq__cab');
    cab.append(crear('span', 'eq__ico', q.ico), crear('span', `estado-chip nivel-chip nivel-chip--${q.n}`, `Nivel ${q.n}`));
    a.append(cab, crear('h3', null, q.nombre), crear('p', null, q.que));
    const pie = crear('p', 'eq__pie');
    pie.append(crear('span', null, q.proto), crear('span', null, `${rango(q.p)} c/u`));
    a.append(pie);
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
