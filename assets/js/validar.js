// Validación de entradas del usuario. Funciones puras: se usan en el navegador y en los tests.
// Regla: todo lo que escribe el usuario se valida por lista blanca (tipo, largo, formato)
// y nunca se inserta como HTML.

export const LIMITES = { nombre: [2, 80], email: [6, 120], barrio: [0, 60], mensaje: [20, 2000] };
export const TEMAS = ['conectividad', 'seguridad', 'salud', 'movilidad', 'ambiente', 'turismo', 'tramites', 'privacidad', 'otro'];

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;
const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const NOMBRE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;
const URLS = /(https?:\/\/|www\.)/gi;

// Quita caracteres de control y de dirección de texto, normaliza espacios y Unicode.
export function limpiar(valor) {
  if (typeof valor !== 'string') return '';
  return valor.normalize('NFC').replace(CONTROL, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export function validarIdea(entrada) {
  const d = {
    nombre: limpiar(entrada?.nombre),
    email: limpiar(entrada?.email).toLowerCase(),
    barrio: limpiar(entrada?.barrio),
    tema: limpiar(entrada?.tema),
    mensaje: limpiar(entrada?.mensaje),
    acepta: entrada?.acepta === true || entrada?.acepta === 'on',
    trampa: typeof entrada?.trampa === 'string' ? entrada.trampa : '',
  };
  const errores = {};
  const largo = (k) => [...d[k]].length;
  const fuera = (k) => largo(k) < LIMITES[k][0] || largo(k) > LIMITES[k][1];

  if (fuera('nombre') || !NOMBRE.test(d.nombre)) errores.nombre = 'Escribí tu nombre (2 a 80 letras, sin números ni símbolos).';
  if (fuera('email') || !EMAIL.test(d.email)) errores.email = 'Revisá el email: parece incompleto.';
  if (largo('barrio') > LIMITES.barrio[1]) errores.barrio = 'Máximo 60 caracteres.';
  if (!TEMAS.includes(d.tema)) errores.tema = 'Elegí un tema de la lista.';
  if (fuera('mensaje')) errores.mensaje = 'Contanos tu idea en 20 a 2000 caracteres.';
  else if ((d.mensaje.match(URLS) || []).length > 2) errores.mensaje = 'Por seguridad, se aceptan hasta 2 enlaces.';
  if (!d.acepta) errores.acepta = 'Necesitamos que aceptes la política de privacidad para enviar.';
  if (d.trampa) errores._bot = 'Envío bloqueado.';

  return { ok: Object.keys(errores).length === 0, datos: d, errores };
}

// Límite de envíos por navegador. `historial` = marcas de tiempo (ms) de envíos anteriores.
export function puedeEnviar(historial, ahora, { porHora = 3, esperaSegundos = 45 } = {}) {
  const recientes = (Array.isArray(historial) ? historial : []).filter((t) => Number.isFinite(t) && ahora - t < 3600_000 && t <= ahora);
  const ultimo = recientes.length ? Math.max(...recientes) : 0;
  if (ultimo && ahora - ultimo < esperaSegundos * 1000) {
    return { ok: false, esperar: Math.ceil((esperaSegundos * 1000 - (ahora - ultimo)) / 1000), recientes };
  }
  if (recientes.length >= porHora) {
    return { ok: false, esperar: Math.ceil((3600_000 - (ahora - Math.min(...recientes))) / 1000), recientes };
  }
  return { ok: true, esperar: 0, recientes };
}

// Escapa texto para mostrarlo dentro de HTML (por si alguna vez hiciera falta).
export function escaparHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
