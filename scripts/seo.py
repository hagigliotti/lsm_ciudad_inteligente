#!/usr/bin/env python3
"""SEO del sitio: título, descripción, palabras clave, Open Graph, datos estructurados
(JSON-LD), sitemap.xml y robots.txt.

Uso:  python3 scripts/seo.py
Se edita PAGINAS y se vuelve a correr. El bloque va entre <!-- seo:inicio --> y
<!-- seo:fin --> dentro del <head>. Las pruebas (tests/seo.test.mjs) verifican que
todas las páginas lo tengan y que el sitemap esté completo.
"""
import html
import json
import re
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
URL = 'https://hagigliotti.github.io/lsm_ciudad_inteligente/'
IMAGEN = URL + 'assets/logos/portada.jpg'
AUTOR = 'Hernando A. Gigliotti'
SITIO = 'LSM Ciudad Inteligente'
# Verificación de Google Search Console (método «Etiqueta HTML»)
GOOGLE_VERIFICACION = 'Hc9aPmTBxVf0O-psSnvX-bBOQnok3qnJpFTHAMOP9Oc'

# Palabras clave comunes por proyecto. Se combinan con las propias de cada página.
LUGAR = ['Libertador San Martín', 'Villa Libertador San Martín', 'Puiggari', 'Entre Ríos', 'Argentina', 'LSM']
CIUDAD = ['ciudad inteligente', 'smart city', 'ciudad inteligente Argentina', 'ciudad inteligente Entre Ríos',
          'Libertador San Martín ciudad inteligente', 'municipio inteligente', 'gestión urbana', 'innovación municipal']
BARRIO = ['barrio privado inteligente', 'barrio inteligente', 'smart neighborhood', 'barrio cerrado', 'country',
          'loteo', 'barrio privado Puiggari', 'barrio privado Libertador San Martín', 'barrio privado Entre Ríos',
          'control de acceso barrio', 'seguridad barrio privado', 'fibra óptica barrio']
CASA = ['casa inteligente', 'smart home', 'domótica', 'domótica Argentina', 'domótica Entre Ríos',
        'automatización del hogar', 'hogar conectado', 'sensores para casa', 'Home Assistant', 'Matter', 'Zigbee']

