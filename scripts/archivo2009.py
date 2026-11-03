#!/usr/bin/env python3
"""Genera archivo-2009.html a partir de la exportación de WordPress del blog original.

Uso:  python3 scripts/archivo2009.py
Lee   docs/archivo-2009/*.xml  y las imágenes de esa carpeta.
El HTML se limpia con una lista blanca de etiquetas: no pasa ningún script, estilo ni atributo raro.
La página "Contacto" se omite a propósito (tenía teléfonos y un email personales de 2009).
"""
import glob, html, os, re, unicodedata, xml.etree.ElementTree as ET
from html.parser import HTMLParser

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETA = os.path.join(RAIZ, 'docs', 'archivo-2009')
NS = {'content': 'http://purl.org/rss/1.0/modules/content/', 'wp': 'http://wordpress.org/export/1.2/'}
OMITIR = {'Contacto', 'Download'}
PERMITIDAS = {'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
              'h2', 'h3', 'h4', 'h5', 'blockquote', 'figure', 'figcaption', 'img', 'a', 'sup', 'sub', 'span'}
VACIAS = {'br', 'img'}


def imagen_local(url):
    nombre = re.sub(r'\?.*$', '', url.rsplit('/', 1)[-1])
    return f'docs/archivo-2009/{nombre}' if os.path.exists(os.path.join(CARPETA, nombre)) else None


class Limpiador(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.salida, self.pila = [], []

    def handle_starttag(self, tag, attrs):
        tag = {'h1': 'h3', 'b': 'strong', 'i': 'em'}.get(tag, tag)
        if tag not in PERMITIDAS:
            return
        a = dict(attrs)
        extra = ''
        if tag == 'img':
            src = imagen_local(a.get('src', ''))
            if not src:
                return
            alt = html.escape(a.get('alt') or a.get('title') or 'Imagen del proyecto 2009', quote=True)
            self.salida.append(f'<img src="{src}" alt="{alt}" loading="lazy">')
            return
        if tag == 'a':
            href = a.get('href', '')
            local = imagen_local(href) if re.search(r"\.(jpe?g|png|gif|pdf)(\?|$)", href, re.I) else None
            if local:
                href = local
            elif not href.startswith('https://') and href.startswith('http://'):
                href = 'https://' + href[len('http://'):]
            # Solo se conservan enlaces al propio blog: los dominios viejos pueden haber cambiado de dueño.
            if local or href.startswith('https://lsmciudadinteligente.wordpress.com/'):
                extra = f' href="{html.escape(href, quote=True)}" rel="noopener"'
        if tag in ('td', 'th') and a.get('colspan', '').isdigit():
            extra = f' colspan="{a["colspan"]}"'
        self.salida.append(f'<{tag}{extra}>')
        if tag not in VACIAS:
            self.pila.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        tag = {'h1': 'h3', 'b': 'strong', 'i': 'em'}.get(tag, tag)
        if tag in self.pila:
            while self.pila:
                t = self.pila.pop()
                self.salida.append(f'</{t}>')
                if t == tag:
                    break

    def handle_data(self, data):
        self.salida.append(html.escape(data, quote=False))

    def resultado(self):
        while self.pila:
            self.salida.append(f'</{self.pila.pop()}>')
        return ''.join(self.salida)


def leyendas(texto):
    # [caption ...]<a><img></a> Leyenda[/caption] → <figure>…<figcaption>
    def figura(m):
        cuerpo = m.group(2)
        img = re.search(r'<img[^>]*>', cuerpo)
        texto_ley = re.sub(r'<[^>]+>', '', cuerpo).strip() or html.unescape(re.search(r'caption="([^"]*)"', m.group(1)).group(1) if 'caption="' in m.group(1) else '')
        alt = html.escape(texto_ley, quote=True)
        img_html = re.sub(r'<img', f'<img alt="{alt}"', img.group(0)) if img else ''
        enlace = re.search(r'<a [^>]*href="([^"]+)"', cuerpo)
        if img_html and enlace:
            img_html = f'<a href="{enlace.group(1)}">{img_html}</a>'
        return f'\n\n<figure>{img_html}<figcaption>{html.escape(texto_ley)}</figcaption></figure>\n\n'
    return re.sub(r'\[caption([^\]]*)\](.*?)\[/caption\]', figura, texto, flags=re.S)


def parrafos(texto):
    bloques = re.split(r'\n\s*\n', texto.replace('\r\n', '\n'))
    salida = []
    for b in bloques:
        b = b.strip()
        if not b:
            continue
        if re.match(r'^<(table|ul|ol|h\d|figure|blockquote|div|p)\b', b, re.I):
            salida.append(b)
        else:
            salida.append('<p>' + b.replace('\n', '<br>') + '</p>')
    return '\n'.join(salida)


def limpiar(contenido):
    l = Limpiador()
    l.feed(parrafos(leyendas(contenido)))
    out = l.resultado()
    out = re.sub(r'<p>\s*(<br>\s*)*</p>', '', out)
    return out


def slug(t):
    t = unicodedata.normalize('NFKD', html.unescape(t).lower()).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def main():
    xml = sorted(glob.glob(os.path.join(CARPETA, '*.xml')))[0]
    canal = ET.parse(xml).getroot().find('channel')
    paginas, entradas = [], []
    for it in canal.findall('item'):
        tipo = it.findtext('wp:post_type', namespaces=NS)
        if it.findtext('wp:status', namespaces=NS) != 'publish' or tipo not in ('page', 'post'):
            continue
        titulo = (it.findtext('title') or '').strip()
        if titulo in OMITIR:
            continue
        reg = {'titulo': titulo, 'fecha': it.findtext('wp:post_date', namespaces=NS)[:10],
               'orden': int(it.findtext('wp:menu_order', namespaces=NS) or 0),
               'html': limpiar(it.findtext('content:encoded', namespaces=NS) or '')}
        (paginas if tipo == 'page' else entradas).append(reg)
    paginas.sort(key=lambda p: p['orden'])
    entradas.sort(key=lambda p: p['fecha'])

    secciones = []
    for p in paginas:
        cuerpo = p['html']
        if p['titulo'].startswith('1.'):
            cuerpo = ''.join(f'<h3>{html.escape(e["titulo"])}</h3>{e["html"]}' for e in entradas)
        secciones.append((slug(p['titulo']), p['titulo'], cuerpo))

    indice = '\n'.join(f'<li><a href="#{s}">{html.escape(t)}</a></li>' for s, t, _ in secciones)
    cuerpo = '\n'.join(f'<section class="archivo__sec" id="{s}"><h2>{html.escape(t)}</h2>{c}</section>' for s, t, c in secciones)
    plantilla = open(os.path.join(RAIZ, 'scripts', 'archivo2009.plantilla.html'), encoding='utf-8').read()
    salida = plantilla.replace('{{TITULO_BLOG}}', html.escape(canal.findtext('title').strip('"'))) \
                      .replace('{{INDICE}}', indice).replace('{{CONTENIDO}}', cuerpo)
    open(os.path.join(RAIZ, 'archivo-2009.html'), 'w', encoding='utf-8').write(salida)
    print(f'archivo-2009.html: {len(secciones)} secciones, {len(entradas)} entradas')


if __name__ == '__main__':
    main()
