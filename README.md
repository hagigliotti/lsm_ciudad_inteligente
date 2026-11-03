# LSM Ciudad Inteligente · 2009 → 2026

![LSM Ciudad Inteligente](assets/logos/logo-horizontal.svg)

Análisis del proyecto **Ciudad Inteligente de Libertador San Martín** (Entre Ríos, Argentina), presentado en julio de 2009,
y propuesta de cómo implementarlo hoy.

- Sitio: **https://hagigliotti.github.io/lsm_ciudad_inteligente/**
- Proyecto original: https://lsmciudadinteligente.wordpress.com (cómo archivarlo: [`docs/archivo-2009.md`](docs/archivo-2009.md))

## Qué hay

| Ruta | Qué es |
|---|---|
| `index.html` | Portada animada, la ciudad hoy, 2009 vs 2026, fallas, potencialidades, arquitectura, hoja de ruta, veredicto y formulario vecinal |
| `proyecto-2026.html` | Proyecto 2026 (plan 2027–2031): mapa interactivo, metas, componentes, seguridad, robótica, presupuesto, cronograma y riesgos |
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
npm test            # 52 pruebas
npm run auditar     # tabla de rutas de la API: autenticación, validación, límites
npm run servir      # sitio en http://localhost:8000
```

## Créditos

Análisis y código elaborados con asistencia de inteligencia artificial (Claude, de Anthropic) y revisión humana.
Datos con fuente en la sección “Fuentes” del sitio.
