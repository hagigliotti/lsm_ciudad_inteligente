// Simulador y configurador de la casa inteligente. Todo ocurre en el navegador.
import { NIVELES, EQUIPOS, ESCENAS, planificar, costo, equiposNivel, cobertura } from './casa-datos.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const crear = (tag, clase, texto) => { const e = document.createElement(tag); if (clase) e.className = clase; if (texto != null) e.textContent = texto; return e; };
const usd = (v) => `USD ${v.toLocaleString('es-AR')}`;
const rango = ([a, b]) => (a === b ? usd(a) : `${usd(a)} – ${b.toLocaleString('es-AR')}`);
const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* sin almacenamiento */ } };
const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } };
const SALAS = ['living', 'cocina', 'lavadero', 'bano', 'dorm', 'estudio'];
const ESTADOS = ['alerta', 'on', 'off', 'cerrado', 'ok'];

/* ---------- Simulador ---------- */
const sim = $('[data-sim]');
if (sim) {
  const caja = $('[data-escenas]');
  const log = $('[data-log]');
  const avisos = $('[data-avisos]');
  const resumen = $('[data-resumen]');
  const internet = $('[data-internet]');
  let timers = [];
  let actual = null;

  const nivel = () => Number($('input[name="nivel"]:checked').value);
  const nivelGuardado = leer('lsm-casa-nivel', 2);
  const radio = $(`input[name="nivel"][value="${nivelGuardado}"]`);
  if (radio) radio.checked = true;

  const pintarNivel = () => {
    const n = nivel();
    const incluidos = new Set(equiposNivel(n));
    $$('.dev', sim).forEach((g) => g.classList.toggle('dev--fuera', !incluidos.has(g.dataset.dev)));
  };

  const limpiar = () => {
    timers.forEach(clearTimeout); timers = [];
    $$('.dev', sim).forEach((g) => g.classList.remove(...ESTADOS, 'activo'));
    $$('.plano__luz', sim).forEach((r) => r.classList.remove('encendida'));
    log.replaceChildren();
    avisos.replaceChildren(crear('li', 'celular__vacio', 'Sin avisos'));
  };

  const luces = (sala, prender) => {
    const lista = sala === 'todas' ? SALAS : [sala];
    lista.forEach((s) => $(`.plano__luz[data-sala="${s}"]`, sim)?.classList.toggle('encendida', prender));
  };

  const aviso = (texto, enCola) => {
    $('.celular__vacio', avisos)?.remove();
    const li = crear('li', enCola ? 'en-cola' : '');
    li.append(crear('b', null, enCola ? 'En espera · sin internet' : 'LSM Casa · ahora'), crear('span', null, texto));
    avisos.prepend(li);
  };

  const aplicar = (p) => {
    const li = crear('li', p.ejecuta ? (p.enCola ? 'paso paso--cola' : 'paso') : 'paso paso--fuera');
    const etiqueta = !p.incluido ? `Con nivel ${NIVELES[p.n].nombre.toLowerCase()}` : p.sinSenal ? 'No llega sin internet' : p.enCola ? 'Se envía al volver internet' : `Nivel ${NIVELES[p.n].nombre.toLowerCase()}`;
    li.append(crear('span', 'paso__tag', etiqueta), crear('span', null, p.texto));
    log.append(li);
    if (!p.ejecuta) return;
    const g = $(`.dev[data-dev="${p.dev}"]`, sim);
    if (g) { g.classList.remove(...ESTADOS); g.classList.add(p.estado, 'activo'); setTimeout(() => g.classList.remove('activo'), 900); }
    if (p.sala) luces(p.sala, p.estado === 'on');
    if (p.red && (p.dev === 'telefono' || p.dev === 'ventana' || p.dev === 'controlador')) aviso(p.texto.replace(/^Aviso[^:]*: /, '').replace(/[“”]/g, ''), p.enCola);
  };

  const correr = (id) => {
    limpiar();
    actual = id;
    const e = ESCENAS.find((x) => x.id === id);
    $$('button', caja).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.escena === id)));
    resumen.textContent = `${e.ico} ${e.titulo}: ${e.resumen}`;
    const pasos = planificar(id, nivel(), internet.checked);
    const demora = quieto() ? 0 : 900;
    pasos.forEach((p, i) => timers.push(setTimeout(() => aplicar(p), demora * (i + 1))));
    timers.push(setTimeout(() => {
      const hechos = pasos.filter((p) => p.ejecuta).length;
      const li = crear('li', 'paso paso--fin');
      li.append(crear('span', 'paso__tag', 'Resultado'), crear('span', null,
        `${hechos} de ${pasos.length} acciones con tu nivel.` + (hechos < pasos.length && e.sin ? ` ${e.sin}` : '') +
        (!internet.checked ? ' Sin internet, todo lo local sigue funcionando; los avisos esperan.' : '')));
      log.append(li);
    }, demora * (pasos.length + 1)));
  };

  caja.replaceChildren(...ESCENAS.map((e) => {
    const b = crear('button', 'escena');
    b.type = 'button'; b.dataset.escena = e.id; b.setAttribute('aria-pressed', 'false');
    b.append(crear('span', 'escena__ico', e.ico), crear('span', null, e.titulo));
    b.addEventListener('click', () => correr(e.id));
    return b;
  }));
  $$('input[name="nivel"]').forEach((r) => r.addEventListener('change', () => { guardar('lsm-casa-nivel', nivel()); pintarNivel(); if (actual) correr(actual); }));
  internet.addEventListener('change', () => { if (actual) correr(actual); });
  pintarNivel();
}

