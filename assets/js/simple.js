// Versión simple: montos tomados de los mismos datos que el Proyecto 2026 y simulador de lluvia.
import { totales } from './proyecto-datos.js';

const fmt = (v, d) => v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
function rango([a, b]) {
  if (b >= 1e6) return `USD ${fmt(a / 1e6, 1)} – ${fmt(b / 1e6, 1)} millones`;
  return `USD ${fmt(Math.round(a / 1000), 0)} – ${fmt(Math.round(b / 1000), 0)} mil`;
}

const T = totales();
document.querySelectorAll('[data-total]').forEach((el) => {
  const k = el.dataset.total;
  if (k === 'capex') el.textContent = rango(T.capex);
  else if (k === 'opex') el.textContent = rango(T.opex);
  else if (k === 'hab') el.textContent = `USD ${T.porHabitanteAnio[0]} a ${T.porHabitanteAnio[1]}`;
});

/* ---------- Simulador de lluvia (valores ilustrativos) ---------- */
export const NIVELES = [
  { desde: 0, titulo: 'Todo tranquilo', texto: 'El sistema solo mira. Nadie tiene que hacer nada.' },
  { desde: 20, titulo: 'Observación', texto: 'El centro de monitoreo sigue el arroyo con más atención y revisa el pronóstico.' },
  { desde: 40, titulo: 'Alerta preventiva', texto: 'Se avisa por celular a los vecinos de las calles bajas y sale una cuadrilla a revisar los desagües.' },
  { desde: 60, titulo: 'Protocolo de emergencia', texto: 'Se cortan calles, se activa Defensa Civil y un dron recorre la zona para ver dónde hace falta ayuda.' },
];
export const nivelPara = (mm) => NIVELES.reduce((n, v, i) => (mm >= v.desde ? i : n), 0);

const sim = document.querySelector('[data-simulador]');
if (sim) {
  const rango = sim.querySelector('[data-rango]');
  const mm = sim.querySelector('[data-mm]');
  const nivel = sim.querySelector('[data-nivel]');
  const agua = sim.querySelector('[data-agua]');
  const actualizar = () => {
    const v = Number(rango.value);
    const n = nivelPara(v);
    mm.textContent = String(v);
    nivel.dataset.n = String(n);
    nivel.replaceChildren(document.createTextNode(NIVELES[n].titulo), Object.assign(document.createElement('small'), { textContent: NIVELES[n].texto }));
    // Fondo del cauce: y=200; borde: y=60. El agua sube hasta 130 px con 100 mm.
    const alto = 14 + v * 1.16;
    agua.setAttribute('y', String(200 - alto));
    agua.setAttribute('height', String(alto));
  };
  rango.addEventListener('input', actualizar);
  actualizar();
}
