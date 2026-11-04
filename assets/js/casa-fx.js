// Efectos visuales del simulador: personas, animales, vehículos, agua, humo, gas, lluvia, noche, apagón.
// Todo se dibuja en SVG y se anima con clases CSS (sin estilos en línea en el HTML).

const NS = 'http://www.w3.org/2000/svg';
export const svg = (tag, attrs = {}, texto) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (texto != null) e.textContent = texto; return e; };
const g = (attrs, ...hijos) => { const e = svg('g', attrs); e.append(...hijos); return e; };
// Mueve un elemento desde (dx, dy) hasta su lugar con una animación CSS.
// (la animación va en un grupo envolvente para no pisar el transform de posición del dibujo)
const desde = (el, dx, dy, clase = 'fx-llega') => { const w = svg('g', { class: clase }); w.style.setProperty('--dx', `${dx}px`); w.style.setProperty('--dy', `${dy}px`); w.append(el); return w; };

/* ---------- Figuras ---------- */
export function persona(x, y, tipo = 'familia') {
  const cuerpo = { familia: 'f-ropa', ladron: 'f-ladron', abuela: 'f-abuela', visita: 'f-visita' }[tipo];
  const e = g({ class: `fx-persona fx-persona--${tipo}`, transform: `translate(${x} ${y})` },
    svg('ellipse', { class: 'f-sombra', cx: 0, cy: 22, rx: 11, ry: 3 }),
    svg('rect', { class: 'f-pierna', x: -6, y: 8, width: 5, height: 14, rx: 2 }), svg('rect', { class: 'f-pierna', x: 1, y: 8, width: 5, height: 14, rx: 2 }),
    svg('rect', { class: cuerpo, x: -8, y: -8, width: 16, height: 19, rx: 6 }),
    svg('circle', { class: tipo === 'abuela' ? 'f-pelo-gris' : 'f-pelo', cx: 0, cy: -15, r: 8 }),
    svg('circle', { class: 'f-cara', cx: 0, cy: -13, r: 6.5 }));
  if (tipo === 'ladron') e.append(svg('rect', { class: 'f-antifaz', x: -7, y: -16, width: 14, height: 4, rx: 2 }), svg('path', { class: 'f-bolsa', d: 'M8 -2 q10 2 9 14 q-5 4 -10 0 z' }), svg('path', { class: 'f-rayas', d: 'M-8 -2 H8 M-8 4 H8' }));
  if (tipo === 'abuela') e.append(svg('path', { class: 'f-baston', d: 'M10 -2 V22 M10 -2 q4 -4 7 0' }));
  if (tipo === 'visita') e.append(svg('rect', { class: 'f-caja', x: 7, y: -2, width: 12, height: 10, rx: 1 }));
  return e;
}

export function gato(x, y, durmiendo = false) {
  return g({ class: 'fx-gato', transform: `translate(${x} ${y})` },
    svg('path', { class: 'f-gato-cola', d: durmiendo ? 'M10 4 q10 2 6 -8' : 'M10 2 q12 -2 10 -16' }),
    svg('ellipse', { class: 'f-gato', cx: 0, cy: 4, rx: 12, ry: durmiendo ? 6 : 7 }),
    svg('circle', { class: 'f-gato', cx: -11, cy: durmiendo ? 2 : -3, r: 6 }),
    svg('path', { class: 'f-gato', d: durmiendo ? 'M-16 -2 l2 -6 l3 5z M-9 -3 l2 -6 l2 6z' : 'M-16 -7 l2 -7 l3 5z M-9 -8 l2 -7 l2 6z' }),
    svg('circle', { class: 'f-ojo', cx: -13, cy: durmiendo ? 2 : -4, r: durmiendo ? 0.1 : 1.2 }));
}

export function perro(x, y, k = 1) {
  const e = svg('g', { transform: `translate(${x} ${y}) scale(${k})`, class: 'p-perro' });
  e.append(svg('path', { class: 'p-perro__cola', d: 'M-14 6 C-24 2 -24 -8 -20 -14' }),
    svg('path', { class: 'p-perro__cuerpo', d: 'M-16 14 C-17 2 -13 -6 -4 -10 C2 -12 10 -10 12 -4 C14 2 14 10 13 14Z' }),
    svg('rect', { class: 'p-perro__pata', x: -6, y: 6, width: 5, height: 9, rx: 2 }), svg('rect', { class: 'p-perro__pata', x: 4, y: 6, width: 5, height: 9, rx: 2 }),
    svg('circle', { class: 'p-perro__cuerpo', cx: 8, cy: -16, r: 9 }),
    svg('path', { class: 'p-perro__cuerpo', d: 'M14 -19 C21 -20 26 -17 26 -13 C26 -9 21 -8 16 -9Z' }),
    svg('path', { class: 'p-perro__oreja', d: 'M2 -22 C-2 -21 -3 -13 -1 -7 C3 -9 5 -14 5 -19Z' }),
    svg('circle', { class: 'p-negro', cx: 26, cy: -14, r: 2 }), svg('circle', { class: 'p-negro', cx: 11, cy: -18, r: 1.6 }),
    svg('path', { class: 'p-perro__collar', d: 'M1 -9 Q8 -5 15 -9' }));
  return e;
}

