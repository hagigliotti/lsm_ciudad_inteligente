import { CONFIG } from './config.js';
import { validarIdea, puedeEnviar } from './validar.js';

/* ---------- Almacenamiento seguro (puede fallar en modo privado) ---------- */
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* sin almacenamiento */ } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch (_) { return def; } };

/* ---------- Consentimiento y Google Analytics ---------- */
// Google Analytics solo se carga si hay un ID configurado Y la persona aceptó.
// Por defecto (sin respuesta o "Rechazar") no se carga nada de Google.
function cargarAnalytics() {
  if (!/^G-[A-Z0-9]{4,12}$/.test(CONFIG.gaId) || window.__gaCargado) return;
  window.__gaCargado = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', CONFIG.gaId, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
}

function iniciarConsentimiento() {
  const caja = document.querySelector('[data-consent]');
  const decision = leer('lsm-consent', null);
  if (decision === 'si') cargarAnalytics();
  if (!caja) return;
  // Si no hay ID de Analytics, no hay nada que pedir.
  if (!CONFIG.gaId || decision) { caja.hidden = true; } else { caja.hidden = false; }
  caja.addEventListener('click', (e) => {
    const b = e.target.closest('[data-elegir]');
    if (!b) return;
    const v = b.dataset.elegir === 'si' ? 'si' : 'no';
    guardar('lsm-consent', v);
    caja.hidden = true;
    if (v === 'si') cargarAnalytics();
  });
  document.querySelectorAll('[data-revisar-cookies]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    try { localStorage.removeItem('lsm-consent'); } catch (_) { /* nada */ }
    if (CONFIG.gaId) caja.hidden = false;
    else alert('Este sitio no está usando Google Analytics en este momento: no hay nada que configurar.');
  }));
}

/* ---------- Formulario de ideas ---------- */
function iniciarFormulario() {
  const form = document.querySelector('[data-idea]');
  if (!form) return;
  const estado = form.querySelector('[data-estado]');
  const boton = form.querySelector('button[type="submit"]');
  if (!CONFIG.web3formsKey) {
    boton.disabled = true;
    estado.textContent = 'El formulario todavía no está activado.';
  }

  const mostrar = (errores) => {
    form.querySelectorAll('[data-error]').forEach((el) => {
      const campo = el.dataset.error;
      el.textContent = errores[campo] || '';
      const input = form.elements[campo];
      if (input) input.setAttribute('aria-invalid', errores[campo] ? 'true' : 'false');
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = form.elements;
    const r = validarIdea({
      nombre: f.nombre.value, email: f.email.value, barrio: f.barrio.value,
      tema: f.tema.value, mensaje: f.mensaje.value, acepta: f.acepta.checked, trampa: f.botcheck.value,
    });
    mostrar(r.errores);
    if (r.errores._bot) { estado.textContent = '¡Gracias!'; return; } // al bot no se le explica nada
    if (!r.ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }

    const ahora = Date.now();
    const lim = puedeEnviar(leer('lsm-envios', []), ahora, CONFIG.limite);
    if (!lim.ok) {
      estado.textContent = `Ya recibimos tu envío. Podés mandar otro en ${Math.ceil(lim.esperar / 60)} min.`;
      return;
    }

    boton.disabled = true;
    estado.textContent = 'Enviando…';
    try {
      const ctrl = new AbortController();
      const corte = setTimeout(() => ctrl.abort(), 15000);
      const resp = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CONFIG.web3formsKey,
          subject: `LSM Ciudad Inteligente · idea sobre ${r.datos.tema}`,
          from_name: 'LSM Ciudad Inteligente',
          nombre: r.datos.nombre, email: r.datos.email, barrio: r.datos.barrio,
          tema: r.datos.tema, mensaje: r.datos.mensaje, botcheck: '',
        }),
        signal: ctrl.signal,
      });
      clearTimeout(corte);
      const json = await resp.json().catch(() => ({}));
      if (resp.status === 429) throw new Error('limite');
      if (!resp.ok || json.success === false) throw new Error('rechazo');
      guardar('lsm-envios', [...lim.recientes, ahora]);
      form.reset();
      estado.textContent = '¡Gracias! Tu idea llegó. Si pediste respuesta, te escribimos al email que dejaste.';
    } catch (err) {
      // Mensaje genérico: no se muestran detalles técnicos ni respuestas del servidor.
      estado.textContent = err.message === 'limite'
        ? 'Hay muchos envíos en este momento. Probá de nuevo en unos minutos.'
        : 'No pudimos enviar tu idea. Revisá tu conexión y probá otra vez.';
    } finally {
      boton.disabled = !CONFIG.web3formsKey;
    }
  });
}

iniciarConsentimiento();
iniciarFormulario();
document.querySelectorAll('[data-anio]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
