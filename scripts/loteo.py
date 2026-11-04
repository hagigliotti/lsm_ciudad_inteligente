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


def lote(n):
    return ('lt-res', f'Reserva {n}') if str(n).startswith('R') else ('lt-lote', f'Lote {n}')


def franja(a0, a1, b0, b1, nombres, rot=0):
    """Reparte nombres entre dos bordes (a0→a1 exterior, b0→b1 interior)."""
    k = len(nombres)
    for i, n in enumerate(nombres):
        t0, t1 = i / k, (i + 1) / k
        clase, tit = lote(n)
        poli([lerp(a0, a1, t0), lerp(a0, a1, t1), lerp(b0, b1, t1), lerp(b0, b1, t0)], clase, str(n), tit, rot)


def marcador(x, y, letra):
    piezas.append(f'<g class="lt-punto"><circle cx="{x}" cy="{y}" r="8"/><text x="{x}" y="{y + 3.5}">{letra}</text>'
                  f'<title>Punto {letra} (a confirmar qué es)</title></g>')


# Contorno general y calles
piezas.append('<polygon class="lt-calle" points="12,30 362,30 362,742 300,742 12,30"/>')
# Fondo de manzanas internas (la calle queda como fondo gris)
# Franja oeste: lotes 1–10, R9, 11–30 (de la ruta hacia el norte)
oeste = list(range(1, 11)) + ['R9'] + list(range(11, 31))
franja((282, 742), (12, 30), (318, 712), (62, 30), oeste)
# Franja norte: 31–34, R1, 35, 36
franja((84, 30), (318, 30), (98, 70), (318, 70), [31, 32, 33, 34, 'R1', 35, 36])
# Franja este: 37–57 y R5 (de norte a sur)
franja((362, 30), (362, 712), (330, 30), (330, 712), list(range(37, 58)) + ['R5'])
# R8: junto al ingreso
poli([(282, 742), (318, 712), (318, 742)], 'lt-res', None, 'Reserva R8')
piezas.append('<text class="lt-n lt-n--r" x="308" y="736">R8</text>')

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
marcador(178, 338, 'A')  # límite 16/17, lado calle
marcador(167, 70, 'B')  # frente del lote 33
marcador(362, 371, 'C')  # límite 47/48, lado exterior
# Rotonda e ingreso
piezas.append('<circle class="lt-rotonda" cx="318" cy="612" r="7"><title>Rotonda</title></circle>')
piezas.append('<g class="lt-ingreso"><path d="M324 778c-9-12-14-20-14-27a14 14 0 0 1 28 0c0 7-5 15-14 27z"/><circle cx="324" cy="751" r="5"/>'
              '<title>Ingreso desde la RN 131</title></g>')
# Ruta
piezas.append('<rect class="lt-ruta" x="0" y="784" width="380" height="22"/>')
piezas.append('<text class="lt-ruta-t" x="12" y="800">RUTA NACIONAL 131</text>')
piezas.append('<text class="lt-norte" x="14" y="20">N ↑</text>')
piezas.append('<text class="lt-ingreso-t" x="356" y="772">Ingreso</text>')

svg = ('<svg class="loteo-svg" viewBox="0 0 380 810" role="img" aria-labelledby="loteo-t loteo-d">'
       '<title id="loteo-t">Mapa de loteo de La Lomada</title>'
       '<desc id="loteo-d">Esquema del barrio: 84 lotes en una franja oeste (1 a 30), una franja norte (31 a 36), '
       'una franja este (37 a 57), una manzana norte (58 a 70) y una manzana central (71 a 84), más reservas R1 a R9. '
       'El único ingreso está en la punta sur, sobre la Ruta Nacional 131.</desc>'
       + ''.join(piezas) + '</svg>')

if __name__ == '__main__':
    ruta = RAIZ / 'la-lomada.html'
    h = ruta.read_text(encoding='utf-8')
    nuevo = '<!-- loteo:inicio -->' + svg + '<!-- loteo:fin -->'
    h, n = re.subn(r'<!-- loteo:inicio -->.*?<!-- loteo:fin -->', lambda _: nuevo, h, flags=re.S)
    assert n == 1, 'falta el marcador loteo en la-lomada.html'
    ruta.write_text(h, encoding='utf-8')
    print('mapa de loteo actualizado')
