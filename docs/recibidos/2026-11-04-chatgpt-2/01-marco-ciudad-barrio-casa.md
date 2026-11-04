# LSM Ciudad Inteligente — marco de organización ciudad, barrio y casa

**Estado:** propuesta de trabajo para revisión  
**Fecha:** 4 de noviembre de 2026

## 1. Visión

LSM Ciudad Inteligente propone un modelo progresivo de transformación de los entornos urbanos y residenciales mediante tecnología útil, interoperable y centrada en las personas. La inteligencia artificial (IA) y la robótica deben ser ejes transversales desde el diseño, no añadidos posteriores.

La tecnología debe resolver necesidades concretas, facilitar los servicios, mejorar la sostenibilidad y la calidad de vida, y mantener siempre supervisión humana, seguridad, privacidad y posibilidad de funcionamiento manual.

## 2. Estructura territorial

El proyecto se organiza en tres niveles conectados:

### Nivel 1 — Ciudad

La ciudad constituye el marco de planificación y coordinación. Sus ámbitos de trabajo pueden incluir:

- movilidad y transporte;
- energía, alumbrado y eficiencia;
- agua, saneamiento y gestión de residuos;
- medioambiente, arbolado, ruido y calidad del aire;
- infraestructura digital y conectividad;
- seguridad y gestión de emergencias;
- servicios públicos, salud comunitaria y accesibilidad;
- planificación urbana, obras y mantenimiento;
- participación ciudadana y transparencia.

La IA puede ayudar a analizar datos, detectar anomalías, anticipar necesidades y apoyar decisiones. Las decisiones de alto impacto deben permanecer bajo responsabilidad de las autoridades y personas competentes.

### Nivel 2 — Barrio

El barrio traduce la estrategia de ciudad a una escala próxima y comunitaria. Debe contemplar:

- calles, plazas, parques y espacios compartidos;
- iluminación, limpieza y mantenimiento;
- movilidad peatonal, ciclista y transporte local;
- puntos de recogida y gestión de residuos;
- conectividad y sensores ambientales;
- accesibilidad y seguridad del espacio público;
- comunicación y participación vecinal;
- coordinación de edificios, comercios, servicios y viviendas.

Cada barrio tendrá una ficha propia, vinculada a su ciudad. Las necesidades y prioridades se definirán con información local y participación de sus habitantes.

### Nivel 3 — Casa

La casa es la unidad residencial y el entorno donde se aplican soluciones domésticas:

- climatización, ventilación y calidad del aire;
- iluminación, persianas y control energético;
- agua y detección de fugas;
- seguridad, accesos y alertas;
- electrodomésticos y gestión del consumo;
- accesibilidad y asistencia;
- mantenimiento preventivo;
- automatizaciones y asistencia mediante IA o robótica.

Cada vivienda debe conservar controles manuales, permitir el funcionamiento básico aunque falle Internet y ofrecer al residente control claro sobre sus datos y dispositivos.

## 3. Arquitectura tecnológica común

La arquitectura debe favorecer la interoperabilidad y evitar la dependencia innecesaria de un único fabricante o plataforma.

En el ámbito doméstico, Home Assistant se considera la plataforma central de integración y automatización. Se deberá evaluar la compatibilidad de equipos y servicios de distintos fabricantes y ecosistemas, entre ellos Aqara, Meross, IKEA, Google Home/Assistant, Amazon Alexa, Apple HomeKit y Samsung SmartThings.

Se deben considerar estándares y protocolos según cada caso: Matter, Thread, Zigbee, Wi-Fi, Ethernet, MQTT y KNX.

La selección final de cada tecnología dependerá de compatibilidad real, seguridad, soporte, coste total, disponibilidad local y facilidad de mantenimiento. La lista anterior es un conjunto de tecnologías a evaluar, no una afirmación de que todos los equipos sean compatibles entre sí.

Para ciudad y barrio, la arquitectura deberá permitir integrar sistemas municipales y fuentes de datos mediante interfaces documentadas, estándares abiertos y permisos explícitos. No se presupone que los sistemas municipales estén disponibles o conectados.

## 4. IA y robótica como ejes transversales

La IA puede aportar análisis, clasificación de incidencias, predicción de demanda, optimización de recursos, interfaces conversacionales y asistencia a operadores y residentes.

La robótica puede evaluarse para tareas delimitadas como inspección, limpieza, mantenimiento, logística o asistencia, siempre que exista una justificación operativa y un análisis de riesgos.

Principios obligatorios:

1. Supervisión humana para acciones sensibles o de alto impacto.
2. Permisos mínimos y trazabilidad de las acciones automatizadas.
3. Pruebas controladas antes de operar en entornos reales.
4. Mecanismos de parada, reversión y control manual.
5. Protección de datos desde el diseño.
6. Evaluación de sesgos, errores y consecuencias no deseadas.
7. Transparencia sobre cuándo interviene un sistema automatizado.

## 5. Seguridad, privacidad y resiliencia

La seguridad debe incorporarse desde el inicio:

- inventario de dispositivos, sistemas, responsables y permisos;
- actualizaciones y eliminación de credenciales predeterminadas;
- autenticación robusta y segmentación de redes cuando corresponda;
- copias de seguridad y recuperación probada;
- cifrado de comunicaciones y protección de datos;
- registro y revisión de eventos relevantes;
- política de conservación y eliminación de datos;
- operación segura ante fallos de red, energía o servicios externos.

Los datos personales y domésticos no deben publicarse en repositorios públicos. GitHub se utilizará para documentación y código no sensible, nunca para contraseñas, tokens, claves privadas, datos identificables de residentes o información de seguridad que facilite intrusiones.

## 6. Implementación progresiva

La implementación debe avanzar por etapas:

1. **Diagnóstico:** necesidades, infraestructura existente, restricciones y actores.
2. **Diseño:** arquitectura, objetivos medibles, costes, riesgos y responsabilidades.
3. **Piloto:** prueba pequeña, reversible y con consentimiento cuando corresponda.
4. **Evaluación:** resultados, incidentes, accesibilidad, ahorro y satisfacción.
5. **Ampliación:** extensión únicamente cuando el piloto demuestre utilidad y seguridad.
6. **Mantenimiento:** soporte, actualizaciones, auditoría y revisión periódica.

No se debe automatizar un proceso solo porque sea técnicamente posible: primero debe demostrarse que aporta valor.

## 7. Fichas vinculadas

Cada elemento del proyecto tendrá una ubicación inequívoca:

- Ciudad: país, región, municipio y ficha urbana.
- Barrio: ciudad de pertenencia, límites o descripción territorial y ficha barrial.
- Casa: ciudad y barrio asociados, identificador no sensible y ficha residencial.

Las fichas deben enlazarse entre sí para mantener la trazabilidad. Una casa pertenece a un barrio y un barrio pertenece a una ciudad, salvo que el modelo administrativo local requiera otra estructura.

## 8. Decisiones pendientes

Este documento no aprueba una implementación concreta. Para avanzar se deberán validar:

- ciudad y barrios que serán objeto de los primeros estudios;
- alcance del piloto y participantes;
- inventario y estado de infraestructuras;
- entidades responsables y permisos de acceso;
- requisitos legales aplicables en cada jurisdicción;
- presupuesto, financiación y costes recurrentes;
- indicadores de éxito y criterios para detener o ampliar el piloto.

## 9. Resultado esperado

Un sistema documental y técnico coherente donde cada propuesta pueda ubicarse en ciudad, barrio o casa, conectarse con las demás escalas y evolucionar sin perder trazabilidad, seguridad ni independencia tecnológica.