/* ---------- Configurador ---------- */
const lista = $('[data-equipos]');
if (lista) {
  let elegidos = new Set(leer('lsm-casa-equipos', equiposNivel(1)));
  const total = $('[data-total]'), cant = $('[data-cantidad]'), cob = $('[data-cobertura]'), barra = $('[data-barra]');

  const actualizar = () => {
    const ids = [...elegidos];
    total.textContent = ids.length ? rango(costo(ids)) : 'USD 0';
    const n = EQUIPOS.filter((q) => elegidos.has(q.id)).reduce((s, q) => s + q.cant, 0);
    cant.textContent = `${n} ${n === 1 ? 'equipo' : 'equipos'}`;
    const c = cobertura(ids);
    cob.textContent = `Hace ${c.cubiertos} de las ${c.total} acciones del simulador`;
    barra.style.width = `${Math.round((c.cubiertos / c.total) * 100)}%`;
    $$('input[type="checkbox"]', lista).forEach((i) => { i.checked = elegidos.has(i.value); });
    guardar('lsm-casa-equipos', ids);
  };

  lista.replaceChildren(...[1, 2, 3].map((n) => {
    const grupo = crear('fieldset', 'config__grupo');
    grupo.append(crear('legend', null, `Nivel ${NIVELES[n].nombre.toLowerCase()} · ${NIVELES[n].detalle}`));
    EQUIPOS.filter((q) => q.n === n).forEach((q) => {
      const l = crear('label', 'equipo');
      const i = crear('input'); i.type = 'checkbox'; i.value = q.id;
      i.addEventListener('change', () => { i.checked ? elegidos.add(q.id) : elegidos.delete(q.id); actualizar(); });
      const t = crear('span', 'equipo__nom', q.cant > 1 ? `${q.nombre} ×${q.cant}` : q.nombre);
      l.append(i, t, crear('span', 'equipo__precio', rango([q.precio[0] * q.cant, q.precio[1] * q.cant])));
      grupo.append(l);
    });
    return grupo;
  }));
  $$('[data-preset] button').forEach((b) => b.addEventListener('click', () => {
    elegidos = new Set(equiposNivel(Number(b.dataset.nivel))); actualizar();
  }));
  actualizar();
}
