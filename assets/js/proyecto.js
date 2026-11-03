import { PARTIDAS, AREAS, totales, CRONOGRAMA, INICIO, LUGARES, CAPAS, METAS } from './proyecto-datos.js';

const $ = (s, r = document) => r.querySelector(s);
const fmt = (v, d) => v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
// "USD 105 – 210 mil" o "USD 1,5 – 3,0 millones"
function rango([a, b]) {
  if (b >= 1e6) return a === b ? `USD ${fmt(a / 1e6, 1)} millones` : `USD ${fmt(a / 1e6, 1)} – ${fmt(b / 1e6, 1)} millones`;
  return a === b ? `USD ${fmt(Math.round(a / 1000), 0)} mil` : `USD ${fmt(Math.round(a / 1000), 0)} – ${fmt(Math.round(b / 1000), 0)} mil`;
}
const crear = (tag, clase, texto) => { const e = document.createElement(tag); if (clase) e.className = clase; if (texto != null) e.textContent = texto; return e; };

/* ---------- Metas ---------- */
const metas = $('[data-metas]');
if (metas) METAS.forEach(([n, t]) => { const d = crear('div', 'cifra'); d.append(crear('b', null, n), crear('span', null, t)); metas.append(d); });

/* ---------- Presupuesto ---------- */
const T = totales();
const tabla = $('[data-presupuesto]');
if (tabla) {
  const cuerpo = tabla.querySelector('tbody');
  for (const [clave, nombre] of Object.entries(AREAS)) {
    const fila = crear('tr', 'tabla__area');
    const th = crear('th', null, nombre); th.colSpan = 2; th.scope = 'rowgroup';
    fila.append(th, crear('td', 'num', rango(T.porArea[clave])), crear('td'));
    cuerpo.append(fila);
    PARTIDAS.filter((p) => p.area === clave).forEach((p) => {
      const tr = crear('tr');
      const nom = crear('td'); nom.append(crear('strong', null, p.nombre), crear('small', null, p.detalle));
      tr.append(crear('td', 'tabla__id', p.id.toUpperCase()), nom,
        crear('td', 'num', p.capex ? rango(p.capex) : (p.id === 's5' ? 'Condicionado' : 'A cotizar')),
        crear('td', 'num', p.opex ? (p.opex[1] ? rango(p.opex) : '—') : (p.id === 's5' ? '—' : 'Servicio')));
      cuerpo.append(tr);
    });
  }
  const pie = tabla.querySelector('tfoot');
  const filaPie = (txt, capex, opex, clase) => { const tr = crear('tr', clase); const th = crear('th', null, txt); th.colSpan = 2; tr.append(th, crear('td', 'num', capex), crear('td', 'num', opex)); pie.append(tr); };
  filaPie('Subtotal', rango(T.base), rango(T.opex));
  filaPie('Ingeniería, dirección de obra y capacitación (10 %)', rango(T.gestion), '');
  filaPie('Total del proyecto (5 años)', rango(T.capex), `${rango(T.opex)} por año`, 'tabla__total');
}
document.querySelectorAll('[data-total]').forEach((el) => {
  const k = el.dataset.total;
  el.textContent = k === 'capex' ? rango(T.capex) : k === 'opex' ? rango(T.opex) : k === 'hab' ? `USD ${T.porHabitanteAnio[0]} a ${T.porHabitanteAnio[1]}` : '';
});

// Barras por área (proporción del máximo)
const barras = $('[data-barras]');
if (barras) {
  const max = Math.max(...Object.values(T.porArea).map((v) => v[1]));
  for (const [clave, nombre] of Object.entries(AREAS)) {
    const [a, b] = T.porArea[clave];
    const fila = crear('div', 'barra-area');
    const pista = crear('div', 'barra-area__pista');
    const min = crear('i', 'barra-area__min'); min.style.width = `${(a / max) * 100}%`;
    const mx = crear('i', 'barra-area__max'); mx.style.width = `${(b / max) * 100}%`;
    pista.append(mx, min);
    fila.append(crear('span', 'barra-area__nombre', nombre), pista, crear('span', 'barra-area__valor', rango([a, b])));
    barras.append(fila);
  }
}

