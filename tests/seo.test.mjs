// SEO: cada página tiene título, descripción, palabras clave, canonical, Open Graph y
// JSON-LD válido; el sitemap lista todas las páginas. Se regenera con scripts/seo.py.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const URL = 'https://hagigliotti.github.io/lsm_ciudad_inteligente/';
const paginas = readdirSync('.').filter((f) => f.endsWith('.html'));
const sitemap = readFileSync('sitemap.xml', 'utf8');

for (const p of paginas) {
  const html = readFileSync(p, 'utf8');
  const cabeza = html.slice(0, html.indexOf('</head>'));
  test(`${p}: bloque SEO completo`, () => {
    assert.equal((cabeza.match(/<title>/g) || []).length, 1, 'un solo <title>');
    const [, desc] = cabeza.match(/<meta name="description" content="([^"]+)"/) || [];
    assert.ok(desc && desc.length >= 70 && desc.length <= 230, `descripción de largo razonable (${desc?.length})`);
    const [, claves] = cabeza.match(/<meta name="keywords" content="([^"]+)"/) || [];
    assert.ok(claves && claves.split(',').length >= 10, 'al menos 10 palabras clave');
    assert.match(claves, /Libertador San Martín/);
    assert.match(cabeza, new RegExp(`<link rel="canonical" href="${URL}${p === 'index.html' ? '' : p}">`));
    for (const og of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale']) assert.match(cabeza, new RegExp(`property="${og}"`));
    const [, ld] = cabeza.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [];
    const datos = JSON.parse(ld);
    assert.equal(datos['@context'], 'https://schema.org');
  });
  test(`${p}: está en el sitemap`, () => {
    assert.ok(sitemap.includes(`<loc>${URL}${p === 'index.html' ? '' : p}</loc>`));
  });
}

test('robots.txt apunta al sitemap', () => {
  assert.match(readFileSync('robots.txt', 'utf8'), /Sitemap: https:\/\/hagigliotti\.github\.io\/lsm_ciudad_inteligente\/sitemap\.xml/);
});
