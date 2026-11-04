// Datos del simulador, configurador y catálogo de la casa inteligente (LSM Smart Home 360).
// Precios: referencias internacionales en USD de 2026, orientativos. Se editan acá y el sitio se actualiza.

export const NIVELES = {
  1: { nombre: 'Avisos', detalle: 'Te enterás de lo importante. Sin obra.' },
  2: { nombre: 'Confort', detalle: 'Luces, cortinas, clima y presencia automáticos.' },
  3: { nombre: 'Eficiencia', detalle: 'Mide agua y energía, riega solo, cuida el aire.' },
  4: { nombre: 'Protección', detalle: 'Cerraduras, cámaras, alarma y cortes automáticos.' },
  5: { nombre: 'Autonomía', detalle: 'Energía propia, robots y cuidado de personas.' },
};

export const CATEGORIAS = {
  seguridad: 'Seguridad', agua: 'Agua', energia: 'Energía', clima: 'Clima y aire', luz: 'Luz y cortinas',
  presencia: 'Presencia y cuidado', accesos: 'Accesos', mascotas: 'Mascotas', robots: 'Robots', control: 'Control y red', exterior: 'Exterior',
};

// n: nivel desde el que se incluye. p: precio unitario [mín, máx]. c: cantidad típica.
export const EQUIPOS = [
  { id: 'hub', ico: '📡', nombre: 'Puente de sensores', cat: 'control', n: 1, p: [30, 60], c: 1, proto: 'Zigbee / Thread', que: 'Conecta los sensores a pila con la casa.' },
  { id: 'humo', ico: '🔥', nombre: 'Detector de humo', cat: 'seguridad', n: 1, p: [20, 50], c: 1, proto: 'Zigbee', que: 'Suena y avisa al celular si detecta humo.' },
  { id: 'co', ico: '☁️', nombre: 'Detector de monóxido (CO)', cat: 'seguridad', n: 1, p: [25, 60], c: 1, proto: 'Zigbee', que: 'Detecta el gas invisible de estufas y calefones mal ventilados.' },
  { id: 'agua', ico: '💧', nombre: 'Sensor de pérdida de agua', cat: 'agua', n: 1, p: [15, 40], c: 2, proto: 'Zigbee', que: 'Avisa si hay agua en el piso del lavadero o el baño.' },
  { id: 'puerta', ico: '🚪', nombre: 'Sensor de puerta', cat: 'accesos', n: 1, p: [15, 40], c: 1, proto: 'Zigbee', que: 'Sabe si la puerta de entrada está abierta o cerrada.' },
  { id: 'enchufe', ico: '🔌', nombre: 'Enchufe inteligente con medición', cat: 'energia', n: 1, p: [15, 60], c: 2, proto: 'Matter / Wi-Fi', que: 'Prende, apaga y mide termotanque, cafetera o lámpara.' },
  { id: 'controlador', ico: '🧠', nombre: 'Controlador local', cat: 'control', n: 2, p: [100, 300], c: 1, proto: 'Home Assistant', que: 'El cerebro de la casa: automatiza todo sin depender de la nube.' },
  { id: 'luces', ico: '💡', nombre: 'Lámparas inteligentes', cat: 'luz', n: 2, p: [10, 35], c: 8, proto: 'Matter / Zigbee', que: 'Encienden por horario, presencia o escena; regulan intensidad y color.' },
  { id: 'cortinas', ico: '🪟', nombre: 'Cortinas y persianas motorizadas', cat: 'luz', n: 2, p: [80, 250], c: 3, proto: 'Zigbee / Matter', que: 'Suben con el sol, bajan con calor o tormenta.' },
  { id: 'presencia', ico: '🧍', nombre: 'Sensor de presencia (radar)', cat: 'presencia', n: 2, p: [25, 70], c: 3, proto: 'Zigbee / Wi-Fi', que: 'Detecta personas quietas (leyendo, durmiendo), no solo movimiento.' },
  { id: 'movimiento', ico: '👋', nombre: 'Sensor de movimiento apto mascotas', cat: 'presencia', n: 2, p: [15, 50], c: 2, proto: 'Zigbee', que: 'Detecta movimiento e ignora a perros y gatos chicos.' },
  { id: 'temp', ico: '🌡️', nombre: 'Temperatura y humedad', cat: 'clima', n: 2, p: [15, 40], c: 3, proto: 'Zigbee', que: 'Mide cada ambiente para decidir cuándo usar el aire.' },
  { id: 'clima', ico: '❄️', nombre: 'Control de aire acondicionado', cat: 'clima', n: 2, p: [30, 80], c: 2, proto: 'Infrarrojo / Wi-Fi', que: 'Maneja el aire o la calefacción según temperatura y presencia.' },
  { id: 'luzamb', ico: '🌗', nombre: 'Sensor de luminosidad', cat: 'luz', n: 2, p: [15, 40], c: 1, proto: 'Zigbee', que: 'Sabe cuándo oscurece para encender luces.' },
  { id: 'escena', ico: '🎛️', nombre: 'Interruptor de 1 botón (escenas)', cat: 'control', n: 2, p: [20, 50], c: 2, proto: 'Zigbee', que: 'Un toque: “me voy”, “llegué”, “a dormir”.' },
  { id: 'comedero', ico: '🦴', nombre: 'Distribuidor de comida para mascotas', cat: 'mascotas', n: 2, p: [60, 150], c: 1, proto: 'Wi-Fi', que: 'Da raciones a horario y avisa si se trabó o se vació.' },
  { id: 'interruptores', ico: '🎚️', nombre: 'Interruptores de luz inteligentes', cat: 'luz', n: 2, p: [20, 60], c: 4, proto: 'Matter / Zigbee', que: 'Reemplazan la llave de pared: funcionan a mano y desde la app.' },
  { id: 'miniswitch', ico: '🔘', nombre: 'Mini switch detrás de la llave', cat: 'luz', n: 2, p: [10, 25], c: 4, proto: 'Zigbee / Wi-Fi', que: 'Módulo chico que se esconde en la caja de la llave y la vuelve inteligente sin cambiarla.' },
  { id: 'aproximacion', ico: '📶', nombre: 'Sensor de aproximación', cat: 'presencia', n: 2, p: [20, 60], c: 2, proto: 'Zigbee / Wi-Fi', que: 'Detecta que alguien se acerca: enciende la luz de entrada o despierta la pantalla.' },
  { id: 'pantalla', ico: '🖥️', nombre: 'Controlador con pantalla', cat: 'control', n: 2, p: [100, 300], c: 1, proto: 'Wi-Fi / Home Assistant', que: 'Panel en la pared para ver y manejar toda la casa sin el celular.' },
  { id: 'ventilador', ico: '🌀', nombre: 'Ventilador de techo inteligente', cat: 'clima', n: 2, p: [60, 200], c: 2, proto: 'Wi-Fi / RF', que: 'Se enciende por temperatura y presencia; gasta mucho menos que el aire.' },
  { id: 'multipresencia', ico: '👥', nombre: 'Sensor de multipresencia', cat: 'presencia', n: 3, p: [60, 150], c: 1, proto: 'Wi-Fi / Zigbee', que: 'Radar que distingue zonas y cuántas personas hay en un ambiente.' },
  { id: 'llavesconsumo', ico: '⚡', nombre: 'Llaves con medición de consumo', cat: 'energia', n: 3, p: [25, 70], c: 3, proto: 'Zigbee / Wi-Fi', que: 'Interruptores que además miden cuánto gasta cada circuito.' },
  { id: 'termosifon', ico: '♨️', nombre: 'Válvula y control de termosifón', cat: 'energia', n: 3, p: [80, 200], c: 1, proto: 'Zigbee / relé', que: 'Pasa el termosifón o termotanque a piloto cuando no hay nadie y lo enciende antes de que llegues.' },
  { id: 'lavarropas', ico: '🫧', nombre: 'Lavarropas conectado', cat: 'energia', n: 3, p: [20, 60], c: 1, proto: 'Wi-Fi / enchufe', que: 'Avisa cuando termina y arranca cuando sobra sol. Precio: integración o enchufe con medición.' },
  { id: 'lavavajillas', ico: '🍽️', nombre: 'Lavavajillas conectado', cat: 'energia', n: 3, p: [20, 60], c: 1, proto: 'Wi-Fi / enchufe', que: 'Programa el lavado en horario solar o de tarifa baja. Precio: integración o enchufe con medición.' },
  { id: 'ledcontorno', ico: '🌈', nombre: 'LED de contorno de la casa', cat: 'exterior', n: 3, p: [60, 200], c: 3, proto: 'Wi-Fi / Zigbee', que: 'Tira LED exterior que marca el contorno; se enciende al anochecer o en fiestas.' },
  { id: 'mirilla', ico: '👁️', nombre: 'Mirilla digital con sensor de movimiento', cat: 'accesos', n: 4, p: [80, 200], c: 1, proto: 'Wi-Fi', que: 'Pantalla del lado de adentro de la puerta: muestra quién está afuera y graba si alguien merodea.' },
  { id: 'medidor', ico: '📊', nombre: 'Medidor del tablero eléctrico', cat: 'energia', n: 3, p: [50, 150], c: 1, proto: 'Wi-Fi / Modbus', que: 'Muestra el consumo de toda la casa en tiempo real.' },
  { id: 'caudal', ico: '🚿', nombre: 'Medidor de agua', cat: 'agua', n: 3, p: [60, 180], c: 1, proto: 'Zigbee / Wi-Fi', que: 'Mide cuánta agua se usa y detecta pérdidas ocultas.' },
  { id: 'tanque', ico: '🛢️', nombre: 'Nivel del tanque de agua', cat: 'agua', n: 3, p: [40, 120], c: 1, proto: 'Zigbee / LoRa', que: 'Avisa antes de que el tanque quede vacío.' },
  { id: 'riego', ico: '🌱', nombre: 'Riego automático', cat: 'exterior', n: 3, p: [100, 300], c: 1, proto: 'Zigbee / Wi-Fi', que: 'Riega por zonas y no arranca si llovió.' },
  { id: 'suelo', ico: '🪴', nombre: 'Humedad del suelo', cat: 'exterior', n: 3, p: [15, 40], c: 2, proto: 'Zigbee', que: 'Le dice al riego si la tierra está seca.' },
  { id: 'co2', ico: '🌬️', nombre: 'Calidad del aire (CO₂ y partículas)', cat: 'clima', n: 3, p: [40, 120], c: 1, proto: 'Zigbee / Wi-Fi', que: 'Avisa cuándo ventilar un ambiente cerrado.' },
  { id: 'ventana', ico: '🔲', nombre: 'Sensor de ventana', cat: 'seguridad', n: 3, p: [15, 40], c: 4, proto: 'Zigbee', que: 'Avisa si quedó una ventana abierta antes de salir o de llover.' },
  { id: 'reflector', ico: '🔦', nombre: 'Luz exterior de patio inteligente', cat: 'exterior', n: 3, p: [40, 120], c: 2, proto: 'Zigbee / Wi-Fi', que: 'Ilumina el patio cuando alguien se acerca o al anochecer.' },
  { id: 'bebedero', ico: '⛲', nombre: 'Bebedero con nivel', cat: 'mascotas', n: 3, p: [40, 100], c: 1, proto: 'Wi-Fi', que: 'Agua siempre fresca; avisa si se vacía.' },
  { id: 'heladera', ico: '🧊', nombre: 'Heladera: temperatura y puerta', cat: 'energia', n: 3, p: [15, 40], c: 2, proto: 'Zigbee', que: 'Avisa si la heladera se corta o queda abierta.' },
  { id: 'vibracion', ico: '📳', nombre: 'Sensor de vibración', cat: 'control', n: 3, p: [15, 40], c: 2, proto: 'Zigbee', que: 'Detecta golpes en ventanas, caídas de objetos o cuándo terminó un electrodoméstico.' },
  { id: 'buzon', ico: '📬', nombre: 'Sensor de buzón', cat: 'exterior', n: 3, p: [15, 40], c: 1, proto: 'Zigbee', que: 'Te avisa cuando llegó correspondencia.' },
  { id: 'lluvia', ico: '🌧️', nombre: 'Estación meteorológica', cat: 'exterior', n: 3, p: [80, 250], c: 1, proto: 'Wi-Fi / 433 MHz', que: 'Lluvia, viento y temperatura exterior para riego y cortinas.' },
  { id: 'garrafa', ico: '⚖️', nombre: 'Nivel de garrafa de gas', cat: 'energia', n: 3, p: [40, 120], c: 1, proto: 'Wi-Fi', que: 'Pesa la garrafa y avisa antes de quedarte sin gas.' },
  { id: 'humedadpared', ico: '🧱', nombre: 'Humedad en paredes', cat: 'clima', n: 3, p: [20, 50], c: 1, proto: 'Zigbee', que: 'Detecta humedad de cimientos o filtraciones.' },
  { id: 'cerradura', ico: '🔐', nombre: 'Cerradura inteligente', cat: 'accesos', n: 4, p: [150, 400], c: 2, proto: 'Matter / Zigbee', que: 'Abre con código, celular o huella; códigos temporales para visitas. Con llave de respaldo.' },
  { id: 'camara', ico: '🎥', nombre: 'Cámara con grabación local', cat: 'seguridad', n: 4, p: [60, 250], c: 2, proto: 'ONVIF / RTSP', que: 'Graba en casa, no en la nube; no apunta a la vereda ni al vecino.' },
  { id: 'timbre', ico: '🔔', nombre: 'Timbre con cámara', cat: 'accesos', n: 4, p: [80, 250], c: 1, proto: 'Wi-Fi', que: 'Ves y hablás con quien toca, aunque no estés.' },
  { id: 'sirena', ico: '📢', nombre: 'Sistema de alarma y sirena', cat: 'seguridad', n: 4, p: [50, 150], c: 1, proto: 'Zigbee', que: 'Suena ante intrusión, humo o agua.' },
  { id: 'vidrio', ico: '🪟', nombre: 'Sensor de rotura de vidrio', cat: 'seguridad', n: 4, p: [20, 60], c: 2, proto: 'Zigbee', que: 'Detecta el sonido de un vidrio roto.' },
  { id: 'gas', ico: '🧯', nombre: 'Sensor de gas', cat: 'seguridad', n: 1, p: [30, 80], c: 1, proto: 'Zigbee', que: 'Detecta pérdida de gas natural o envasado y avisa.' },
  { id: 'valvulagas', ico: '🚱', nombre: 'Válvula motorizada de gas', cat: 'seguridad', n: 4, p: [100, 250], c: 1, proto: 'Zigbee', que: 'Cierra el gas de la casa ante una pérdida. La instala un gasista matriculado.' },
  { id: 'valvula', ico: '🚰', nombre: 'Válvula de corte de agua', cat: 'agua', n: 4, p: [80, 200], c: 1, proto: 'Zigbee', que: 'Cierra el agua de toda la casa ante una pérdida.' },
  { id: 'porton', ico: '🚘', nombre: 'Motor de portón', cat: 'accesos', n: 4, p: [250, 600], c: 1, proto: 'Wi-Fi / relé', que: 'Abre desde el celular o al llegar; avisa si quedó abierto.' },
  { id: 'puertamascota', ico: '🐾', nombre: 'Puerta para mascotas con chip', cat: 'mascotas', n: 4, p: [150, 400], c: 1, proto: 'RFID', que: 'Solo abre para tu mascota.' },
  { id: 'ups', ico: '🔋', nombre: 'UPS para router y controlador', cat: 'control', n: 4, p: [100, 300], c: 1, proto: '—', que: 'Mantiene internet y avisos durante un corte de luz.' },
  { id: 'solar', ico: '☀️', nombre: 'Paneles solares (3–5 kWp)', cat: 'energia', n: 5, p: [3000, 10000], c: 1, proto: 'Modbus / Wi-Fi', que: 'Genera parte de la energía de la casa.' },
  { id: 'bateria', ico: '🔋', nombre: 'Batería de la casa', cat: 'energia', n: 5, p: [3000, 8000], c: 1, proto: 'Modbus', que: 'Guarda energía del sol y sostiene la casa en cortes.' },
  { id: 'ev', ico: '🚗', nombre: 'Cargador de auto eléctrico', cat: 'energia', n: 5, p: [500, 1200], c: 1, proto: 'OCPP / Wi-Fi', que: 'Carga cuando sobra sol o la tarifa es más baja.' },
  { id: 'aspiradora', ico: '🤖', nombre: 'Robot de limpieza (aspira y friega)', cat: 'robots', n: 5, p: [200, 800], c: 1, proto: 'Wi-Fi / Matter', que: 'Limpia cuando no hay nadie y vuelve solo a cargar.' },
  { id: 'cortacesped', ico: '🚜', nombre: 'Robot cortacésped', cat: 'robots', n: 5, p: [600, 2000], c: 1, proto: 'Wi-Fi / RTK', que: 'Corta el pasto solo, en zonas y horarios definidos.' },
  { id: 'boton', ico: '🆘', nombre: 'Botón de ayuda', cat: 'presencia', n: 5, p: [30, 80], c: 1, proto: 'Zigbee', que: 'Pide ayuda a un familiar o a emergencias con un toque.' },
  { id: 'caida', ico: '🛟', nombre: 'Sensor de caídas (radar)', cat: 'presencia', n: 5, p: [150, 400], c: 1, proto: 'Wi-Fi', que: 'Detecta una caída sin cámaras, útil en baños.' },
  { id: 'cama', ico: '🛏️', nombre: 'Sensor de cama', cat: 'presencia', n: 5, p: [50, 150], c: 1, proto: 'Zigbee', que: 'Sabe si alguien se levantó o sigue acostado.' },
  { id: 'collar', ico: '📍', nombre: 'Collar con GPS', cat: 'mascotas', n: 5, p: [50, 150], c: 1, proto: 'LTE / LoRa', que: 'Avisa si tu mascota sale del terreno.' },
  { id: 'voz', ico: '🗣️', nombre: 'Asistente de voz local', cat: 'control', n: 5, p: [60, 200], c: 1, proto: 'Home Assistant', que: 'Responde y controla la casa sin mandar tu voz a internet.' },
  { id: 'pileta', ico: '🏊', nombre: 'Sensor de pileta (cloro y pH)', cat: 'agua', n: 5, p: [100, 300], c: 1, proto: 'Wi-Fi', que: 'Mide cloro, pH y temperatura del agua.' },
  { id: 'bomba', ico: '⚙️', nombre: 'Control de bomba', cat: 'agua', n: 5, p: [80, 200], c: 1, proto: 'Relé / Wi-Fi', que: 'Maneja la bomba del pozo o de la pileta con horarios y protección.' },
  { id: 'starlink', ico: '🛰️', nombre: 'Internet satelital de respaldo', cat: 'control', n: 5, p: [400, 700], c: 1, proto: 'Ethernet', que: 'Segunda salida a internet para lugares sin fibra (plan mensual aparte).' },
];

