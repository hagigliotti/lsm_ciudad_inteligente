// Datos del simulador y configurador de la casa inteligente (LSM Smart Home 360).
// Precios: referencias internacionales en USD de 2026, orientativos. Se editan acá y el sitio se actualiza.

export const NIVELES = {
  1: { nombre: 'Básico', detalle: 'Avisos al celular. Sin obra.' },
  2: { nombre: 'Intermedio', detalle: 'Un controlador local une todo y automatiza.' },
  3: { nombre: 'Completo', detalle: 'Actúa sola: corta el agua, genera energía, protege a mayores.' },
};

// id: identificador del equipo en el plano (data-dev). n: nivel desde el que se incluye.
export const EQUIPOS = [
  { id: 'hub', n: 1, nombre: 'Puente de sensores (Zigbee)', precio: [30, 60], cant: 1 },
  { id: 'humo', n: 1, nombre: 'Detector de humo con aviso', precio: [20, 50], cant: 1 },
  { id: 'agua', n: 1, nombre: 'Sensor de agua (lavadero y baño)', precio: [15, 40], cant: 2 },
  { id: 'puerta', n: 1, nombre: 'Sensor de puerta de entrada', precio: [15, 40], cant: 1 },
  { id: 'enchufe', n: 1, nombre: 'Enchufes inteligentes (termotanque y lámpara)', precio: [15, 60], cant: 2 },
  { id: 'controlador', n: 2, nombre: 'Controlador local (Home Assistant)', precio: [100, 300], cant: 1 },
  { id: 'luces', n: 2, nombre: 'Llaves o lámparas inteligentes', precio: [15, 60], cant: 3 },
  { id: 'movimiento', n: 2, nombre: 'Sensor de movimiento', precio: [15, 50], cant: 1 },
  { id: 'ventana', n: 2, nombre: 'Sensor de ventana del dormitorio', precio: [15, 40], cant: 1 },
  { id: 'camara', n: 2, nombre: 'Cámara de entrada con grabación local', precio: [60, 250], cant: 1 },
  { id: 'medidor', n: 2, nombre: 'Medidor de consumo en el tablero', precio: [50, 150], cant: 1 },
  { id: 'cerradura', n: 2, nombre: 'Cerradura con código y llave', precio: [150, 400], cant: 1 },
  { id: 'valvula', n: 3, nombre: 'Válvula de corte de agua', precio: [80, 200], cant: 1 },
  { id: 'ups', n: 3, nombre: 'Batería (UPS) para router y controlador', precio: [100, 300], cant: 1 },
  { id: 'sirena', n: 3, nombre: 'Sirena y alarma integrada', precio: [50, 150], cant: 1 },
  { id: 'boton', n: 3, nombre: 'Botón de ayuda para adulto mayor', precio: [30, 80], cant: 1 },
  { id: 'riego', n: 3, nombre: 'Riego automático del jardín', precio: [100, 300], cant: 1 },
  { id: 'solar', n: 3, nombre: 'Paneles solares (3–5 kWp) e inversor', precio: [3000, 10000], cant: 1 },
];

