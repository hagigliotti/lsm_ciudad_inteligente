# Libertador San Martín, una ciudad inteligente · 2009 → 2026

![LSM, una ciudad inteligente](assets/logos/logo-horizontal.svg)

Análisis del proyecto **Ciudad Inteligente de Libertador San Martín** (Entre Ríos, Argentina), presentado en julio de 2009,
y propuesta de cómo implementarlo hoy.

- Sitio: **https://hagigliotti.github.io/lsm_ciudad_inteligente/**
- Proyecto original: https://lsmciudadinteligente.wordpress.com (cómo archivarlo: [`docs/archivo-2009.md`](docs/archivo-2009.md))

## Qué hay

| Ruta | Qué es |
|---|---|
| `index.html` | Portada animada, mapa de las secciones y formulario vecinal |
| `ciudad-hoy.html` | La ciudad hoy: relevamiento de LSM, Puiggari y alrededores, tema por tema, con reclamos y fuentes |
| `fallas-2009.html` | Qué le faltó al proyecto de 2009, qué cambió y qué reglas dejó |
| `barrio-simple.html`, `barrio-tecnico.html` | Proyecto Barrio privado inteligente (versión simple y técnica) |
| `casa-simple.html`, `casa-tecnico.html` | Proyecto Casa particular inteligente (versión simple y técnica) |
| `casa-simulador.html` | Simulador: 4 tipos de casa, 5 niveles, 67 equipos, 19 situaciones, lista “tengo/quiero”, celular con chat, catálogo y configurador; datos en `assets/js/casa-datos.js` |
| `datos-personales.html` | Datos personales sensibles y no tan sensibles (Ley 25.326) |
| `scripts/menu.py` | Genera el menú y el pie de todas las páginas: se edita ahí y se corre `python3 scripts/menu.py` |
| `entrada/` | Bandeja de entrada para material nuevo (por ejemplo, de ChatGPT) que se revisa e integra; lo ya integrado queda en `docs/recibidos/` |
| `escalas.html` | Marco común: cómo encajan ciudad, barrio y casa |
| `la-lomada.html` | Caso de estudio: barrio La Lomada de Puiggari |
| `docs/plantillas/` | Fichas modelo de ciudad, barrio y casa |
| `proyecto-2026.html` | Proyecto 2026 (plan 2027–2031): mapa interactivo, metas, componentes, seguridad, robótica, presupuesto, cronograma y riesgos |
| `plan-maestro.html` | Plan Maestro 2027–2036, versión técnica completa: 24 capítulos y anexos, con el Plan Director v3.0 integrado y notas de revisión |
| `en-simple.html` | El proyecto explicado fácil, con ilustraciones, simulador de lluvia y preguntas frecuentes |
| `docs/plan-maestro/` | Documentos fuente: Plan Maestro (.docx) y Plan Director v3.0 (.md) |
| `archivo-2009.html` | El blog original de 2009 completo (se regenera con `python3 scripts/archivo2009.py`) |
| `privacidad.html` | Qué datos se recolectan, uso de IA, a quién se envían, borrado y qué pasa si no se cumple, sin testimonios falsos |
| `seguridad.html` | Validación, rate limiting, sesiones, auditoría de rutas, CORS, errores y pruebas |
| `assets/js/proyecto-datos.js` | Presupuesto, cronograma y puntos del mapa: se editan acá y la página se actualiza sola |
| `assets/logos/` | `logo.svg` (cuadrado), `logo-horizontal.svg` (fondo claro), `logo-horizontal-claro.svg` (fondo oscuro), `isotipo.svg` (favicon) y `logo.png` |
| `plataforma/servidor.mjs` | Servidor de referencia para la futura API vecinal (Node 20+, sin dependencias) |
| `tests/` | Pruebas automáticas: validación, plataforma y páginas |

## Publicar (una sola vez)

1. Subí este contenido al repositorio `lsm_ciudad_inteligente`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Cada push a `main` corre las pruebas y, si pasan, publica. Si alguna falla, no se publica.

## Google Analytics

Abrí `assets/js/config.js` y pegá tu ID en `gaId: 'G-XXXXXXXXXX'`. Nada se carga sin el consentimiento del visitante
(el aviso aparece solo cuando hay un ID configurado).

## Probar en tu computadora

```bash
npm test            # 127 pruebas
npm run auditar     # tabla de rutas de la API: autenticación, validación, límites
npm run servir      # sitio en http://localhost:8000
```

## Créditos

Análisis y código elaborados con asistencia de inteligencia artificial (Claude, de Anthropic) y revisión humana.
Datos con fuente en la sección “Fuentes” del sitio.