/* ---------- Tipos de casa: plano, exterior y dónde va cada equipo ---------- */
// salas: [id, nombre, x, y, w, h, tipo]; tipo: 'in' interior, 'ext' exterior, 'com' espacio común.
// equipos: sala → lista de equipos. deco: elementos del dibujo exterior.
export const TIPOS = [
  {
    id: 'casa', nombre: 'Casa en barrio', desc: 'Una planta, frente con jardín y garage.', ico: '🏡',
    salas: [['living', 'Living', 30, 30, 300, 190, 'in'], ['cocina', 'Cocina', 330, 30, 190, 190, 'in'], ['lavadero', 'Lavadero', 520, 30, 150, 95, 'in'], ['bano', 'Baño', 520, 125, 150, 95, 'in'],
      ['dorm', 'Dormitorio', 30, 220, 230, 170, 'in'], ['estudio', 'Estudio', 260, 220, 200, 170, 'in'], ['garage', 'Garage', 460, 220, 210, 170, 'ext'],
      ['frente', 'Frente', 30, 390, 640, 75, 'ext'], ['lateral', 'Patio', 680, 30, 70, 435, 'ext']],
    equipos: { living: ['luces', 'presencia', 'clima', 'cortinas', 'movimiento', 'sirena', 'vidrio', 'voz', 'luzamb', 'escena', 'interruptores', 'miniswitch', 'pantalla', 'multipresencia'], cocina: ['humo', 'co', 'gas', 'heladera', 'enchufe', 'comedero', 'bebedero', 'co2', 'valvulagas', 'llavesconsumo', 'lavavajillas'],
      lavadero: ['agua', 'valvula', 'caudal', 'vibracion', 'lavarropas'], bano: ['temp', 'caida', 'humedadpared', 'termosifon'], dorm: ['cama', 'ventana', 'boton', 'ventilador', 'aproximacion'], estudio: ['controlador', 'hub', 'ups', 'medidor', 'bateria', 'aspiradora'],
      garage: ['porton', 'ev', 'cortacesped', 'garrafa'], frente: ['timbre', 'camara', 'puerta', 'cerradura', 'reflector', 'riego', 'suelo', 'buzon', 'collar', 'puertamascota', 'mirilla'], lateral: ['solar', 'tanque', 'lluvia', 'ledcontorno'] },
    deco: [{ k: 'calle' }, { k: 'arbol', x: 716, y: 345, r: 18 }, { k: 'auto', x: 585, y: 330 }, { k: 'cucha', x: 716, y: 425 }, { k: 'porton', x: 470, y: 465, w: 190 }],
  },
  {
    id: 'depto', nombre: 'Departamento', desc: 'Dos ambientes en un edificio, con balcón.', ico: '🏢',
    salas: [['pasillo', 'Pasillo del edificio', 30, 30, 140, 435, 'com'], ['living', 'Living comedor', 170, 30, 330, 230, 'in'], ['cocina', 'Cocina', 500, 30, 220, 140, 'in'], ['lavadero', 'Lavadero', 500, 170, 220, 90, 'in'],
      ['dorm', 'Dormitorio', 170, 260, 230, 205, 'in'], ['bano', 'Baño', 400, 260, 120, 205, 'in'], ['balcon', 'Balcón', 520, 260, 200, 205, 'ext']],
    equipos: { pasillo: ['timbre', 'cerradura', 'puerta', 'mirilla', 'aproximacion'], living: ['luces', 'presencia', 'clima', 'cortinas', 'movimiento', 'sirena', 'voz', 'escena', 'luzamb', 'controlador', 'hub', 'ups', 'aspiradora', 'medidor', 'interruptores', 'miniswitch', 'pantalla', 'multipresencia', 'ventilador'],
      cocina: ['humo', 'co', 'gas', 'heladera', 'enchufe', 'comedero', 'bebedero', 'co2', 'valvulagas', 'llavesconsumo', 'lavavajillas'], lavadero: ['agua', 'valvula', 'caudal', 'vibracion', 'lavarropas'], dorm: ['cama', 'ventana', 'temp', 'boton'], bano: ['caida', 'humedadpared', 'termosifon'],
      balcon: ['camara', 'riego', 'suelo', 'lluvia', 'vidrio', 'ledcontorno'] },
    deco: [{ k: 'calle' }, { k: 'macetas', x: 560, y: 420 }],
  },
  {
    id: 'pileta', nombre: 'Casa con pileta', desc: 'Barrio privado o country: pileta, quincho y parque.', ico: '🏊',
    salas: [['living', 'Living', 30, 30, 260, 180, 'in'], ['cocina', 'Cocina', 290, 30, 170, 180, 'in'], ['bano', 'Baño', 460, 30, 110, 90, 'in'], ['lavadero', 'Lavadero', 460, 120, 110, 90, 'in'],
      ['dorm', 'Dormitorio', 30, 210, 200, 150, 'in'], ['dorm2', 'Dormitorio 2', 230, 210, 170, 150, 'in'], ['estudio', 'Estudio', 400, 210, 170, 150, 'in'], ['garage', 'Garage doble', 570, 30, 180, 330, 'ext'],
      ['parque', 'Parque', 30, 360, 380, 105, 'ext'], ['piscina', 'Pileta', 410, 360, 200, 105, 'ext'], ['quincho', 'Quincho', 610, 360, 140, 105, 'ext']],
    equipos: { living: ['luces', 'presencia', 'clima', 'cortinas', 'movimiento', 'sirena', 'vidrio', 'voz', 'interruptores', 'miniswitch', 'pantalla', 'multipresencia'], cocina: ['humo', 'co', 'gas', 'heladera', 'enchufe', 'co2', 'comedero', 'bebedero', 'valvulagas', 'llavesconsumo', 'lavavajillas'], bano: ['caida', 'humedadpared', 'termosifon'], lavadero: ['agua', 'valvula', 'vibracion', 'lavarropas'],
      dorm: ['cama', 'ventana', 'boton'], dorm2: ['temp', 'luzamb', 'escena', 'ventilador', 'aproximacion'], estudio: ['controlador', 'hub', 'ups', 'medidor', 'bateria', 'aspiradora'], garage: ['porton', 'ev', 'timbre', 'cerradura', 'puerta', 'camara', 'garrafa', 'buzon', 'lluvia', 'caudal', 'mirilla'],
      parque: ['riego', 'suelo', 'cortacesped', 'reflector', 'collar', 'puertamascota'], piscina: ['pileta', 'bomba'], quincho: ['solar', 'tanque', 'ledcontorno'] },
    deco: [{ k: 'calle' }, { k: 'agua', x: 562, y: 372, w: 42, h: 86 }, { k: 'auto', x: 582, y: 312 }, { k: 'auto', x: 666, y: 312 }, { k: 'perro', x: 380, y: 448, s: 0.8 }, { k: 'porton', x: 580, y: 465, w: 160 }],
  },
  {
    id: 'campo', nombre: 'Casa de campo', desc: 'Zona rural: pozo, tanque, galpón y Starlink.', ico: '🌾',
    salas: [['living', 'Living', 30, 30, 250, 170, 'in'], ['cocina', 'Cocina', 280, 30, 170, 170, 'in'], ['bano', 'Baño', 450, 30, 110, 85, 'in'], ['lavadero', 'Lavadero', 450, 115, 110, 85, 'in'],
      ['dorm', 'Dormitorio', 30, 200, 220, 150, 'in'], ['estudio', 'Estudio', 250, 200, 200, 150, 'in'], ['galpon', 'Galpón', 450, 200, 140, 150, 'ext'],
      ['patio', 'Patio y huerta', 30, 350, 560, 115, 'ext'], ['pozo', 'Pozo y tanque', 600, 30, 150, 170, 'ext'], ['tranquera', 'Tranquera', 600, 200, 150, 265, 'ext']],
    equipos: { living: ['luces', 'presencia', 'clima', 'cortinas', 'movimiento', 'sirena', 'voz', 'vidrio', 'interruptores', 'miniswitch', 'pantalla', 'multipresencia'], cocina: ['humo', 'co', 'gas', 'garrafa', 'heladera', 'enchufe', 'comedero', 'valvulagas', 'llavesconsumo', 'lavavajillas'], bano: ['caida', 'temp', 'termosifon'], lavadero: ['agua', 'valvula', 'caudal', 'lavarropas'],
      dorm: ['cama', 'ventana', 'boton', 'ventilador', 'aproximacion'], estudio: ['controlador', 'hub', 'ups', 'medidor', 'starlink', 'bateria'], galpon: ['ev', 'cortacesped', 'aspiradora', 'solar'],
      patio: ['riego', 'suelo', 'reflector', 'collar', 'puertamascota', 'bebedero', 'lluvia', 'humedadpared', 'ledcontorno'], pozo: ['tanque', 'bomba'], tranquera: ['porton', 'camara', 'timbre', 'cerradura', 'puerta', 'buzon', 'mirilla'] },
    deco: [{ k: 'camino' }, { k: 'tanqueAlto', x: 715, y: 140 }, { k: 'arbol', x: 728, y: 445, r: 13 }, { k: 'huerta', x: 470, y: 400, w: 110, h: 46 }, { k: 'cucha', x: 120, y: 448 }, { k: 'porton', x: 610, y: 465, w: 130 }],
  },
];

