// Datos del Proyecto LSM 2026–2031. Montos en dólares estadounidenses (USD) de 2026.
// Son estimaciones de orden de magnitud para decidir y pedir cotizaciones, no un pliego.
// Supuestos: ~9.500 habitantes, ~3.500 hogares, ~2.000 puntos de luz, ~10,5 km de calles a pavimentar.

export const SUPUESTOS = { habitantes: 9500, hogares: 3500, luminarias: 2000, anios: 5, gestion: 0.10 };

export const AREAS = {
  con: 'Conectividad',
  dat: 'Datos y servicios',
  amb: 'Energía y ambiente',
  seg: 'Seguridad',
  rob: 'Robótica y mantenimiento',
  ges: 'Gestión y ciberseguridad',
};

// capex/opex: [mínimo, máximo] en USD. opex = por año. null = no presupuestado (condicionado o a cotizar).
export const PARTIDAS = [
  { id: 'c1', area: 'con', nombre: 'Ductos en las 105 cuadras a pavimentar (“zanja única”)', detalle: '~10,5 km de tritubo y cámaras cada 100 m, mientras la calle está abierta.', capex: [105000, 210000], opex: [0, 0] },
  { id: 'c2', area: 'con', nombre: 'Anillo troncal de fibra municipal hasta Puiggari', detalle: '~18 km, aéreo en postes existentes y en los ductos nuevos. Red neutra: la usan LAR y otros proveedores.', capex: [150000, 280000], opex: [8000, 15000] },
  { id: 'c3', area: 'con', nombre: 'Nodo central y sala técnica', detalle: 'Equipos de núcleo, energía de respaldo (UPS y solar), climatización, doble salida a internet.', capex: [40000, 80000], opex: [5000, 10000] },
  { id: 'c4', area: 'con', nombre: 'Wi-Fi 6 en 8 espacios públicos', detalle: 'Plazas, terminal, CIC, polideportivo. Con portal sin pedir DNI.', capex: [16000, 32000], opex: [3000, 6000] },
  { id: 'c5', area: 'con', nombre: 'Red LoRaWAN para sensores', detalle: '4 gateways y servidor de red de código abierto. Cubre todo el ejido.', capex: [8000, 16000], opex: [1000, 3000] },
  { id: 'd1', area: 'dat', nombre: 'Plataforma urbana de datos y gemelo digital', detalle: 'Código abierto (FIWARE), tablero municipal, datos abiertos, modelo 3D de la ciudad. Con la UAP.', capex: [120000, 250000], opex: [25000, 50000] },
  { id: 'd2', area: 'dat', nombre: 'Portal y app vecinal', detalle: 'Reclamos con foto, turnos, pago de tasas, alertas por WhatsApp, guía turística en 6 idiomas.', capex: [60000, 120000], opex: [12000, 25000] },
  { id: 'e1', area: 'amb', nombre: 'Alumbrado LED con telegestión', detalle: '~2.000 puntos de luz con nodo de control: encendido por horario y presencia, aviso automático de fallas.', capex: [620000, 1140000], opex: [10000, 20000] },
  { id: 'e2', area: 'amb', nombre: 'Sensores de agua, lluvia, aire y ruido', detalle: '150 sensores en un piloto: anegamiento en esquinas críticas, nivel de tanques, pérdidas, calidad de aire.', capex: [25000, 60000], opex: [3000, 6000] },
  { id: 'e3', area: 'amb', nombre: 'Riego inteligente', detalle: '15 zonas en plazas y bulevares con humedad de suelo y pronóstico: se riega solo cuando hace falta.', capex: [15000, 45000], opex: [2000, 4000] },
  { id: 's1', area: 'seg', nombre: 'Modernización del centro de monitoreo', detalle: 'Software de video abierto, 30 días de grabación, redundancia y red de cámaras separada de internet.', capex: [80000, 150000], opex: [15000, 30000] },
  { id: 's2', area: 'seg', nombre: '60 cámaras en los barrios nuevos', detalle: 'Altos de Libertador, Camarero, Puiggari y los accesos, sobre la fibra nueva.', capex: [40000, 90000], opex: [6000, 12000] },
  { id: 's3', area: 'seg', nombre: 'Lectoras de patentes en los accesos', detalle: '12 cámaras en 6 accesos (Ruta 131 este y oeste, Puiggari y caminos rurales). Alerta de vehículos con pedido de secuestro.', capex: [16000, 89000], opex: [8000, 35000] },
  { id: 's4', area: 'seg', nombre: 'Analítica de video sin identificar personas', detalle: 'Detecta eventos (caída, merodeo nocturno, objeto abandonado, calle anegada) y cuenta personas sin reconocerlas.', capex: [20000, 50000], opex: [5000, 10000] },
  { id: 's5', area: 'seg', nombre: 'Búsqueda forense de rostros', detalle: 'No presupuestada. Solo si una ley la habilita y siempre con orden judicial, sobre grabaciones y nunca en vivo.', capex: null, opex: null },
  { id: 'r1', area: 'rob', nombre: 'Robots cortacésped', detalle: '6 robots autónomos para plazas y parques, de noche y sin ruido.', capex: [18000, 48000], opex: [2000, 5000] },
  { id: 'r2', area: 'rob', nombre: 'Drones de inspección', detalle: '2 drones para revisar luminarias, desagües, techos públicos y avance de obras.', capex: [6000, 16000], opex: [1000, 3000] },
  { id: 'r3', area: 'rob', nombre: 'Detección automática de baches', detalle: 'Cámaras en vehículos municipales que marcan baches y carteles dañados en el mapa.', capex: [8000, 20000], opex: [2000, 5000] },
  { id: 'r4', area: 'rob', nombre: 'Barredora autónoma eléctrica (servicio)', detalle: 'Piloto nocturno en el centro contratado como servicio, como hace Porvoo (Finlandia). A cotizar.', capex: null, opex: null },
  { id: 'g1', area: 'ges', nombre: 'Ciberseguridad continua', detalle: 'Monitoreo de seguridad tercerizado, prueba de intrusión anual, copias cifradas fuera del municipio.', capex: [15000, 30000], opex: [25000, 45000] },
];

