#!/usr/bin/env python3
"""Casa de ejemplo anotada: render + equipos dibujados (paneles solares, termotanque
solar, tanque de agua, pavimento drenante, cargador…) + puntos numerados.

Se inserta igual en la-lomada.html y casa-simple.html, entre
<!-- casa-anotada:inicio --> y <!-- casa-anotada:fin -->.

Uso:  python3 scripts/casa_anotada.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
E = 90  # cielo agregado arriba del render original (1280 x 431)

# (x, y en el render original, título, explicación)
PUNTOS = [
    (470, 22, 'Paneles solares', 'Sobre el techo plano: producen electricidad de día. El sistema muestra cuánto se genera, usa lo que sobra para el termotanque, el lavarropas o el auto, y avisa si un panel rinde menos por suciedad o sombra.'),
    (1075, 26, 'Termotanque solar', 'Calienta el agua con el sol. Un sensor de temperatura prende la resistencia de apoyo solo los días nublados y protege los tubos de las heladas.'),
    (810, 40, 'Tanque de agua', 'Sensor de nivel en el tanque de reserva: avisa si baja de golpe (pérdida), si se queda vacío, y corta la bomba para que no trabaje en seco.'),
    (935, 10, 'Estación meteorológica', 'Pluviómetro, viento y temperatura en el techo. Con esos datos la casa cierra cortinas con viento fuerte y no riega si llovió.'),
    (660, 78, 'Agua en el techo plano', 'Un techo plano con parapeto junta agua. Un sensor en cada desagüe avisa si se tapa antes de que filtre.'),
    (380, 106, 'LED de contorno', 'La línea de luz bajo el borde del techo ya está en el diseño. Se prende sola al anochecer, baja de intensidad a medianoche y parpadea si hay una alarma.'),
    (830, 142, 'Luz del alero con presencia', 'Se enciende al llegar alguien y queda tenue el resto de la noche.'),
    (800, 268, 'Cerradura inteligente', 'En la puerta doble: abre con huella, código o el celular, y avisa si quedó sin llave. Las visitas reciben un código que vence.'),
    (884, 236, 'Timbre con cámara', 'Atiende desde el celular aunque no haya nadie, y graba solo cuando alguien se acerca a la puerta. La imagen se queda en casa.'),
    (204, 214, 'Ventanas y cortinas', 'Sensor de apertura y de vibración en cada ventana. Las cortinas se bajan solas con el sol fuerte o al salir de viaje, y simulan presencia.'),
    (648, 186, 'Ventana chica: humedad', 'Si es baño o lavadero: sensor de humedad que prende la ventilación y avisa si hay pérdida de agua en el piso.'),
    (1078, 214, 'Dormitorios', 'Sensores de apertura, temperatura y humedad. El aire acondicionado no arranca si la ventana quedó abierta.'),
    (940, 300, 'Medidor de energía', 'En el tablero: muestra en el celular cuánto consume cada circuito, cuánto aportan los paneles, y corta lo que quedó prendido.'),
    (1205, 300, 'Cargador de auto eléctrico', 'Carga cuando sobra energía solar o en el horario más barato, y avisa cuando terminó.'),
    (540, 350, 'Macetas y jardín', 'Sensor de humedad de tierra con riego por goteo: riega solo cuando hace falta y no riega si va a llover.'),
    (650, 388, 'Luces de camino', 'Balizas en el piso que se encienden con poca luz y guían hasta la puerta.'),
    (880, 412, 'Pavimento drenante', 'El piso de la entrada deja pasar la lluvia hacia una cisterna enterrada. Un sensor de nivel decide cuándo usar esa agua para riego o lavado, y la entrada no se encharca.'),
]


def paneles():
    s = []
    # Paneles fotovoltaicos: dos filas inclinadas detrás del parapeto del ala izquierda
    for fila, (y0, alto) in enumerate([(E - 22, 34), (E + 4, 42)]):  # fila de atrás primero
        for i in range(5):
            x = 170 + i * 92 - fila * 20
            w = 78 + fila * 4
            s.append(f'<g class="cx-panel"><polygon points="{x},{y0 + alto} {x + w},{y0 + alto} {x + w - 6},{y0} {x + 6},{y0}"/>')
            for k in range(1, 6):
                xa, xb = x + w * k / 6, x + 6 + (w - 12) * k / 6
                s.append(f'<line x1="{xa:.1f}" y1="{y0 + alto}" x2="{xb:.1f}" y2="{y0}"/>')
            for k in (1, 2):
                yy = y0 + alto * k / 3
                s.append(f'<line x1="{x + 6 * (1 - k / 3):.1f}" y1="{yy:.1f}" x2="{x + w - 6 * (1 - k / 3):.1f}" y2="{yy:.1f}"/>')
            s.append('</g>')
    # Termotanque solar: tanque horizontal + tubos de vacío
    s.append(f'<g class="cx-termo"><rect class="cx-termo__tubos" x="990" y="{E + 2}" width="170" height="44"/>')
    for k in range(0, 18):
        x = 996 + k * 9.4
        s.append(f'<line x1="{x:.1f}" y1="{E + 4}" x2="{x:.1f}" y2="{E + 44}"/>')
    s.append(f'<rect class="cx-termo__tanque" x="984" y="{E - 22}" width="182" height="26" rx="13"/>'
             f'<line class="cx-pata" x1="1000" y1="{E + 4}" x2="1000" y2="{E + 46}"/><line class="cx-pata" x1="1150" y1="{E + 4}" x2="1150" y2="{E + 46}"/></g>')
    # Tanque de agua (cilindro negro) y estación meteorológica
    s.append(f'<g class="cx-tanque"><rect x="772" y="{E + 10}" width="76" height="52" rx="6"/><ellipse cx="810" cy="{E + 10}" rx="38" ry="8"/>'
             f'<line x1="774" y1="{E + 30}" x2="846" y2="{E + 30}"/><line x1="774" y1="{E + 46}" x2="846" y2="{E + 46}"/></g>')
    s.append(f'<g class="cx-meteo"><line x1="905" y1="{E + 62}" x2="905" y2="{E - 6}"/><line x1="890" y1="{E - 6}" x2="920" y2="{E - 6}"/>'
             f'<circle cx="890" cy="{E - 6}" r="4"/><circle cx="920" cy="{E - 6}" r="4"/><rect x="899" y="{E + 14}" width="12" height="10" rx="2"/></g>')
    # Pavimento drenante: juntas verdes y flecha de agua hacia la cisterna
    s.append(f'<g class="cx-pav">')
    for k in range(8):
        x = 420 + k * 70
        s.append(f'<line x1="{x}" y1="{E + 398}" x2="{x - 14}" y2="{E + 431}"/>')
    s.append(f'<line x1="400" y1="{E + 412}" x2="990" y2="{E + 412}"/></g>')
    # Cargador en la pared derecha
    s.append(f'<g class="cx-carga"><rect x="1190" y="{E + 250}" width="30" height="40" rx="5"/><path d="M1207 {E + 258}l-7 12h6l-3 11 9-14h-6z"/></g>')
    return ''.join(s)


def figura():
    pts = ''.join(f'<g class="casa-pt"><circle cx="{x}" cy="{y + E}" r="17"/><text x="{x}" y="{y + E + 6}">{i + 1}</text><title>{t}</title></g>'
                  for i, (x, y, t, _) in enumerate(PUNTOS))
    lista = ''.join(f'<li><b>{t}</b>{d}</li>' for (_, _, t, d) in PUNTOS)
    return ('<figure class="casa-anotada">\n      <div class="casa-anotada__lienzo">\n'
            '        <img src="assets/img/la-lomada/casa-render-amplia.jpg" alt="Render de una casa de una planta con frente gris, '
            'zócalo y parapeto de piedra oscura, luz LED bajo el techo, puerta doble de madera bajo un alero iluminado, tres ventanas '
            'blancas y dos macetas grandes; sobre el techo se dibujaron paneles solares, un termotanque solar, un tanque de agua y una '
            'estación meteorológica" width="1280" height="521" loading="lazy">\n'
            f'        <svg viewBox="0 0 1280 {431 + E}" aria-hidden="true">{paneles()}{pts}</svg>\n'
            '      </div>\n      <figcaption>Imagen ilustrativa: render generado con IA; los paneles, el termotanque, el tanque, la '
            'estación, el cargador y el pavimento drenante están dibujados encima. Los números indican lugares típicos, no la instalación real.</figcaption>\n'
            f'    </figure>\n    <ol class="casa-puntos">{lista}</ol>')


if __name__ == '__main__':
    bloque = '<!-- casa-anotada:inicio -->\n    ' + figura() + '\n    <!-- casa-anotada:fin -->'
    for nombre in ('la-lomada.html', 'casa-simple.html'):
        ruta = RAIZ / nombre
        h = ruta.read_text(encoding='utf-8')
        h, n = re.subn(r'<!-- casa-anotada:inicio -->.*?<!-- casa-anotada:fin -->', lambda _: bloque, h, flags=re.S)
        assert n == 1, nombre
        ruta.write_text(h, encoding='utf-8')
        print('actualizada', nombre)
