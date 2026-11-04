# Arquitectura general — Ciudad, Barrio y Casa

**Versión 1.0 · 4 de noviembre de 2026 · Estado: propuesta para revisión**

## 1. Propósito
Definir tres escalas coordinadas sin mezclar responsabilidades ni crear dependencias que comprometan su funcionamiento. IA, automatización y robótica son capacidades consideradas desde el diseño inicial, con despliegue gradual, límites verificables y supervisión proporcional al riesgo.

## 2. Responsabilidades por escala

| Escala | Unidad | Responsabilidad | Ejemplos |
|---|---|---|---|
| Ciudad | Territorio y servicios municipales | Infraestructura y servicios urbanos | alumbrado, agua, movilidad, drenaje, emergencias, GIS |
| Barrio | Comunidad y espacios compartidos | Infraestructura y servicios vecinales | accesos, iluminación común, riego, residuos, microred |
| Casa | Vivienda y ocupantes | Instalaciones y automatización doméstica | climatización, energía, agua, accesos, sensores y robots |

Barrio puede referirse a barrio abierto, conjunto residencial o barrio privado. La gobernanza y las responsabilidades deben definirse para cada caso.

## 3. Autonomía por diseño
- **Casa:** conserva control local, funciones manuales y automatizaciones esenciales.
- **Barrio:** mantiene servicios comunes críticos con controladores locales y procedimientos manuales.
- **Ciudad:** mantiene servicios esenciales mediante sistemas redundantes, operación local y equipos responsables.

La conexión entre niveles mejora la coordinación, pero no debe ser condición para abrir una salida, encender una luz o mantener un sistema en estado seguro.

## 4. Interfaces y flujos autorizados
- Casa → Barrio: solo eventos necesarios y autorizados, como solicitud de mantenimiento común.
- Barrio → Ciudad: incidencias agregadas de servicios bajo competencia municipal.
- Ciudad → Barrio: alertas oficiales, avisos y datos públicos pertinentes.
- Ciudad/Barrio → Casa: alertas públicas; sin capacidad predeterminada para controlar dispositivos privados.
- Casa ↔ Casa: colaboración voluntaria, por ejemplo comunidades energéticas bajo acuerdos y marco legal.

No se habilita vigilancia general de viviendas ni acceso por defecto a cámaras, micrófonos o sensores interiores. Todo intercambio de datos personales exige finalidad, base jurídica, transparencia, minimización y controles.

## 5. Capas tecnológicas de referencia
1. Activos físicos: edificios, calles, redes, equipos, sensores y actuadores.
2. Conectividad: fibra, Ethernet, Wi-Fi, redes móviles y LPWAN cuando proceda.
3. Control local y Edge: controladores, gateways, PLC/RTU y procesamiento próximo al origen.
4. Integración: APIs y protocolos documentados como MQTT y HTTPS.
5. Datos y contexto: inventario de activos, series temporales, GIS, eventos y calidad de datos.
6. IA y analítica: detección, predicción, optimización y asistencia a decisiones.
7. Robótica y actuación: equipos con límites operativos, zonas seguras, parada y supervisión.
8. Gobernanza y operación: identidad, permisos, auditoría, mantenimiento y continuidad.

No todas las escalas necesitan los mismos componentes. Se reutilizan criterios y estándares, no necesariamente servidores o bases de datos.

## 6. IA transversal
- Casa: asistencia local, eficiencia energética, anomalías y coordinación de robots.
- Barrio: mantenimiento predictivo y optimización de recursos comunes.
- Ciudad: planificación, gemelo digital territorial y predicción de demanda.

Distinguir modelos locales y externos. Procesar datos sensibles localmente siempre que sea viable. Las recomendaciones deben explicar origen, confianza y limitaciones. La IA no tendrá autoridad ilimitada: decisiones de alto impacto requieren responsables y procedimientos humanos.

## 7. Robótica
- Casa: limpieza, jardinería, piscina e inspección.
- Barrio: limpieza común, jardinería e inspección de instalaciones.
- Ciudad: inspección de infraestructura y mantenimiento especializado.

Cada despliegue requiere identificación, zonas y horarios, detección de obstáculos, límites, parada de emergencia, mantenimiento, registro de incidentes y modo seguro ante pérdida de comunicación.

## 8. Identidad y datos
Cada escala mantiene usuarios, activos, permisos y registros propios. Accesos entre escalas explícitos, limitados y revocables; mínimo privilegio; preferencia por datos agregados cuando basten; auditoría de accesos administrativos. Nunca publicar credenciales o secretos en el frontend o repositorio.

## 9. Continuidad y degradación segura
1. Mantener controles manuales.
2. Definir estados seguros para sistemas críticos.
3. Permitir detener automatizaciones no críticas sin afectar seguridad.
4. Almacenar eventos pendientes localmente de forma segura.
5. Verificar integridad e identidad antes de reanudar acciones automáticas.

## 10. Etapas de implementación
- **0 Diagnóstico:** inventario, necesidades, riesgos, competencias y conectividad.
- **1 Fundaciones:** arquitectura, identidad, ciberseguridad, inventario y observabilidad.
- **2 Pilotos:** casos pequeños, medibles y reversibles en cada escala.
- **3 Integración:** interfaces, interoperabilidad y tableros.
- **4 IA y robótica ampliadas:** solo con evidencia de utilidad y seguridad.
- **5 Optimización:** auditoría, evaluación y mejora continua.

Cada piloto tendrá responsable, presupuesto, línea de base, indicadores, plan de reversión y evaluación de impacto.

## 11. Validaciones pendientes
Límites territoriales y competencias; acuerdos de intercambio; normativa aplicable; protección de datos y videovigilancia; evaluación de amenazas; cotizaciones; niveles de autonomía y certificaciones requeridas.

## 12. Relación con el material publicado
Contrastar con el [Plan Maestro](../plan-maestro.html), [Proyecto 2026](../proyecto-2026.html), [Barrio técnico](../barrio-tecnico.html) y [Casa técnica](../casa-tecnico.html). Las diferencias se documentan para revisión; no se sobrescriben decisiones anteriores silenciosamente.
