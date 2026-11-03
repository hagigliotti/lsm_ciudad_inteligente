// Archivo 2009: resalta en el menú lateral el capítulo que se está leyendo.
const enlaces = new Map([...document.querySelectorAll('.arch-menu a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]));
const capitulos = [...document.querySelectorAll('[data-cap]')];

if (enlaces.size && capitulos.length && 'IntersectionObserver' in window) {
  const visibles = new Set();
  const marcar = () => {
    const actual = capitulos.find((c) => visibles.has(c.id));
    enlaces.forEach((a, id) => {
      if (actual && id === actual.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? visibles.add(e.target.id) : visibles.delete(e.target.id)));
    marcar();
  }, { rootMargin: '-30% 0px -60% 0px' });
  capitulos.forEach((c) => obs.observe(c));
}
