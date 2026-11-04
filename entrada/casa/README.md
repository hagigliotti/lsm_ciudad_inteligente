# Escala Casa — vivienda inteligente integral

**Ámbito:** vivienda individual, instalaciones, ocupantes y dispositivos autorizados.  
**Estado:** marco propuesto, complementario al proyecto técnico existente.

## Misión
Diseñar viviendas inteligentes seguras, accesibles, eficientes y adaptables, con control local, interoperabilidad, IA y robótica doméstica desde el inicio. Los ocupantes deciden qué automatizar, qué datos procesar y qué servicios conectar.

## Dominios funcionales
- Arquitectura, envolvente y eficiencia.
- Energía, fotovoltaica, baterías y cargas.
- Agua, fugas y riego.
- Climatización, ventilación y calidad del aire.
- Iluminación, persianas y protección solar.
- Seguridad y accesos.
- Cocina, electrodomésticos y lavandería.
- Limpieza, mantenimiento y robots.
- Jardín, huerta, piscina y exteriores.
- Comunicaciones, red y sala técnica.
- Accesibilidad, confort y asistencia con consentimiento.
- Inventario, mantenimiento predictivo y gemelo digital doméstico.

## Control local e interoperabilidad
Home Assistant puede actuar como plataforma de integración cuando resulte adecuado. Automatizaciones documentadas y controles manuales; operación esencial sin internet. Seleccionar equipos después de definir necesidades, espacios, funciones y requisitos. Evaluar compatibilidad por modelo, no solo por marca. Protocolos posibles: Matter, Thread, Zigbee, Wi-Fi, Ethernet, MQTT, KNX, Modbus, BLE y DALI. No todos son necesarios en cada vivienda.

## IA doméstica
Optimización energética, detección de anomalías, asistencia contextual, mantenimiento predictivo y coordinación de robots. Mantener datos íntimos localmente cuando sea viable. Servicios externos opcionales, transparentes y revocables. La IA no anula controles manuales ni decide asuntos de alto impacto sobre personas.

## Robótica doméstica
Aspirado, fregado, césped, piscina, inspección y asistencia. Definir zonas, horarios, detección de obstáculos, protección de personas y animales, bloqueo seguro, mantenimiento y control manual.

## Privacidad y seguridad
Separar redes personales, IoT, invitados y cámaras; autenticación robusta; actualizaciones; no exponer directamente controladores a internet; copias y restauraciones probadas; permisos por persona/dispositivo; minimizar cámaras y micrófonos; conservar mandos manuales.

## Relación con Barrio y Ciudad
La Casa puede recibir alertas públicas y participar voluntariamente en servicios comunitarios. Integración granular, autorizada y revocable. Ni Barrio ni Ciudad obtienen control general de automatizaciones, sensores interiores o robots domésticos.

## Documentos existentes y evolución
- [Casa simple](../../casa-simple.html) · [Casa técnica](../../casa-tecnico.html)

Este marco sirve de base al futuro **LSM Smart Home 360**: catálogo neutral de marcas, configurador por espacios y funciones, simulador, inventario, presupuesto y centro técnico. Distinguir siempre demo de conexión real con Home Assistant.

## Próximos trabajos
Crear catálogo funcional; definir espacios, funciones, sensores, actuadores y dependencias; diseñar configurador y simulador por etapas; verificar compatibilidad por modelo; documentar autonomía, seguridad y operación local; preparar inventario y presupuesto estimativo.