# archivo: (título, descripción, [palabras clave propias], grupo, tipo de schema)
PAGINAS = {
    'index.html': (
        'LSM Ciudad Inteligente · Libertador San Martín, Entre Ríos',
        'Proyecto de ciudad inteligente para Libertador San Martín y Puiggari (Entre Ríos): plan 2026, barrio privado inteligente, casa inteligente y lo que se aprendió del proyecto de 2009.',
        ['proyecto ciudad inteligente', 'Libertador San Martín 2026', 'Hernando Gigliotti'], 'todo', 'WebSite'),
    'ciudad-hoy.html': (
        'Libertador San Martín hoy: servicios, problemas y reclamos',
        'Cómo están hoy Libertador San Martín, Puiggari y alrededores: lluvias, pavimento, cámaras, tránsito, agua, salud, internet, crecimiento y reclamos de vecinos, con fuentes.',
        ['Libertador San Martín noticias', 'reclamos vecinos Libertador San Martín', 'Municipalidad de Libertador San Martín',
         'inundaciones Libertador San Martín', 'agua Libertador San Martín', 'internet Puiggari', 'tránsito Puiggari'], 'ciudad', 'WebPage'),
    'archivo-2009.html': (
        'Archivo 2009 · Libertador San Martín, una Ciudad Inteligente',
        'El blog original del proyecto Libertador San Martín, una Ciudad Inteligente (julio de 2009), archivado completo y con enlaces a cada página original.',
        ['proyecto 2009', 'ciudad digital', 'WiFi municipal', 'blog ciudad inteligente 2009'], 'ciudad', 'CollectionPage'),
    'biblioteca-2009.html': (
        'El original de 2009 en la Biblioteca UAP · LSM Ciudad Inteligente',
        'Dónde encontrar la monografía original “Libertador San Martín, una ciudad inteligente” (Gigliotti, 2009) en la Biblioteca E. Irving Mohr de la Universidad Adventista del Plata: signatura 004.6 G.459, ejemplares y reserva.',
        ['Biblioteca UAP', 'Biblioteca E. Irving Mohr', 'Universidad Adventista del Plata', 'UAP', 'monografía', 'Licenciatura en Sistemas de Información',
         'Hernando Ariel Gigliotti', 'Libertador San Martín, una ciudad inteligente', 'catálogo biblioteca UAP'], 'ciudad', 'Book'),
    'fallas-2009.html': (
        'Fallas del proyecto Ciudad Inteligente 2009 · LSM',
        'Qué le faltó al proyecto Ciudad Inteligente de Libertador San Martín de 2009, qué cambió desde entonces y qué reglas dejó para hoy.',
        ['lecciones aprendidas', 'por qué fallan las ciudades inteligentes', 'proyecto 2009'], 'ciudad', 'Article'),
    'en-simple.html': (
        'Ciudad inteligente explicada fácil · Libertador San Martín',
        'El plan de ciudad inteligente de Libertador San Martín explicado fácil, con dibujos y ejemplos: qué es, qué vas a notar, cómo se cuidan tus datos, cuánto cuesta y cuándo llega.',
        ['qué es una ciudad inteligente', 'ciudad inteligente explicada', 'beneficios ciudad inteligente'], 'ciudad', 'Article'),
    'plan-maestro.html': (
        'Plan Maestro 2027–2036 · Libertador San Martín ciudad inteligente',
        'Plan Maestro técnico de Libertador San Martín, ciudad inteligente: arquitectura, redes, IA, robótica, datos, ciberseguridad, privacidad, gobernanza, presupuesto y hoja de ruta 2027–2036.',
        ['plan maestro ciudad inteligente', 'plan director smart city', 'gemelo digital', 'IoT municipal', 'LoRaWAN',
         'inteligencia artificial municipio', 'ciberseguridad municipal'], 'ciudad', 'TechArticle'),
    'proyecto-2026.html': (
        'Proyecto 2026: mapa, costos y cronograma · LSM Ciudad Inteligente',
        'El proyecto para hacer de Libertador San Martín una ciudad inteligente: mapa de lo que va en cada lugar, costos, cronograma, seguridad y robótica.',
        ['costos ciudad inteligente', 'cronograma smart city', 'cámaras de seguridad municipio', 'sensores urbanos'], 'ciudad', 'WebPage'),
    'escalas.html': (
        'Ciudad, barrio y casa inteligente: cómo encajan · LSM',
        'Marco común de los proyectos LSM: qué le toca a la ciudad, al barrio privado y a cada casa inteligente, qué datos se comparten, capas comunes, IA, robótica y continuidad.',
        ['integración ciudad barrio casa', 'interoperabilidad', 'datos abiertos'], 'todo', 'TechArticle'),
    'barrio-simple.html': (
        'Barrio privado inteligente explicado fácil · Puiggari y LSM',
        'Cómo un barrio privado o cooperativo puede usar tecnología para el acceso, la seguridad, el agua, la luz y las expensas, explicado fácil. Pensado para Puiggari y Libertador San Martín.',
        ['qué es un barrio inteligente', 'acceso con QR', 'lectura de patentes', 'expensas', 'app para barrio privado'], 'barrio', 'Article'),
    'barrio-tecnico.html': (
        'Barrio privado inteligente: diseño técnico y costos',
        'Especificación técnica de un barrio privado inteligente en Entre Ríos: red de fibra, control de acceso, perímetro, agua, energía, plataforma, reglamento y costos.',
        ['proyecto barrio privado', 'infraestructura barrio privado', 'red FTTH', 'cerco perimetral inteligente',
         'telemetría de agua', 'alumbrado LED telegestión', 'reglamento barrio privado'], 'barrio', 'TechArticle'),
    'la-lomada.html': (
        'Barrio La Lomada, Puiggari: loteo, plano y barrio inteligente',
        'Barrio privado La Lomada de Puiggari, Libertador San Martín: mapa de loteo con 84 lotes, plano de mensura, servicios y cómo prepararlo para agua, energía, conectividad y seguridad inteligentes.',
        ['La Lomada', 'barrio La Lomada', 'La Lomada Puiggari', 'La Lomada Libertador San Martín', 'lotes en Puiggari',
         'terrenos en Libertador San Martín', 'barrio privado Ruta 131', 'plano de loteo'], 'barrio', 'WebPage'),
    'casa-simple.html': (
        'Casa inteligente explicada fácil: qué automatizar y cuánto cuesta',
        'Qué se puede automatizar en una casa, por dónde empezar, cuánto cuesta cada nivel y cómo cuidar tus datos, explicado fácil. Domótica para casas de Entre Ríos y Argentina.',
        ['cómo hacer una casa inteligente', 'domótica barata', 'cuánto cuesta una casa inteligente', 'sensores de agua y gas',
         'cerradura inteligente', 'luces inteligentes'], 'casa', 'Article'),
    'casa-tecnico.html': (
        'Casa inteligente: diseño técnico, equipos y costos',
        'Diseño técnico de una casa inteligente local: protocolos (Matter, Zigbee, Thread), red segmentada, equipos y costos, automatizaciones, energía, cuidado de mayores y privacidad.',
        ['instalación domótica', 'proyecto domótica', 'Thread', 'Wi-Fi', 'red domótica segura', 'automatizaciones hogar',
         'cuidado de adultos mayores sensores'], 'casa', 'TechArticle'),
    'casa-simulador.html': (
        'Simulador de casa inteligente: probá sensores y calculá costos',
        'Simulador interactivo de casa inteligente: 4 tipos de casa, 5 niveles, 67 sensores y equipos, 19 situaciones (ladrón, pérdida de agua, gas, mascotas), avisos al celular y costos.',
        ['simulador domótica', 'simulador casa inteligente', 'calculadora domótica', 'alarma inteligente',
         'sensor de fuga de agua', 'detector de gas', 'cámara de seguridad'], 'casa', 'WebApplication'),
    'datos-personales.html': (
        'Datos personales en ciudad, barrio y casa inteligente',
        'Qué datos personales usan los proyectos de ciudad, barrio privado y casa inteligente, cuáles son sensibles según la Ley 25.326 y cómo se protege cada uno.',
        ['protección de datos personales', 'Ley 25.326', 'datos sensibles', 'privacidad smart city', 'privacidad domótica'], 'todo', 'WebPage'),
    'privacidad.html': (
        'Política de privacidad · LSM Ciudad Inteligente',
        'Qué datos recolecta este sitio, para qué, a quién se envían, cómo se usa la IA y cómo pedir que se borren.',
        ['política de privacidad', 'cookies'], 'todo', 'WebPage'),
    'seguridad.html': (
        'Seguridad del sitio y de la plataforma · LSM Ciudad Inteligente',
        'Cómo se protegen el sitio y la futura plataforma de ciudad, barrio y casa inteligente: validación, límites de uso, sesiones, CORS, errores y pruebas.',
        ['ciberseguridad', 'seguridad informática', 'OWASP'], 'todo', 'WebPage'),
}