// Cada paso: qué equipo cambia (dev), a qué estado, texto, nivel mínimo y si necesita internet.
// estado: 'alerta' | 'on' | 'off' | 'cerrado' | 'ok'. sala: sala que se ilumina o apaga.
export const ESCENAS = [
  { id: 'agua', titulo: 'Pérdida de agua', ico: '💧', resumen: 'Se rompe la manguera del lavarropas.', pasos: [
    { dev: 'agua', estado: 'alerta', n: 1, texto: 'El sensor del lavadero detecta agua en el piso.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Te llega un aviso: “Hay agua en el lavadero”.' },
    { dev: 'valvula', estado: 'cerrado', n: 3, texto: 'La válvula cierra sola la entrada de agua de la casa.' },
    { dev: 'sirena', estado: 'alerta', n: 3, texto: 'Suena un aviso dentro de la casa por si hay alguien.' },
  ], sin: 'Con el nivel básico te enterás enseguida, pero alguien tiene que ir a cerrar la llave.' },
  { id: 'humo', titulo: 'Humo en la cocina', ico: '🔥', resumen: 'Algo se quema en la hornalla.', pasos: [
    { dev: 'humo', estado: 'alerta', n: 1, texto: 'El detector suena y manda un aviso.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Aviso a vos y a otro familiar: “Humo en la cocina”.' },
    { dev: 'luces', estado: 'on', sala: 'todas', n: 2, texto: 'Se prenden todas las luces para salir rápido.' },
    { dev: 'sirena', estado: 'alerta', n: 3, texto: 'La sirena se activa en toda la casa.' },
  ], sin: 'Sin controlador las luces no se prenden solas, pero el aviso llega igual.' },
  { id: 'salir', titulo: 'Me voy de casa', ico: '🚪', resumen: 'Sale el último de la familia.', pasos: [
    { dev: 'puerta', estado: 'ok', n: 1, texto: 'El sensor registra que se cerró la puerta.' },
    { dev: 'enchufe', estado: 'off', n: 1, texto: 'El termotanque pasa a modo ahorro.' },
    { dev: 'ventana', estado: 'alerta', n: 2, red: true, texto: 'Aviso: “Quedó abierta la ventana del dormitorio”.' },
    { dev: 'luces', estado: 'off', sala: 'todas', n: 2, texto: 'Se apagan las luces que quedaron prendidas.' },
    { dev: 'cerradura', estado: 'cerrado', n: 2, texto: 'La cerradura se traba.' },
    { dev: 'camara', estado: 'on', n: 2, texto: 'La cámara de la entrada empieza a grabar en casa, no en la nube.' },
    { dev: 'sirena', estado: 'ok', n: 3, texto: 'La alarma queda armada.' },
  ] },
  { id: 'tormenta', titulo: 'Alerta de tormenta', ico: '⛈️', resumen: 'El municipio emite una alerta de lluvia fuerte.', pasos: [
    { dev: 'controlador', estado: 'alerta', n: 2, red: true, texto: 'El controlador recibe la alerta oficial de lluvia fuerte.' },
    { dev: 'ventana', estado: 'alerta', n: 2, red: true, texto: 'Aviso: “Cerrá la ventana del dormitorio antes de la tormenta”.' },
    { dev: 'riego', estado: 'off', n: 3, texto: 'Se suspende el riego de esta noche y de mañana.' },
    { dev: 'ups', estado: 'ok', n: 3, texto: 'La batería queda lista por si se corta la luz.' },
  ], sin: 'En el nivel básico la alerta llega solo por los canales del municipio (radio, WhatsApp).' },
  { id: 'corte', titulo: 'Corte de luz', ico: '🔌', resumen: 'Se corta la luz durante dos horas.', pasos: [
    { dev: 'luces', estado: 'off', sala: 'todas', n: 1, texto: 'Se apaga todo lo que depende de la red eléctrica.' },
    { dev: 'ups', estado: 'on', n: 3, texto: 'La batería mantiene funcionando el router y el controlador.' },
    { dev: 'telefono', estado: 'alerta', n: 3, red: true, texto: 'Aviso a los 30 minutos: “Sin luz: la heladera está apagada”.' },
    { dev: 'luces', estado: 'on', sala: 'living', n: 2, texto: 'Al volver la luz, todo se enciende de a poco para no saltar la térmica.' },
  ], sin: 'Sin batería todo se apaga y el sistema vuelve solo cuando vuelve la luz.' },
  { id: 'noche', titulo: 'Llega la noche', ico: '🌙', resumen: 'Se pone el sol.', pasos: [
    { dev: 'enchufe', estado: 'on', sala: 'living', n: 1, texto: 'La lámpara del living se prende con el atardecer.' },
    { dev: 'luces', estado: 'on', sala: 'cocina', n: 2, texto: 'Se prende la luz de la cocina mientras hay movimiento.' },
    { dev: 'luces', estado: 'off', sala: 'todas', n: 2, texto: 'A las 23:30 se apaga todo lo que quedó prendido.' },
    { dev: 'sirena', estado: 'ok', n: 3, texto: 'Queda armada la alarma de puertas y ventanas.' },
  ] },
  { id: 'mayor', titulo: 'Abuela sin movimiento', ico: '👵', resumen: 'Una persona mayor vive sola y hoy no se levantó a la hora de siempre.', pasos: [
    { dev: 'movimiento', estado: 'alerta', n: 2, texto: 'A las 10 no hubo movimiento en la cocina, como todos los días.' },
    { dev: 'telefono', estado: 'alerta', n: 2, red: true, texto: 'Aviso a un familiar (ella lo autorizó): “Hoy no hubo actividad en la cocina”.' },
    { dev: 'boton', estado: 'ok', n: 3, texto: 'Si aprieta el botón de ayuda, llama al familiar o a emergencias.' },
  ], sin: 'Sin cámaras en dormitorios ni baños: solo se mira si hubo movimiento, no qué se hace.' },
  { id: 'sol', titulo: 'Sol al mediodía', ico: '☀️', resumen: 'Los paneles producen más de lo que consume la casa.', pasos: [
    { dev: 'solar', estado: 'on', n: 3, texto: 'Los paneles generan más energía de la que se usa.' },
    { dev: 'medidor', estado: 'on', n: 2, texto: 'El medidor muestra el excedente en tiempo real.' },
    { dev: 'enchufe', estado: 'on', n: 3, texto: 'Se enciende el termotanque para aprovechar el sol.' },
  ] },
];

export const RED = { telefono: 'Celular', controlador: 'Controlador' };

/** Qué pasa en una escena según el nivel elegido y si hay internet. */
export function planificar(escenaId, nivel, internet = true) {
  const e = ESCENAS.find((x) => x.id === escenaId);
  if (!e) throw new Error(`Escena desconocida: ${escenaId}`);
  return e.pasos.map((p) => {
    const incluido = nivel >= p.n;
    const enCola = incluido && p.red && !internet && p.dev !== 'controlador';
    const sinSenal = incluido && p.red && !internet && p.dev === 'controlador';
    return { ...p, incluido, enCola, sinSenal, ejecuta: incluido && !sinSenal };
  });
}

/** Rango de precio de una lista de equipos. */
export function costo(ids) {
  return EQUIPOS.filter((q) => ids.includes(q.id))
    .reduce(([a, b], q) => [a + q.precio[0] * q.cant, b + q.precio[1] * q.cant], [0, 0]);
}

/** Equipos incluidos hasta un nivel (acumulativo). */
export const equiposNivel = (nivel) => EQUIPOS.filter((q) => q.n <= nivel).map((q) => q.id);

/** Cuántos pasos de todas las escenas puede hacer un conjunto de equipos. */
export function cobertura(ids) {
  const usa = new Set(ids);
  if (ids.length) usa.add('telefono');
  const pasos = ESCENAS.flatMap((e) => e.pasos);
  return { cubiertos: pasos.filter((p) => usa.has(p.dev)).length, total: pasos.length };
}
