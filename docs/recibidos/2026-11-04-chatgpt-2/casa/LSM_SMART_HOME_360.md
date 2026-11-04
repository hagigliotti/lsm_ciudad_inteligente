# LSM Smart Home 360

**Estado:** arquitectura conceptual y relevamiento inicial  
**Versión:** 0.1 — 4 de noviembre de 2026

## 1. Visión

LSM Smart Home 360 es un modelo integral de vivienda inteligente. No se limita a encender luces o controlar dispositivos desde el teléfono: integra confort, seguridad, energía, agua, accesibilidad, mantenimiento, asistencia, IA y, cuando sea viable, robótica.

La casa debe seguir siendo funcional aunque falle Internet o un servicio externo.

## 2. Principios

- Interoperabilidad multimarca y multiplataforma.
- Preferencia por estándares abiertos y protocolos documentados.
- Control local para funciones esenciales.
- Seguridad desde el diseño: actualizaciones, credenciales únicas y segmentación.
- Privacidad, consentimiento y minimización de datos.
- Automatizaciones comprensibles, reversibles y con control manual.
- IA como asistencia supervisada, no como autoridad autónoma sobre las personas.
- Diseño modular para evitar reemplazar todo el sistema al cambiar de fabricante.

## 3. Ecosistema e interoperabilidad

Tecnologías y ecosistemas a considerar según compatibilidad y necesidad:

- Home Assistant como plataforma central de integración y automatización.
- Matter y Thread para dispositivos compatibles.
- Zigbee para sensores y actuadores de bajo consumo.
- Wi-Fi y Ethernet para equipos que lo requieran.
- MQTT para intercambio de mensajes entre componentes.
- KNX para instalaciones cableadas profesionales cuando corresponda.
- Integración selectiva con Aqara, Meross, IKEA, Google Home, Amazon Alexa, Apple HomeKit y Samsung SmartThings.

La compatibilidad debe comprobarse dispositivo por dispositivo. No se debe asumir que todos los equipos de una marca o región funcionan igual; algunos modelos pueden depender de firmware, región, hubs o servicios cloud.

## 4. Subsistemas funcionales

1. Iluminación y persianas.
2. Climatización y calidad del aire.
3. Seguridad: puertas, ventanas, fugas, humo y presencia.
4. Energía: consumo, generación, almacenamiento y cargas.
5. Agua: fugas, consumos y estado de instalaciones.
6. Accesibilidad y asistencia cotidiana.
7. Electrodomésticos y mantenimiento.
8. Entretenimiento y control multimedia.
9. IA: asistentes, análisis de patrones y detección de anomalías.
10. Robótica doméstica: limpieza, inspección y asistencia, según seguridad y utilidad.

## 5. Arquitectura técnica propuesta

- **Dispositivos:** sensores, actuadores, hubs y equipos.
- **Red local:** Ethernet, Wi-Fi, Zigbee, Thread y otras redes según el caso.
- **Control e integración:** Home Assistant y servicios locales.
- **Datos y automatización:** entidades, escenas, reglas, históricos y notificaciones.
- **IA y asistencia:** modelos locales o servicios externos evaluados por privacidad, costo y latencia.
- **Interfaz:** paneles, teléfono, voz y controles físicos.

La elección de hardware servidor se hará luego de estimar cantidad de dispositivos, carga, almacenamiento, consumo, disponibilidad y presupuesto.

## 6. Situación de partida

El inventario de la vivienda de referencia se retiró de esta versión pública por privacidad y seguridad (modelos de cámara, hubs y red de una casa real). Se conserva fuera del repositorio.

## 7. Riesgos y cuestiones técnicas

- La versión regional CN de hubs o dispositivos puede limitar integraciones y servicios.
- Las paredes gruesas pueden afectar Zigbee, Thread y Wi-Fi; se debe medir cobertura antes de añadir repetidores.
- El repetidor Wi-Fi no sustituye una planificación de red cableada o una malla correctamente diseñada.
- Evitar exponer Home Assistant directamente a Internet sin una arquitectura segura.
- Mantener copias de seguridad verificadas y recuperación documentada.
- Separar dispositivos IoT de computadoras y datos personales mediante redes o VLAN cuando el router lo permita.

## 8. IA y robótica doméstica

Aplicaciones potenciales:
- Asistente contextual para consultas y control de la vivienda.
- Detección de anomalías en consumo eléctrico o agua.
- Alertas por fugas, humo, temperatura o fallos de equipos.
- Automatizaciones adaptativas que puedan explicarse y desactivarse.
- Robots de limpieza o inspección con límites físicos y de privacidad.

La IA no debe desbloquear puertas, desactivar alarmas ni realizar acciones de riesgo sin autorización explícita y controles de seguridad. Los sistemas críticos deben conservar controles físicos y manuales.

## 9. Implementación por etapas

1. Inventario completo y diagnóstico de cobertura.
2. Red doméstica y seguridad básica.
3. Plataforma central y copias de seguridad.
4. Integración de sensores y dispositivos existentes.
5. Automatizaciones simples y verificables.
6. Energía, agua, climatización y mantenimiento.
7. IA supervisada y servicios avanzados.
8. Robótica doméstica y optimización.

## 10. Decisiones pendientes

- Definir el hardware definitivo para Home Assistant.
- Confirmar compatibilidad de los dispositivos de versión regional distinta (por ejemplo, CN).
- Evaluar cableado Ethernet y cobertura inalámbrica.
- Definir estrategia de respaldo eléctrico y copias de seguridad.
- Priorizar automatizaciones según utilidad y presupuesto.
- Establecer qué datos permanecen localmente y cuáles, si alguno, se envían a servicios externos.

## 11. Estado de la información

Este documento combina datos comunicados sobre el equipamiento actual con propuestas de arquitectura. Las compras consideradas no se presentan como realizadas. Las decisiones técnicas finales requieren pruebas de compatibilidad y relevamiento de la vivienda.