/* ---------- Situaciones ---------- */
// Paso: dev (equipo o 'telefono'), estado ('alerta'|'on'|'off'|'cerrado'|'ok'), n (nivel mínimo), texto (registro).
// red: necesita internet. msg: texto del mensaje en el celular. resp: respuestas rápidas. sala: luces que cambian.
export const ESCENAS = [
  { id: 'agua', titulo: 'Pérdida de agua', ico: '💧', resumen: 'Se rompe la manguera del lavarropas.', pasos: [
    { dev: 'agua', estado: 'alerta', n: 1, texto: 'El sensor del lavadero detecta agua en el piso.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Te llega un mensaje.', msg: '💧 Hay agua en el piso del lavadero.', resp: ['Cerrar la llave', 'Ya voy'] },
    { dev: 'valvula', estado: 'cerrado', n: 4, texto: 'La válvula cierra sola el agua de toda la casa.' },
    { dev: 'caudal', estado: 'ok', n: 3, texto: 'El medidor confirma que el agua dejó de correr.' },
    { dev: 'sirena', estado: 'alerta', n: 4, texto: 'Suena un aviso dentro de la casa por si hay alguien.' },
  ], sin: 'Sin válvula, te enterás enseguida pero alguien tiene que cerrar la llave a mano.' },
  { id: 'humo', titulo: 'Humo en la cocina', ico: '🔥', resumen: 'Se quema algo en la hornalla.', pasos: [
    { dev: 'humo', estado: 'alerta', n: 1, texto: 'El detector suena.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Mensaje a vos y a otro familiar.', msg: '🔥 Hay humo en la cocina. ¿Está todo bien?', resp: ['Fue la comida', 'Llamar al 100'] },
    { dev: 'luces', estado: 'on', sala: 'todas', n: 2, texto: 'Se prenden todas las luces para salir rápido.' },
    { dev: 'clima', estado: 'off', n: 2, texto: 'Se apaga el aire para no esparcir el humo.' },
    { dev: 'cerradura', estado: 'ok', n: 4, texto: 'La cerradura se destraba para salir sin buscar la llave.' },
    { dev: 'sirena', estado: 'alerta', n: 4, texto: 'La sirena suena en toda la casa.' },
  ] },
  { id: 'gas', titulo: 'Pérdida de gas', ico: '🧯', resumen: 'Quedó una hornalla abierta sin llama.', pasos: [
    { dev: 'gas', estado: 'alerta', n: 1, texto: 'El sensor de gas detecta la pérdida.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Mensaje urgente.', msg: '🧯 Hay olor a gas en la cocina. Cerrá la llave y ventilá. No prendas luces.', resp: ['Cerrar el gas', 'Llamar al gasista'] },
    { dev: 'controlador', estado: 'ok', n: 2, texto: 'El controlador NO prende luces ni ventiladores: podrían hacer chispa.' },
    { dev: 'valvulagas', estado: 'cerrado', n: 4, texto: 'La válvula motorizada corta el gas de la casa.' },
    { dev: 'sirena', estado: 'alerta', n: 4, texto: 'Suena la alarma para que todos salgan.' },
  ], sin: 'Sin válvula, el aviso llega igual y hay que cerrar la llave de paso a mano.' },
  { id: 'monoxido', titulo: 'Monóxido en invierno', ico: '☁️', resumen: 'Un calefón o estufa mal ventilado largó monóxido de noche.', pasos: [
    { dev: 'co', estado: 'alerta', n: 1, texto: 'El detector de monóxido suena.' },
    { dev: 'telefono', estado: 'alerta', n: 1, red: true, texto: 'Mensaje urgente.', msg: '⚠️ Monóxido de carbono en la casa. Abrí ventanas y salí ya.', resp: ['Ya salimos', 'Llamar al 107'] },
    { dev: 'clima', estado: 'off', n: 2, texto: 'Se apaga la calefacción.' },
    { dev: 'valvulagas', estado: 'cerrado', n: 4, texto: 'Se corta el gas de la estufa y el calefón.' },
    { dev: 'sirena', estado: 'alerta', n: 4, texto: 'La sirena despierta a todos.' },
  ], sin: 'El monóxido no tiene olor: el detector de nivel 1 es lo más importante de toda esta lista.' },
  { id: 'salir', titulo: 'Me voy de casa', ico: '👋', resumen: 'Sale el último de la familia.', pasos: [
    { dev: 'puerta', estado: 'ok', n: 1, texto: 'El sensor registra que se cerró la puerta.' },
    { dev: 'enchufe', estado: 'off', n: 1, texto: 'Se apagan los enchufes que no hacen falta.' },
    { dev: 'termosifon', estado: 'off', n: 3, texto: 'El termosifón pasa a piloto.' },
    { dev: 'presencia', estado: 'off', n: 2, texto: 'Los sensores de presencia confirman que no queda nadie.' },
    { dev: 'luces', estado: 'off', sala: 'todas', n: 2, texto: 'Se apagan las luces que quedaron prendidas.' },
    { dev: 'cortinas', estado: 'off', n: 2, texto: 'Bajan las cortinas.' },
    { dev: 'clima', estado: 'off', n: 2, texto: 'Se apaga el aire.' },
    { dev: 'ventana', estado: 'alerta', n: 3, red: true, texto: 'Aviso de ventana abierta.', msg: '🔲 Quedó abierta la ventana del dormitorio.', resp: ['Avisame si llueve', 'OK'] },
    { dev: 'cerradura', estado: 'cerrado', n: 4, texto: 'La cerradura se traba.' },
    { dev: 'porton', estado: 'cerrado', n: 4, texto: 'El portón se cierra detrás del auto.' },
    { dev: 'sirena', estado: 'ok', n: 4, texto: 'Alarma armada; los sensores ignoran a la mascota.' },
    { dev: 'aspiradora', estado: 'on', n: 5, texto: 'Como no hay nadie, el robot aspira.' },
  ] },
  { id: 'llegar', titulo: 'Llego a casa', ico: '🏠', resumen: 'Volvés del trabajo a la tarde.', pasos: [
    { dev: 'porton', estado: 'on', n: 4, texto: 'El portón se abre al detectar tu celular cerca (solo si lo autorizaste).' },
    { dev: 'aproximacion', estado: 'on', n: 2, texto: 'Al acercarte a la puerta se prende la luz de entrada.' },
    { dev: 'termosifon', estado: 'on', n: 3, texto: 'El termosifón ya calentó el agua.' },
    { dev: 'cerradura', estado: 'ok', n: 4, texto: 'La cerradura se abre con tu código o tu celular.' },
    { dev: 'sirena', estado: 'off', n: 4, texto: 'Se desarma la alarma.' },
    { dev: 'luces', estado: 'on', sala: 'living', n: 2, texto: 'Se prende la luz del living.' },
    { dev: 'clima', estado: 'on', n: 2, texto: 'El aire ya estaba en 24 °C desde que saliste del trabajo.' },
    { dev: 'telefono', estado: 'ok', n: 3, red: true, texto: 'Resumen del día.', msg: '🏠 Bienvenido. Hoy la casa usó 6 kWh y llegó una carta al buzón.' },
  ] },
  { id: 'despertar', titulo: 'Buen día', ico: '🌅', resumen: 'Son las 7 de la mañana de un día de semana.', pasos: [
    { dev: 'cortinas', estado: 'on', n: 2, texto: 'Las cortinas del dormitorio se abren de a poco.' },
    { dev: 'luces', estado: 'on', sala: 'dorm', n: 2, texto: 'Luz cálida y suave en el dormitorio.' },
    { dev: 'clima', estado: 'on', n: 2, texto: 'La calefacción templa el baño.' },
    { dev: 'enchufe', estado: 'on', n: 1, texto: 'Arranca la cafetera.' },
    { dev: 'pantalla', estado: 'on', n: 2, texto: 'La pantalla de la cocina muestra el clima y la agenda.' },
    { dev: 'voz', estado: 'on', n: 5, texto: 'El asistente lee el pronóstico, sin mandar tu voz a internet.' },
  ] },
  { id: 'noche', titulo: 'Llega la noche', ico: '🌙', resumen: 'Se pone el sol.', pasos: [
    { dev: 'luzamb', estado: 'on', n: 2, texto: 'El sensor de luz detecta que oscureció.' },
    { dev: 'luces', estado: 'on', sala: 'living', n: 2, texto: 'Se prende el living.' },
    { dev: 'cortinas', estado: 'off', n: 2, texto: 'Se cierran las cortinas que dan a la calle.' },
    { dev: 'reflector', estado: 'on', n: 3, texto: 'La luz del patio queda lista para prenderse con movimiento.' },
    { dev: 'ledcontorno', estado: 'on', n: 3, texto: 'Se enciende el LED de contorno de la casa hasta la medianoche.' },
    { dev: 'luces', estado: 'off', sala: 'todas', n: 2, texto: 'A las 23:30 se apaga lo que quedó prendido.' },
    { dev: 'sirena', estado: 'ok', n: 4, texto: 'Se arma la alarma de puertas y ventanas.' },
  ] },
  { id: 'vacaciones', titulo: 'Vacaciones', ico: '✈️', resumen: 'La familia se va una semana.', pasos: [
    { dev: 'telefono', estado: 'ok', n: 2, red: true, texto: 'Confirmación del modo vacaciones.', msg: '✈️ Modo vacaciones activado. Voy a simular que hay gente.' },
    { dev: 'luces', estado: 'on', sala: 'living', n: 2, texto: 'Las luces se prenden y apagan con horarios variables.' },
    { dev: 'cortinas', estado: 'on', n: 2, texto: 'Las cortinas suben y bajan como un día normal.' },
    { dev: 'riego', estado: 'on', n: 3, texto: 'El riego sigue según la humedad del suelo.' },
    { dev: 'comedero', estado: 'on', n: 2, texto: 'El comedero da las raciones a la mascota (y alguien la visita).' },
    { dev: 'camara', estado: 'on', n: 4, texto: 'Las cámaras graban solo si hay movimiento con la alarma armada.' },
  ] },
  { id: 'tormenta', titulo: 'Alerta de tormenta', ico: '⛈️', resumen: 'El municipio emite una alerta de lluvia fuerte.', pasos: [
    { dev: 'controlador', estado: 'alerta', n: 2, red: true, texto: 'El controlador recibe la alerta oficial de lluvia fuerte.' },
    { dev: 'ventana', estado: 'alerta', n: 3, red: true, texto: 'Aviso de ventanas abiertas.', msg: '⛈️ Alerta de tormenta: está abierta la ventana del dormitorio.', resp: ['Bajar persianas', 'OK'] },
    { dev: 'cortinas', estado: 'off', n: 2, texto: 'Bajan las persianas para proteger los vidrios.' },
    { dev: 'riego', estado: 'off', n: 3, texto: 'Se suspende el riego de hoy y de mañana.' },
    { dev: 'ups', estado: 'ok', n: 4, texto: 'La UPS queda lista por si se corta la luz.' },
    { dev: 'bateria', estado: 'on', n: 5, texto: 'La batería se carga al 100 %.' },
  ], sin: 'Sin controlador, la alerta llega solo por los canales del municipio (radio, WhatsApp).' },
  { id: 'corte', titulo: 'Corte de luz', ico: '🔌', resumen: 'Se corta la luz durante dos horas.', pasos: [
    { dev: 'luces', estado: 'off', sala: 'todas', n: 1, texto: 'Se apaga todo lo que depende de la red eléctrica.' },
    { dev: 'ups', estado: 'on', n: 4, texto: 'La UPS mantiene funcionando router y controlador.' },
    { dev: 'bateria', estado: 'on', n: 5, texto: 'La batería de la casa sostiene heladera, luces e internet.' },
    { dev: 'heladera', estado: 'alerta', n: 3, texto: 'El sensor mide que la heladera empieza a calentarse.' },
    { dev: 'telefono', estado: 'alerta', n: 4, red: true, texto: 'Aviso del corte.', msg: '🔌 Se cortó la luz hace 30 minutos. La heladera está a 7 °C.' },
    { dev: 'luces', estado: 'on', sala: 'living', n: 2, texto: 'Al volver la luz, todo se enciende de a poco para no saltar la térmica.' },
  ], sin: 'Sin UPS ni batería todo se apaga, y el sistema vuelve recién cuando vuelve la luz.' },
  { id: 'calor', titulo: 'Ola de calor', ico: '🌡️', resumen: '36 °C afuera a las 15 h y la mascota sola en casa.', pasos: [
    { dev: 'temp', estado: 'alerta', n: 2, texto: 'Hace 31 °C adentro.' },
    { dev: 'cortinas', estado: 'off', n: 2, texto: 'Bajan las cortinas del lado del sol.' },
    { dev: 'presencia', estado: 'ok', n: 2, texto: 'La presencia indica que no hay personas, solo la mascota en el living.' },
    { dev: 'ventilador', estado: 'on', n: 2, texto: 'Primero se prenden los ventiladores de techo, que gastan mucho menos.' },
    { dev: 'clima', estado: 'on', n: 2, texto: 'Si no alcanza, el aire del living arranca a 26 °C, solo en ese ambiente.' },
    { dev: 'telefono', estado: 'ok', n: 2, red: true, texto: 'Aviso a vos.', msg: '🌡️ Hace calor y Toby está solo: prendí el aire del living a 26 °C.', resp: ['Gracias', 'Bajar a 24 °C'] },
    { dev: 'bebedero', estado: 'ok', n: 3, texto: 'El bebedero tiene agua fresca.' },
    { dev: 'solar', estado: 'on', n: 5, texto: 'El aire usa energía de los paneles.' },
  ] },
  { id: 'mayor', titulo: 'Cuidado de mayores', ico: '👵', resumen: 'Una persona mayor vive sola y hoy no se levantó a la hora de siempre.', pasos: [
    { dev: 'cama', estado: 'alerta', n: 5, texto: 'El sensor de cama indica que no se levantó a las 8, como siempre.' },
    { dev: 'presencia', estado: 'alerta', n: 2, texto: 'A las 10 no hubo presencia en la cocina.' },
    { dev: 'telefono', estado: 'alerta', n: 2, red: true, texto: 'Mensaje a un familiar (ella lo autorizó).', msg: '👵 Mamá no tuvo actividad esta mañana.', resp: ['Llamarla', 'Avisar a la vecina'] },
    { dev: 'caida', estado: 'ok', n: 5, texto: 'El radar del baño no detectó caídas.' },
    { dev: 'boton', estado: 'ok', n: 5, texto: 'Si aprieta el botón de ayuda, llama al familiar o a emergencias.' },
    { dev: 'cerradura', estado: 'ok', n: 4, texto: 'Si lo autorizás, la cerradura deja entrar al familiar o a la ambulancia.' },
  ], sin: 'Sin cámaras en dormitorios ni baños: solo se sabe si hubo actividad, no qué se hace.' },
  { id: 'mascota', titulo: 'Mascota sola', ico: '🐶', resumen: 'Toby se queda solo durante el día.', pasos: [
    { dev: 'comedero', estado: 'on', n: 2, texto: 'El comedero da la ración de las 13 h.' },
    { dev: 'telefono', estado: 'ok', n: 2, red: true, texto: 'Aviso de la comida.', msg: '🐶 Toby comió su ración de las 13 h.', resp: ['Ver cámara'] },
    { dev: 'movimiento', estado: 'ok', n: 2, texto: 'Los sensores aptos mascotas no disparan la alarma.' },
    { dev: 'bebedero', estado: 'ok', n: 3, texto: 'El bebedero tiene agua.' },
    { dev: 'puertamascota', estado: 'on', n: 4, texto: 'La puerta para mascotas solo se abre con el chip de Toby.' },
    { dev: 'collar', estado: 'alerta', n: 5, red: true, texto: 'El collar detecta que salió del terreno.', msg: '📍 Toby salió del terreno por el portón.', resp: ['Ver ubicación'] },
  ] },
  { id: 'visita', titulo: 'Llega una visita', ico: '🔔', resumen: 'Viene el plomero y no hay nadie.', pasos: [
    { dev: 'timbre', estado: 'alerta', n: 4, red: true, texto: 'Tocan el timbre.', msg: '🔔 Tocan el timbre en la entrada.', resp: ['Hablar', 'Abrir una vez'] },
    { dev: 'mirilla', estado: 'on', n: 4, texto: 'La mirilla digital muestra quién está del otro lado de la puerta.' },
    { dev: 'camara', estado: 'on', n: 4, texto: 'Ves quién es desde el celular y hablás.' },
    { dev: 'cerradura', estado: 'ok', n: 4, texto: 'Le das un código de un solo uso, válido hasta las 18 h.' },
    { dev: 'puerta', estado: 'ok', n: 1, texto: 'El sensor registra a qué hora entró y salió.' },
  ] },
  { id: 'intruso', titulo: 'Intruso de noche', ico: '🚨', resumen: 'Rompen un vidrio a las 3 de la mañana con la alarma armada.', pasos: [
    { dev: 'vidrio', estado: 'alerta', n: 4, texto: 'El sensor detecta un vidrio roto.' },
    { dev: 'movimiento', estado: 'alerta', n: 2, texto: 'Hay movimiento en el living.' },
    { dev: 'multipresencia', estado: 'alerta', n: 3, texto: 'El sensor de multipresencia cuenta 2 personas cerca de la ventana.' },
    { dev: 'ledcontorno', estado: 'on', n: 3, texto: 'Se enciende todo el contorno de la casa.' },
    { dev: 'reflector', estado: 'on', n: 3, texto: 'Se encienden los reflectores.' },
    { dev: 'luces', estado: 'on', sala: 'todas', n: 2, texto: 'Se prenden todas las luces.' },
    { dev: 'sirena', estado: 'alerta', n: 4, texto: 'Suena la sirena.' },
    { dev: 'telefono', estado: 'alerta', n: 4, red: true, texto: 'Mensaje urgente.', msg: '🚨 Vidrio roto y movimiento en el living con la alarma armada.', resp: ['Llamar al 911', 'Ver cámara'] },
    { dev: 'camara', estado: 'on', n: 4, texto: 'La cámara graba en casa; la grabación queda como prueba.' },
  ] },
  { id: 'sol', titulo: 'Sol al mediodía', ico: '☀️', resumen: 'Los paneles producen más de lo que consume la casa.', pasos: [
    { dev: 'solar', estado: 'on', n: 5, texto: 'Los paneles generan más energía de la que se usa.' },
    { dev: 'medidor', estado: 'on', n: 3, texto: 'El medidor muestra el excedente en tiempo real.' },
    { dev: 'enchufe', estado: 'on', n: 3, texto: 'Se enciende el termotanque para aprovechar el sol.' },
    { dev: 'lavarropas', estado: 'on', n: 3, texto: 'Arranca el lavarropas que quedó cargado.' },
    { dev: 'lavavajillas', estado: 'on', n: 3, texto: 'Arranca el lavavajillas.' },
    { dev: 'ev', estado: 'on', n: 5, texto: 'El auto se carga con energía propia.' },
    { dev: 'bateria', estado: 'on', n: 5, texto: 'Lo que sobra se guarda en la batería para la noche.' },
  ] },
  { id: 'pileta', titulo: 'Mantener la pileta', ico: '🏊', resumen: 'Verano: la pileta necesita filtrado y cloro.', solo: ['pileta'], pasos: [
    { dev: 'pileta', estado: 'alerta', n: 5, texto: 'El sensor mide cloro bajo y pH alto.' },
    { dev: 'telefono', estado: 'alerta', n: 5, red: true, texto: 'Aviso de mantenimiento.', msg: '🏊 Cloro bajo en la pileta. Agregá 200 g antes de bañarse.', resp: ['Listo'] },
    { dev: 'bomba', estado: 'on', n: 5, texto: 'La bomba filtra al mediodía, con energía solar.' },
    { dev: 'cortacesped', estado: 'on', n: 5, texto: 'El robot corta el pasto del parque, lejos de la pileta.' },
  ] },
  { id: 'tanque', titulo: 'Agua y gas en el campo', ico: '🛢️', resumen: 'Baja el tanque y la garrafa está por terminarse.', solo: ['campo'], pasos: [
    { dev: 'tanque', estado: 'alerta', n: 3, texto: 'El tanque bajó al 20 %.' },
    { dev: 'bomba', estado: 'on', n: 5, texto: 'La bomba del pozo arranca sola y se detiene al llenar.' },
    { dev: 'garrafa', estado: 'alerta', n: 3, red: true, texto: 'Aviso de gas.', msg: '⚖️ Queda 15 % de gas en la garrafa.', resp: ['Pedir garrafa'] },
    { dev: 'starlink', estado: 'ok', n: 5, texto: 'Sin fibra en la zona, los avisos salen por el satélite.' },
  ] },
];