export function auto(x, y, color = 'p-auto') {
  return g({ class: 'p-auto-g' },
    ...[[8, -3], [44, -3], [8, 31], [44, 31]].map(([a, b]) => svg('rect', { class: 'p-rueda', x: x + a, y: y + b, width: 12, height: 6, rx: 2 })),
    svg('rect', { class: color, x, y, width: 64, height: 34, rx: 11 }),
    svg('path', { class: 'p-auto__vidrio', d: `M${x + 40} ${y + 5} q8 12 0 24 h-4 v-24z` }),
    svg('path', { class: 'p-auto__vidrio', d: `M${x + 14} ${y + 6} q-5 11 0 22 h3 v-22z` }),
    svg('rect', { class: 'p-auto__techo', x: x + 20, y: y + 6, width: 18, height: 22, rx: 4 }),
    svg('rect', { class: 'p-faro', x: x + 59, y: y + 4, width: 4, height: 6, rx: 1 }), svg('rect', { class: 'p-faro', x: x + 59, y: y + 24, width: 4, height: 6, rx: 1 }));
}

export function camioneta(x, y) {
  return g({ class: 'fx-camioneta' },
    ...[[12, -3], [62, -3], [12, 37], [62, 37]].map(([a, b]) => svg('rect', { class: 'p-rueda', x: x + a, y: y + b, width: 14, height: 6, rx: 2 })),
    svg('rect', { class: 'f-camioneta', x, y, width: 92, height: 40, rx: 8 }),
    svg('rect', { class: 'f-camioneta2', x: x + 70, y: y + 2, width: 22, height: 36, rx: 8 }),
    svg('path', { class: 'p-auto__vidrio', d: `M${x + 80} ${y + 6} q8 14 0 28 h-4 v-28z` }),
    svg('text', { class: 'f-camioneta__txt', x: x + 34, y: y + 25 }, '📦 ENVÍOS'));
}

