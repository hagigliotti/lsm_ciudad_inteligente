#!/usr/bin/env python3
"""Inserta el mismo menú (header) y pie (footer) en todas las páginas del sitio.

Uso:  python3 scripts/menu.py
Se edita el MENU de abajo y se vuelve a correr. Las pruebas verifican que todas
las páginas tengan el menú actualizado.
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# (título del grupo, [(archivo, texto, descripción)]) o (texto, archivo) para un enlace suelto.
MENU = [
    ('La ciudad hoy', 'ciudad-hoy.html'),
    ('Proyecto 2009', 'original', [
        ('archivo-2009.html', 'Archivo 2009', 'El proyecto original completo, tal como se publicó'),
        ('fallas-2009.html', 'Fallas 2009', 'Qué le faltó y qué cambió desde entonces'),
        ('biblioteca-2009.html', 'En la biblioteca UAP', 'Dónde encontrar el original en papel'),
    ]),
    ('Proyecto 2026', 'actualización', [
        ('en-simple.html', 'En simple', 'Explicado fácil, con dibujos y ejemplos'),
        ('plan-maestro.html', 'Versión técnica', 'Plan Maestro 2027–2036 completo'),
        ('proyecto-2026.html', 'Mapa, costos y cronograma', 'Dónde va cada cosa, cuánto cuesta y cuándo'),
        ('escalas.html', 'Ciudad, barrio y casa', 'Cómo encajan los tres proyectos'),
    ]),
    ('Barrio privado inteligente', 'nuevo', [
        ('barrio-simple.html', 'En simple', 'Qué cambia para quien vive en el barrio'),
        ('barrio-tecnico.html', 'Versión técnica', 'Arquitectura, equipos, reglamento y costos'),
        ('la-lomada.html', 'Caso: La Lomada', 'Barrio en desarrollo en Puiggari'),
    ]),
    ('Casa particular inteligente', 'nuevo', [
        ('casa-simple.html', 'En simple', 'Qué se puede automatizar y por dónde empezar'),
        ('casa-tecnico.html', 'Versión técnica', 'Equipos, protocolos, instalación y costos'),
        ('casa-simulador.html', 'Simulador', 'Probá situaciones y calculá el costo de tu casa'),
    ]),
    ('Privacidad y seguridad', '', [
        ('datos-personales.html', 'Datos personales', 'Sensibles y no tan sensibles: qué se protege y cómo'),
        ('seguridad.html', 'Seguridad', 'Cómo se protegen el sitio y los sistemas'),
    ]),
]

INICIO = '<!-- menu:inicio -->'
FIN = '<!-- menu:fin -->'
PIE_INICIO = '<!-- pie:inicio -->'
PIE_FIN = '<!-- pie:fin -->'


def header(pagina: str) -> str:
    items = []
    for entrada in MENU:
        if len(entrada) == 2:
            texto, href = entrada
            actual = ' aria-current="page"' if href == pagina else ''
            items.append(f'        <li><a class="menu__link" href="{href}"{actual}>{texto}</a></li>')
            continue
        titulo, nota, hijos = entrada
        activo = any(h[0] == pagina for h in hijos)
        sub = []
        for href, texto, desc in hijos:
            actual = ' aria-current="page"' if href == pagina else ''
            sub.append(f'              <li><a href="{href}"{actual}><b>{texto}</b><small>{desc}</small></a></li>')
        nota_html = f' <i>{nota}</i>' if nota else ''
        clase = 'menu__grupo menu__grupo--activo' if activo else 'menu__grupo'
        items.append(
            f'        <li>\n          <details class="{clase}">\n'
            f'            <summary>{titulo}{nota_html}</summary>\n'
            f'            <ul>\n' + '\n'.join(sub) + '\n            </ul>\n          </details>\n        </li>'
        )
    return (
        f'{INICIO}\n<header class="barra">\n  <div class="envoltura">\n'
        '    <a class="barra__marca" href="index.html"><img src="assets/logos/isotipo.svg" alt="" width="36" height="36">LSM</a>\n'
        '    <button class="menu__boton" type="button" aria-expanded="false" aria-controls="menu-principal" data-menu-boton>Menú</button>\n'
        '    <nav class="menu" id="menu-principal" aria-label="Menú principal">\n      <ul class="menu__lista">\n'
        + '\n'.join(items) +
        '\n      </ul>\n    </nav>\n  </div>\n</header>\n' + FIN
    )


def footer() -> str:
    cols = []
    for entrada in MENU:
        if len(entrada) == 2:
            continue
        titulo, _, hijos = entrada
        links = ''.join(f'<a href="{h}">{t}</a>' for h, t, _ in hijos)
        cols.append(f'      <div><b>{titulo}</b>{links}</div>')
    return (
        f'{PIE_INICIO}\n<footer class="pie">\n  <div class="envoltura">\n'
        '    <div class="pie__marca"><img src="assets/logos/logo-horizontal-claro.svg" alt="LSM, una ciudad inteligente" width="240" height="60">\n'
        '      <span>© 2009–<span data-anio>2026</span> · Hernando A. Gigliotti</span>\n'
        '      <span><a href="ciudad-hoy.html">La ciudad hoy</a> · <a href="privacidad.html">Política de privacidad del sitio</a> · <a href="#" data-revisar-cookies>Cookies</a></span></div>\n'
        '    <div class="pie__mapa">\n' + '\n'.join(cols) + '\n    </div>\n  </div>\n</footer>\n' + PIE_FIN
    )


def aplicar(ruta: Path) -> bool:
    html = ruta.read_text(encoding='utf-8')
    original = html
    nombre = ruta.name if ruta.parent == RAIZ else 'archivo-2009.html'
    patron_h = re.compile(re.escape(INICIO) + r'.*?' + re.escape(FIN) + r'|<header class="barra">.*?</header>', re.S)
    patron_f = re.compile(re.escape(PIE_INICIO) + r'.*?' + re.escape(PIE_FIN) + r'|<footer class="pie">.*?</footer>', re.S)
    html = patron_h.sub(lambda _: header(nombre), html, count=1)
    html = patron_f.sub(lambda _: footer(), html, count=1)
    if html != original:
        ruta.write_text(html, encoding='utf-8')
    return html != original


def paginas():
    yield from sorted(RAIZ.glob('*.html'))
    yield RAIZ / 'scripts' / 'archivo2009.plantilla.html'


if __name__ == '__main__':
    for p in paginas():
        print(('actualizada ' if aplicar(p) else 'sin cambios ') + p.name)