export const SALAS_LUZ = (tipo) => tipo.salas.filter((s) => s[6] === 'in').map((s) => s[0]);

export const tipo = (id) => TIPOS.find((t) => t.id === id) || TIPOS[0];

/** Equipos ubicados en el plano de un tipo de casa. */
export function equiposDe(tipoId) {
  return new Set(Object.values(tipo(tipoId).equipos).flat());
}

/** Escenas disponibles para un tipo de casa. */
export const escenasDe = (tipoId) => ESCENAS.filter((e) => !e.solo || e.solo.includes(tipoId));

/** Qué pasa en una escena según el tipo de casa, el nivel elegido y si hay internet. */
export function planificar(escenaId, nivel, internet = true, tipoId = 'casa') {
  const e = ESCENAS.find((x) => x.id === escenaId);
  if (!e) throw new Error(`Escena desconocida: ${escenaId}`);
  const hay = equiposDe(tipoId);
  return e.pasos.map((p) => {
    const aplica = p.dev === 'telefono' || hay.has(p.dev);
    const incluido = aplica && nivel >= p.n;
    const sinSenal = incluido && p.red && !internet && !p.msg;
    const enCola = incluido && p.red && !internet && !!p.msg;
    return { ...p, aplica, incluido, enCola, sinSenal, ejecuta: incluido && !sinSenal };
  });
}

/** Rango de precio de una lista de equipos (con su cantidad típica). */
export function costo(ids) {
  return EQUIPOS.filter((q) => ids.includes(q.id))
    .reduce(([a, b], q) => [a + q.p[0] * q.c, b + q.p[1] * q.c], [0, 0]);
}

/** Equipos incluidos hasta un nivel (acumulativo), opcionalmente solo los de un tipo de casa. */
export function equiposNivel(nivel, tipoId) {
  const hay = tipoId ? equiposDe(tipoId) : null;
  return EQUIPOS.filter((q) => q.n <= nivel && (!hay || hay.has(q.id))).map((q) => q.id);
}

/** Cuántos pasos de las escenas de un tipo puede hacer un conjunto de equipos. */
export function cobertura(ids, tipoId = 'casa') {
  const usa = new Set(ids);
  if (ids.length) usa.add('telefono');
  const hay = equiposDe(tipoId);
  const pasos = escenasDe(tipoId).flatMap((e) => e.pasos).filter((p) => p.dev === 'telefono' || hay.has(p.dev));
  return { cubiertos: pasos.filter((p) => usa.has(p.dev)).length, total: pasos.length };
}