// Cronograma: trimestres desde 2027-T1 (0) hasta 2031-T4 (19). [inicio, fin] inclusive.
export const INICIO = 2027;
export const CRONOGRAMA = [
  { fase: 0, nombre: 'Diagnóstico, ordenanza de datos y mesa de gobernanza', t: [0, 1] },
  { fase: 1, nombre: 'Ductos con cada cuadra que se pavimenta', t: [1, 15] },
  { fase: 1, nombre: 'Anillo de fibra y nodo central', t: [2, 6] },
  { fase: 1, nombre: 'Red de cámaras separada y centro de monitoreo', t: [2, 5] },
  { fase: 1, nombre: 'LoRaWAN y Wi-Fi en espacios públicos', t: [3, 5] },
  { fase: 2, nombre: 'Alumbrado LED con telegestión (por barrios)', t: [4, 11] },
  { fase: 2, nombre: 'Lectoras de patentes y cámaras en barrios nuevos', t: [5, 8] },
  { fase: 2, nombre: 'Sensores de agua y lluvia (piloto) y alertas', t: [5, 9] },
  { fase: 2, nombre: 'Portal y app vecinal, datos abiertos', t: [4, 9] },
  { fase: 3, nombre: 'Plataforma de datos y gemelo digital con la UAP', t: [6, 14] },
  { fase: 3, nombre: 'Riego inteligente, robots cortacésped y drones', t: [9, 13] },
  { fase: 3, nombre: 'Servicios con sanatorio, geriátricos y turismo', t: [10, 15] },
  { fase: 4, nombre: 'Barredora autónoma (piloto como servicio)', t: [14, 17] },
  { fase: 4, nombre: 'Auditoría externa y certificación ISO 37122', t: [16, 19] },
];

// Puntos reales (coordenadas de Google Maps, noviembre 2026).
export const LUGARES = {
  municipio: { n: 'Municipalidad y centro de monitoreo', c: [-32.0762705, -60.464836] },
  terminal: { n: 'Terminal de ómnibus', c: [-32.0766624, -60.4656479] },
  plaza: { n: 'Plaza San Martín', c: [-32.0763233, -60.4658448] },
  uap: { n: 'Universidad Adventista del Plata', c: [-32.0755531, -60.4651391] },
  sanatorio: { n: 'Sanatorio Adventista del Plata', c: [-32.0741142, -60.4631123] },
  cavs: { n: 'Centro Adventista de Vida Sana', c: [-32.0732398, -60.4624092] },
  cic: { n: 'CIC Libertador San Martín', c: [-32.065907, -60.4540005] },
  altos: { n: 'Plaza Altos de Libertador', c: [-32.0646429, -60.4487276] },
  puiggari: { n: 'Plazoleta Dr. Miguel Puiggari', c: [-32.0548535, -60.4476691] },
};

export const CAPAS = {
  fibra: ['municipio', 'terminal', 'plaza', 'uap', 'sanatorio', 'cavs', 'cic', 'altos', 'puiggari'],
  wifi: ['plaza', 'terminal', 'cic', 'altos', 'puiggari'],
  lora: ['municipio', 'cic', 'puiggari', 'sanatorio'],
};

export const METAS = [
  ['100 %', 'de los hogares con fibra de 1 Gbps disponible'],
  ['−60 %', 'de energía en alumbrado público'],
  ['100 %', 'del ejido con cobertura de sensores'],
  ['72 h', 'para resolver el 80 % de los reclamos'],
  ['90 %', 'de los trámites municipales en línea'],
  ['10 min', 'para avisar un anegamiento'],
  ['50', 'conjuntos de datos abiertos actualizados'],
  ['0', 'incidentes de datos personales, con auditoría anual'],
];

const suma = (lista, k, i) => lista.reduce((t, p) => t + (p[k] ? p[k][i] : 0), 0);

export function totales(partidas = PARTIDAS, s = SUPUESTOS) {
  const base = [suma(partidas, 'capex', 0), suma(partidas, 'capex', 1)];
  const gestion = base.map((v) => Math.round(v * s.gestion));
  const capex = base.map((v, i) => v + gestion[i]);
  const opex = [suma(partidas, 'opex', 0), suma(partidas, 'opex', 1)];
  const porArea = Object.fromEntries(Object.keys(AREAS).map((a) => {
    const ps = partidas.filter((p) => p.area === a);
    return [a, [suma(ps, 'capex', 0), suma(ps, 'capex', 1)]];
  }));
  return {
    base, gestion, capex, opex, porArea,
    porHabitante: capex.map((v) => Math.round(v / s.habitantes)),
    porHabitanteAnio: capex.map((v) => Math.round(v / s.habitantes / s.anios)),
  };
}