/* ---------- Efectos ---------- */
// ctx: { capa, cielo, t (tipo), pos (equipos), sala(id) → [x,y,w,h], centro(id) → [x,y], entrada → [x,y], garage → [x,y,w,h] }
export const FX = {
  noche(ctx) { if (!ctx.cielo.querySelector('.fx-noche')) ctx.cielo.append(svg('rect', { class: 'fx-noche', x: 0, y: 0, width: 760, height: 560 })); },
  dia(ctx) { ctx.cielo.querySelector('.fx-noche')?.classList.add('fx-fuera'); },
  apagon(ctx) { ctx.capa.append(svg('rect', { class: 'fx-apagon', 'data-fx': 'apagon', x: 0, y: 0, width: 760, height: 470 })); },
  'apagon-fin'(ctx) { ctx.capa.querySelector('[data-fx="apagon"]')?.remove(); },
  sirena(ctx) { const [x, y, w, h] = ctx.casa; ctx.capa.append(svg('rect', { class: 'fx-sirena', x: x - 8, y: y - 8, width: w + 16, height: h + 16, rx: 8 })); },
  calor(ctx) { ctx.cielo.append(svg('rect', { class: 'fx-calor', x: 0, y: 0, width: 760, height: 470 })); FX.sol(ctx); },
  sol(ctx) {
    if (ctx.capa.querySelector('.fx-sol')) return;
    const s = g({ class: 'fx-sol' }, svg('circle', { class: 'f-sol', r: 18 }));
    for (let i = 0; i < 8; i++) s.append(svg('path', { class: 'f-rayo', d: 'M0 -26 V-34', transform: `rotate(${i * 45})` }));
    ctx.capa.append(g({ transform: 'translate(712 46)' }, s));
  },
  lluvia(ctx) {
    const l = g({ class: 'fx-lluvia' });
    for (let i = 0; i < 70; i++) { const x = (i * 53) % 760; const y = (i * 97) % 470; l.append(svg('path', { class: 'f-gota', d: `M${x} ${y} l-6 16` })); }
    ctx.capa.append(l, svg('rect', { class: 'fx-nubes', x: 0, y: 0, width: 760, height: 470 }));
  },
  charco(ctx, sala) {
    const [cx, cy] = ctx.centro(sala);
    ctx.bajo.append(g({ class: 'fx-charco' }, svg('ellipse', { class: 'f-agua', cx, cy: cy + 10, rx: 46, ry: 22 }), svg('ellipse', { class: 'f-agua2', cx: cx - 10, cy: cy + 6, rx: 16, ry: 6 })));
    for (let i = 0; i < 4; i++) ctx.bajo.append(svg('path', { class: 'f-chorro', d: `M${cx + 30} ${cy - 18} q${6 + i * 3} 10 ${-4 + i * 4} 26` }));
  },
  humo(ctx, sala, clase = 'f-humo') {
    const [cx, cy] = ctx.centro(sala);
    const h = g({ class: 'fx-humo' });
    for (let i = 0; i < 6; i++) h.append(svg('circle', { class: `${clase} f-humo--${i % 3}`, cx: cx - 30 + i * 12, cy: cy + (i % 2) * 8, r: 14 + (i % 3) * 4 }));
    ctx.capa.append(h);
  },
  gas(ctx, sala) { FX.humo(ctx, sala, 'f-gas'); },
  co(ctx, sala) { FX.humo(ctx, sala, 'f-co'); },
  'gas-fin'(ctx) { ctx.capa.querySelectorAll('.fx-humo').forEach((e) => e.classList.add('fx-fuera')); },
  ladron(ctx) {
    const [x, y] = ctx.centro('living');
    const p = persona(x + 30, y + 20, 'ladron'); p.dataset.fx = 'ladron';
    ctx.capa.append(desde(p, 0, -120));
    const [vx, vy] = ctx.ventana;
    ctx.bajo.append(g({ class: 'fx-vidrio' }, ...[0, 1, 2, 3].map((i) => svg('path', { class: 'f-vidrio', d: `M${vx} ${vy} l${-14 + i * 9} ${6 + (i % 2) * 8}` }))));
  },
  'ladron-huye'(ctx) { const p = ctx.capa.querySelector('[data-fx="ladron"]'); if (p) { const viejo = p.parentNode; viejo.replaceWith(desde(p, 0, -200, 'fx-se-va')); } },
  'auto-llega'(ctx) { const [x, y] = ctx.estacionar; ctx.capa.append(desde(auto(x, y, 'p-auto p-auto--fx'), 0, 520 - y)); },
  'auto-sale'(ctx) {
    const [x, y] = ctx.estacionar; ctx.estacionado?.classList.add('fx-oculto');
    ctx.capa.append(desde(auto(x, y, 'p-auto p-auto--fx'), 0, 560 - y, 'fx-se-va'));
  },
  camioneta(ctx) { ctx.capa.append(desde(camioneta(ctx.entrada[0] - 40, 500), -600, 0)); FX.persona(ctx, 'visita'); },
  persona(ctx, tipo = 'familia') { const [x, y] = ctx.entrada; ctx.capa.append(desde(persona(x + 18, y - 8, tipo), 0, 90)); },
  'persona-entra'(ctx) { const [x, y] = ctx.centro('living'); ctx.capa.append(desde(persona(x - 40, y + 30), ctx.entrada[0] - x + 40, ctx.entrada[1] - y - 30)); },
  'persona-sale'(ctx) { const [x, y] = ctx.entrada; ctx.capa.append(desde(persona(x + 10, y + 40), 0, -60, 'fx-se-va')); },
  'persona-cocina'(ctx) { const [x, y] = ctx.centro('cocina'); ctx.capa.append(desde(persona(x, y + 30), -40, 0)); },
  abuela(ctx) { const [x, y] = ctx.centro('dorm'); ctx.capa.append(persona(x + 34, y + 20, 'abuela')); },
  perro(ctx, sala = 'living') { const [x, y] = ctx.centro(sala); ctx.capa.append(desde(perro(x + 20, y + 30, 0.9), -60, 20)); },
  'perro-sale'(ctx) { const [x, y] = ctx.entrada; ctx.capa.append(desde(perro(x + 40, 500, 0.9), 0, -60, 'fx-llega')); },
  gato(ctx, sala = 'cocina') { const [x, y] = ctx.centro(sala); ctx.capa.append(desde(gato(x - 20, y + 34), 50, 10)); },
  robot(ctx) { const [x, y] = ctx.centro('living'); ctx.capa.append(g({ class: 'fx-robot' }, svg('circle', { class: 'f-robot', cx: x, cy: y + 40, r: 11 }), svg('circle', { class: 'f-robot2', cx: x + 4, cy: y + 37, r: 3 }))); },
  'tanque-baja'(ctx) { ctx.plano.querySelector('.p-tanque')?.classList.add('fx-vacio'); },
  burbujas(ctx) { ctx.plano.querySelector('.p-pileta')?.classList.add('fx-filtra'); },
};