/* ---------- Cronograma ---------- */
const gantt = $('[data-gantt]');
if (gantt) {
  const cab = crear('div', 'gantt__cab');
  cab.append(crear('span'));
  for (let a = 0; a < 5; a++) { const s = crear('span', 'gantt__anio', String(INICIO + a)); s.style.gridColumn = `${2 + a * 4} / span 4`; cab.append(s); }
  gantt.append(cab);
  CRONOGRAMA.forEach((c) => {
    const fila = crear('div', 'gantt__fila');
    fila.append(crear('span', 'gantt__nombre', c.nombre));
    const b = crear('span', `gantt__barra gantt__barra--f${c.fase}`);
    b.style.gridColumn = `${2 + c.t[0]} / ${3 + c.t[1]}`;
    b.title = `Fase ${c.fase}: ${INICIO + Math.floor(c.t[0] / 4)}-T${(c.t[0] % 4) + 1} a ${INICIO + Math.floor(c.t[1] / 4)}-T${(c.t[1] % 4) + 1}`;
    b.setAttribute('aria-label', b.title);
    fila.append(b);
    gantt.append(fila);
  });
}

/* ---------- Mapa ---------- */
const caja = $('[data-mapa]');
if (caja && window.L) {
  const L = window.L;
  const mapa = L.map(caja, { scrollWheelZoom: false }).setView([-32.0675, -60.457], 14);
  const calles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  const satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics',
  }).addTo(mapa);
  const c = (k) => LUGARES[k].c;
  const verde = '#3ddc97', naranja = '#ff7a00';

  const fibra = L.polyline(CAPAS.fibra.map(c), { color: naranja, weight: 5, opacity: 0.9, dashArray: '10 6' })
    .bindPopup('<b>Troncal de fibra municipal</b><br>Trazado esquemático: el recorrido real sigue las calles y los ductos nuevos.');
  const lora = L.layerGroup(CAPAS.lora.map((k) => L.circle(c(k), { radius: 2000, color: verde, weight: 1, fillOpacity: 0.03 })
    .bindPopup(`<b>Gateway LoRaWAN</b><br>${LUGARES[k].n}<br>Alcance urbano estimado: 2 km`)));
  const wifi = L.layerGroup(CAPAS.wifi.map((k) => L.circleMarker(c(k), { radius: 9, color: '#fff', weight: 2, fillColor: '#2bb673', fillOpacity: 1 })
    .bindPopup(`<b>Wi-Fi 6 público</b><br>${LUGARES[k].n}`)));
  const lugares = L.layerGroup(Object.entries(LUGARES).map(([k, l]) => L.circleMarker(l.c, {
    radius: k === 'municipio' ? 10 : 6, color: '#0d1f18', weight: 2, fillColor: k === 'municipio' ? naranja : '#e8f5ee', fillOpacity: 1,
  }).bindPopup(`<b>${l.n}</b>${k === 'municipio' ? '<br>Centro de monitoreo y nodo central de la red' : ''}`)));
  const crecimiento = L.circle([-32.0652, -60.4513], { radius: 750, color: '#ffc48c', weight: 2, dashArray: '4 6', fillOpacity: 0.08 })
    .bindPopup('<b>Zona que en 2009 era campo</b><br>En el mapa original, entre el centro y Puiggari había campos. Hoy están el CIC y los barrios de Altos de Libertador. Área aproximada.');

  [fibra, lora, wifi, lugares, crecimiento].forEach((l) => l.addTo(mapa));
  L.control.layers(
    { 'Satélite (hoy)': satelite, 'Calles': calles },
    { 'Troncal de fibra': fibra, 'Cobertura LoRaWAN': lora, 'Wi-Fi público': wifi, 'Instituciones': lugares, 'Crecimiento desde 2009': crecimiento },
    { collapsed: true },
  ).addTo(mapa);
  L.control.scale({ imperial: false }).addTo(mapa);
  mapa.fitBounds(L.latLngBounds(Object.values(LUGARES).map((l) => l.c)).pad(0.25));
}
