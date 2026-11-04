#!/usr/bin/env python3
"""Dibuja el mapa de loteo de La Lomada como SVG limpio, redibujado a partir del cartel
del ingreso (esquema, no a escala), y lo inserta en la-lomada.html entre
<!-- loteo:inicio --> y <!-- loteo:fin -->.

Uso:  python3 scripts/loteo.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
piezas = []


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def poli(puntos, clase, etiqueta=None, titulo=None, rot=0):
    pts = ' '.join(f'{x:.1f},{y:.1f}' for x, y in puntos)
    t = f'<title>{titulo}</title>' if titulo else ''
    piezas.append(f'<polygon class="{clase}" points="{pts}">{t}</polygon>')
    if etiqueta:
        cx = sum(p[0] for p in puntos) / len(puntos)
        cy = sum(p[1] for p in puntos) / len(puntos)
        tr = f' transform="rotate({rot} {cx:.1f} {cy:.1f})"' if rot else ''
        cls = 'lt-n lt-n--r' if etiqueta.startswith('R') else 'lt-n'
        piezas.append(f'<text class="{cls}" x="{cx:.1f}" y="{cy + 3.5:.1f}"{tr}>{etiqueta}</text>')


D1 = {58, 59, 60, 61, 67, 68, 69, 70}


def manzana(n):
    """Manzana de cada lote según el plano de loteo con colores (coincide con la mensura)."""
    if n <= 10: return 'A3'
    if n <= 16: return 'A2'
    if n == 17: return 'DG'  # desglose
    if n <= 30: return 'A1'
    if n <= 34: return 'B1'
    if n <= 36: return 'B2'
    if n <= 57: return 'C'
    if n <= 70: return 'D1' if n in D1 else 'D2'
    return 'E'


def lote(n):
    if str(n).startswith('R'):
        return ('lt-res', f'Reserva {n}')
    m = manzana(n)
    return (f'lt-lote mz-{m.lower()}', f'Lote {n} · ' + ('desglose' if m == 'DG' else f'manzana {m}'))


def franja(a0, a1, b0, b1, nombres, rot=0):
    """Reparte nombres entre dos bordes (a0→a1 exterior, b0→b1 interior)."""
    k = len(nombres)
    for i, n in enumerate(nombres):
        t0, t1 = i / k, (i + 1) / k
        clase, tit = lote(n)
        poli([lerp(a0, a1, t0), lerp(a0, a1, t1), lerp(b0, b1, t1), lerp(b0, b1, t0)], clase, str(n), tit, rot)


def marcador(x, y, letra):
    piezas.append(f'<g class="lt-punto capa-puntos"><circle cx="{x}" cy="{y}" r="8"/><text x="{x}" y="{y + 3.5}">{letra}</text>'
                  f'<title>Punto {letra} (a confirmar qué es)</title></g>')


# Contorno general y calles
piezas.append('<polygon class="lt-calle" points="12,30 362,30 362,742 282,742 12,30"/>')
# Fondo de manzanas internas (la calle queda como fondo gris)
# Franja oeste: lotes 1–10, R9, 11–30 (de la ruta hacia el norte)
oeste = list(range(1, 11)) + ['R9'] + list(range(11, 31))
franja((266, 700), (12, 30), (302, 672), (62, 30), oeste)
# Franja norte: 31–34, R1, 35, 36
franja((84, 30), (318, 30), (98, 70), (318, 70), [31, 32, 33, 34, 'R1', 35, 36])
# Franja este: 37–57 y R5 (de norte a sur)
franja((362, 30), (362, 690), (330, 30), (330, 690), list(range(37, 58)))
# Sur: bulevar de ingreso desde la RN 131, con R5 (este) y R6 (oeste), rotonda, R8 y
# el club house (R7) hacia la calle pública del oeste.
piezas.append('<polygon class="lt-calle" points="150,700 266,700 282,742 362,742 362,882 150,882"/>')
poli([(330, 690), (362, 690), (362, 882), (342, 882)], 'lt-res', None, 'Reserva R5 (espacio verde)')
piezas.append('<text class="lt-n lt-n--r" x="352" y="812">R5</text>')
poli([(266, 700), (302, 672), (312, 690), (312, 760), (286, 760)], 'lt-res', None, 'Reserva R8 (espacio verde)')
piezas.append('<text class="lt-n lt-n--r" x="294" y="726">R8</text>')
poli([(178, 712), (262, 712), (274, 744), (286, 772), (240, 808), (178, 796)], 'lt-res lt-club', None, 'Reserva R7: club house')
piezas.append('<text class="lt-n lt-n--r" x="226" y="752">R7</text><text class="lt-club-t" x="226" y="766">club house</text>')
poli([(178, 838), (314, 812), (314, 882), (178, 882)], 'lt-res', None, 'Reserva R6')
piezas.append('<text class="lt-n lt-n--r" x="246" y="864">R6</text>')
piezas.append('<text class="lt-calle-t" x="162" y="800" transform="rotate(-90 162 800)">CALLE PÚBLICA</text>')
# Manzana norte (58–70, R2, R3). Los extremos tienen tres filas (58 59 / 70 / 69 y
# 62 63 / 64 / 66 65); el centro, dos (60 61 R2 / 68 67 R3). D está sobre la línea
# que divide 60 de 68.
x0, x1, y0, y1 = 140, 300, 96, 186
cw = (x1 - x0) / 7
def rect(c0, c1, ya, yb, n):
    c, t = lote(n)
    poli([(x0 + c0 * cw, ya), (x0 + c1 * cw, ya), (x0 + c1 * cw, yb), (x0 + c0 * cw, yb)], c, str(n), t)
tercio, medio = (y1 - y0) / 3, (y0 + y1) / 2
for i, n in enumerate([58, 59]): rect(i, i + 1, y0, y0 + tercio, n)
rect(0, 2, y0 + tercio, y0 + 2 * tercio, 70)
rect(0, 2, y0 + 2 * tercio, y1, 69)
for i, n in enumerate([60, 61, 'R2']): rect(2 + i, 3 + i, y0, medio, n)
for i, n in enumerate([68, 67, 'R3']): rect(2 + i, 3 + i, medio, y1, n)
for i, n in enumerate([62, 63]): rect(5 + i, 6 + i, y0, y0 + tercio, n)
rect(5, 7, y0 + tercio, y0 + 2 * tercio, 64)
for i, n in enumerate([66, 65]): rect(5 + i, 6 + i, y0 + 2 * tercio, y1, n)
marcador(round(x0 + 2.5 * cw, 1), medio, 'D')

# Manzana central (71–84): borde izquierdo diagonal. Columna izquierda 71, 84, 83, 82,
# 81, 80; arriba a la derecha 72, 73, 74; columna derecha 75 a 79. E está sobre la
# línea que separa 84 de 75.
top, base, xr = 222, 408, 300
izq = lambda y: 170 + (y - top) * (246 - 170) / (base - top)
filas_c = [[71, 72, 73, 74], [84, 75], [83, 76], [82, 77], [81, 78], [80, 79]]
alto = (base - top) / len(filas_c)
div = lambda y: izq(y) + (xr - izq(y)) * 0.45  # línea entre columna izquierda y derecha
for r, fila in enumerate(filas_c):
    ya, yb = top + r * alto, top + (r + 1) * alto
    if r == 0:
        cortes_a = [izq(ya), div(ya)] + [div(ya) + (xr - div(ya)) * j / 3 for j in (1, 2, 3)]
        cortes_b = [izq(yb), div(yb)] + [div(yb) + (xr - div(yb)) * j / 3 for j in (1, 2, 3)]
    else:
        cortes_a, cortes_b = [izq(ya), div(ya), xr], [izq(yb), div(yb), xr]
    for i, n in enumerate(fila):
        c, t = lote(n)
        poli([(cortes_a[i], ya), (cortes_a[i + 1], ya), (cortes_b[i + 1], yb), (cortes_b[i], yb)], c, str(n), t)
ye = top + 1.5 * alto
marcador(round(div(ye), 1), round(ye, 1), 'E')

# R4: triángulo verde
poli([(250, 428), (300, 428), (300, 590)], 'lt-res', None, 'Reserva R4 (espacio verde)')
piezas.append('<text class="lt-n lt-n--r" x="285" y="470">R4</text>')

# Puntos A, B, C
marcador(170.5, 320, 'A')  # límite 16/17, lado calle
marcador(167, 70, 'B')  # frente del lote 33
marcador(362, 375.7, 'C')  # límite 47/48, lado exterior
# Rotondas e ingreso
piezas.append('<circle class="lt-rotonda" cx="318" cy="612" r="7"><title>Rotonda</title></circle>')
piezas.append('<circle class="lt-rotonda" cx="328" cy="786" r="10"><title>Rotonda del ingreso (acceso al club house)</title></circle>')
piezas.append('<g class="lt-ingreso"><path d="M328 878c-9-12-14-20-14-27a14 14 0 0 1 28 0c0 7-5 15-14 27z"/><circle cx="328" cy="851" r="5"/>'
              '<title>Ingreso principal desde la RN 131</title></g>')
# Ruta
piezas.append('<rect class="lt-ruta" x="0" y="884" width="380" height="24"/>')
piezas.append('<text class="lt-ruta-t" x="12" y="900">RUTA NACIONAL 131</text>')
piezas.append('<text class="lt-ruta-t" x="250" y="900">INGRESO ↑</text>')
# Norte: camino vecinal, estación de bombeo e impulsión a la red municipal
piezas.append('<rect class="lt-vecinal" x="0" y="2" width="380" height="26"/>')
piezas.append('<text class="lt-calle-t" x="96" y="13">CAMINO VECINAL</text>')
piezas.append('<g class="capa-cloaca"><line class="lt-impulsion" x1="340" y1="21" x2="14" y2="21" marker-end="url(#flecha-imp)"/>'
              '<text class="lt-imp-t" x="200" y="13">impulsión a la red municipal</text>'
              '<rect class="lt-bombeo" x="332" y="26" width="22" height="16" rx="3"><title>Estación de bombeo cloacal</title></rect>'
              '<text class="lt-bombeo-t" x="343" y="37">EB</text></g>')
piezas.append('<text class="lt-norte" x="18" y="160">N ↑</text>')
piezas.append('<text class="lt-vecino" x="22" y="330">Loteo</text><text class="lt-vecino" x="22" y="342">vecino</text>')
piezas.append('<text class="lt-vecino" x="60" y="560">Loteo</text><text class="lt-vecino" x="60" y="572">vecino</text>')
# Cloacas: por gravedad hacia el norte, con bocas de registro, hasta la estación de bombeo
def cloaca(pts):
    d = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    piezas.append(f'<polyline class="lt-cloaca" points="{d}" marker-mid="url(#flecha)" marker-end="url(#flecha)"/>')
oeste_c = [lerp((314, 690), (76, 30), t) for t in (0, .2, .4, .6, .8, .92)]
cloaca(oeste_c + [(120, 83), (200, 83), (316, 83)])
cloaca([(316, 700), (316, 560), (316, 420), (316, 280), (316, 140), (316, 83), (330, 40)])
cloaca([(140, 204), (230, 204), (316, 204)])
cloaca([(220, 418), (270, 418), (316, 418)])
for (x, y) in [(316, 700), (316, 420), (316, 204), (316, 83), (140, 204), (220, 418)] + oeste_c[::2]:
    piezas.append(f'<circle class="lt-tv capa-cloaca" cx="{x:.1f}" cy="{y:.1f}" r="2.6"><title>Boca de registro</title></circle>')

DEFS = ('<defs><marker id="flecha" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">'
        '<path class="lt-flecha" d="M1 1L9 5L1 9z"/></marker>'
        '<marker id="flecha-imp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">'
        '<path class="lt-flecha-imp" d="M1 1L9 5L1 9z"/></marker></defs>')
svg = ('<svg class="loteo-svg" viewBox="0 0 380 912" role="img" aria-labelledby="loteo-t loteo-d">' + DEFS +
       '<title id="loteo-t">Mapa de loteo de La Lomada</title>'
       '<desc id="loteo-d">Esquema del barrio: 84 lotes en las manzanas A1, A2 y A3 (franja oeste, lotes 1 a 30, con el 17 como desglose), '
       'B1 y B2 (franja norte, 31 a 36), C (franja este, 37 a 57), D1 y D2 (manzana norte, 58 a 70) y E (manzana central, 71 a 84), '
       'más reservas R1 a R9. El ingreso principal es un bulevar desde la Ruta Nacional 131, con rotonda y club house (R7). '
       'Las cloacas bajan por gravedad hacia el norte hasta una estación de bombeo, que impulsa por el camino vecinal a la red municipal.</desc>'
       + ''.join(piezas) + '</svg>')

if __name__ == '__main__':
    ruta = RAIZ / 'la-lomada.html'
    h = ruta.read_text(encoding='utf-8')
    nuevo = '<!-- loteo:inicio -->' + svg + '<!-- loteo:fin -->'
    h, n = re.subn(r'<!-- loteo:inicio -->.*?<!-- loteo:fin -->', lambda _: nuevo, h, flags=re.S)
    assert n == 1, 'falta el marcador loteo en la-lomada.html'
    ruta.write_text(h, encoding='utf-8')
    print('mapa de loteo actualizado')