GRUPOS = {'ciudad': CIUDAD, 'barrio': BARRIO + CIUDAD[:2], 'casa': CASA + CIUDAD[:2], 'todo': CIUDAD[:3] + BARRIO[:2] + CASA[:3]}
MIGAS = {'ciudad': None, 'barrio': ('Barrio privado inteligente', 'barrio-simple.html'),
         'casa': ('Casa particular inteligente', 'casa-simple.html'), 'todo': None}

INICIO, FIN = '<!-- seo:inicio -->', '<!-- seo:fin -->'


def palabras(propias, grupo):
    vistas, salida = set(), []
    for p in propias + GRUPOS[grupo] + LUGAR:
        if p.lower() not in vistas:
            vistas.add(p.lower())
            salida.append(p)
    return salida


def jsonld(archivo, titulo, desc, tipo, grupo, claves):
    url = URL if archivo == 'index.html' else URL + archivo
    lugar = {'@type': 'Place', 'name': 'Libertador San Martín', 'alternateName': ['Villa Libertador San Martín', 'Puiggari'],
             'address': {'@type': 'PostalAddress', 'addressLocality': 'Libertador San Martín',
                         'addressRegion': 'Entre Ríos', 'postalCode': '3103', 'addressCountry': 'AR'},
             'geo': {'@type': 'GeoCoordinates', 'latitude': -32.0717, 'longitude': -60.4597}}
    autor = {'@type': 'Person', 'name': AUTOR, 'url': 'https://hagigliotti.github.io/website/'}
    pagina = {'@type': tipo, '@id': url + '#pagina', 'url': url, 'name': titulo, 'description': desc,
              'inLanguage': 'es-AR', 'keywords': ', '.join(claves[:15]), 'image': IMAGEN,
              'isPartOf': {'@id': URL + '#sitio'}, 'about': lugar, 'author': autor}
    if tipo in ('Article', 'TechArticle'):
        pagina['headline'] = titulo
    if tipo == 'Book':
        pagina['@type'] = 'WebPage'
        pagina['mainEntity'] = {'@type': 'Book', 'name': 'Libertador San Martín, una ciudad inteligente', 'datePublished': '2009',
            'author': {'@type': 'Person', 'name': 'Hernando Ariel Gigliotti'}, 'numberOfPages': 91,
            'inLanguage': 'es', 'bookFormat': 'https://schema.org/Paperback',
            'publisher': {'@type': 'CollegeOrUniversity', 'name': 'Universidad Adventista del Plata'},
            'about': ['Redes de computadoras', 'Telecomunicaciones', 'Libertador San Martín (Entre Ríos)'],
            'locationCreated': {'@type': 'Place', 'name': 'Libertador San Martín, Entre Ríos'},
            'workExample': {'@type': 'Book', 'identifier': '004.6 G.459 2009',
                'holdingArchive': {'@type': 'Library', 'name': 'Biblioteca E. Irving Mohr', 'url': 'https://biblioteca.uap.edu.ar/',
                    'address': {'@type': 'PostalAddress', 'streetAddress': '25 de Mayo 99', 'postalCode': '3103',
                                'addressLocality': 'Libertador San Martín', 'addressRegion': 'Entre Ríos', 'addressCountry': 'AR'}}}}
    if tipo == 'WebApplication':
        pagina.update({'applicationCategory': 'EducationalApplication', 'operatingSystem': 'Navegador web',
                       'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'ARS'}})
    grafo = [pagina]
    if archivo == 'index.html':
        pagina['@type'] = 'WebSite'
        pagina['@id'] = URL + '#sitio'
        del pagina['isPartOf']
        pagina['publisher'] = autor
    else:
        migas = [('Inicio', URL)]
        if MIGAS[grupo] and MIGAS[grupo][1] != archivo:
            migas.append((MIGAS[grupo][0], URL + MIGAS[grupo][1]))
        migas.append((titulo, url))
        grafo.append({'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(migas)]})
    texto = json.dumps({'@context': 'https://schema.org', '@graph': grafo}, ensure_ascii=False, indent=1)
    return texto.replace('</', '<\\/')


def bloque(archivo):
    titulo, desc, propias, grupo, tipo = PAGINAS[archivo]
    claves = palabras(propias, grupo)
    url = URL if archivo == 'index.html' else URL + archivo
    e = lambda s: html.escape(s, quote=True)
    return '\n'.join([
        INICIO,
        f'  <title>{e(titulo)}</title>',
        f'  <meta name="description" content="{e(desc)}">',
        f'  <meta name="keywords" content="{e(", ".join(claves))}">',
        f'  <meta name="author" content="{AUTOR}">',
        f'  <meta name="google-site-verification" content="{GOOGLE_VERIFICACION}">',
        '  <meta name="robots" content="index, follow, max-image-preview:large">',
        '  <meta name="geo.region" content="AR-E">',
        '  <meta name="geo.placename" content="Libertador San Martín, Entre Ríos">',
        '  <meta name="geo.position" content="-32.0717;-60.4597">',
        '  <meta name="ICBM" content="-32.0717, -60.4597">',
        f'  <link rel="canonical" href="{url}">',
        f'  <link rel="sitemap" type="application/xml" href="sitemap.xml">',
        '  <meta property="og:type" content="' + ('website' if archivo == 'index.html' else 'article') + '">',
        f'  <meta property="og:site_name" content="{SITIO}">',
        '  <meta property="og:locale" content="es_AR">',
        f'  <meta property="og:url" content="{url}">',
        f'  <meta property="og:title" content="{e(titulo)}">',
        f'  <meta property="og:description" content="{e(desc)}">',
        f'  <meta property="og:image" content="{IMAGEN}">',
        '  <meta name="twitter:card" content="summary_large_image">',
        f'  <meta name="twitter:title" content="{e(titulo)}">',
        f'  <meta name="twitter:description" content="{e(desc)}">',
        f'  <meta name="twitter:image" content="{IMAGEN}">',
        '  <script type="application/ld+json">\n' + jsonld(archivo, titulo, desc, tipo, grupo, claves) + '\n  </script>',
        '  ' + FIN,
    ])


VIEJAS = re.compile(r'\s*(<title>.*?</title>|<meta name="(description|keywords|author|robots|geo\.[a-z]+|ICBM)"[^>]*>'
                    r'|<meta (property|name)="(og|twitter):[^"]+"[^>]*>|<link rel="(canonical|sitemap)"[^>]*>)', re.S)


def aplicar(ruta: Path, archivo: str) -> bool:
    h = ruta.read_text(encoding='utf-8')
    original = h
    h = re.sub(r'\s*' + re.escape(INICIO) + r'.*?' + re.escape(FIN), '', h, flags=re.S)
    cabeza_fin = h.index('</head>')
    cabeza = VIEJAS.sub('', h[:cabeza_fin])
    ancla = re.search(r'<meta name="referrer"[^>]*>', cabeza)
    cabeza = cabeza[:ancla.end()] + '\n  ' + bloque(archivo) + cabeza[ancla.end():]
    h = cabeza + h[cabeza_fin:]
    if h != original:
        ruta.write_text(h, encoding='utf-8')
    return h != original


def sitemap():
    hoy = date.today().isoformat()
    prioridad = {'index.html': '1.0', 'la-lomada.html': '0.9', 'barrio-simple.html': '0.9', 'casa-simple.html': '0.9',
                 'casa-simulador.html': '0.9', 'en-simple.html': '0.9', 'privacidad.html': '0.3', 'seguridad.html': '0.4'}
    filas = []
    for archivo in PAGINAS:
        url = URL if archivo == 'index.html' else URL + archivo
        filas.append(f'  <url><loc>{url}</loc><lastmod>{hoy}</lastmod><priority>{prioridad.get(archivo, "0.7")}</priority></url>')
    (RAIZ / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                                      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                      + '\n'.join(filas) + '\n</urlset>\n', encoding='utf-8')
    (RAIZ / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /entrada/\n\nSitemap: {URL}sitemap.xml\n', encoding='utf-8')


if __name__ == '__main__':
    for archivo in PAGINAS:
        print(('actualizada ' if aplicar(RAIZ / archivo, archivo) else 'sin cambios ') + archivo)
    aplicar(RAIZ / 'scripts' / 'archivo2009.plantilla.html', 'archivo-2009.html')
    sitemap()
    print('sitemap.xml y robots.txt listos')
