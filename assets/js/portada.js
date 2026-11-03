// Portada animada: la "Colina de la Esperanza" como una red. Los nodos son puntos de la
// ciudad (plaza, UAP, sanatorio, terminal, Puiggari...), los enlaces se encienden y por
// ellos viajan paquetes de datos. Con "reducir movimiento" se dibuja una sola vez, quieta.
const lienzo = document.querySelector('[data-portada]');
if (lienzo) {
  const ctx = lienzo.getContext('2d');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NODOS = [
    { x: 0.08, nombre: 'Ruta 131' }, { x: 0.2, nombre: 'Puiggari' }, { x: 0.33, nombre: 'Terminal' },
    { x: 0.45, nombre: 'Plaza' }, { x: 0.55, nombre: 'UAP' }, { x: 0.67, nombre: 'Sanatorio' },
    { x: 0.79, nombre: 'Municipio' }, { x: 0.92, nombre: 'Barrios' },
  ];
  let W = 0, H = 0, dpr = 1, puntos = [], enlaces = [], paquetes = [], edificios = [], t0 = performance.now();

  const colina = (x) => {
    const u = (x - 0.5) / 0.55;
    const movil = W < 640;
    return H * ((movil ? 0.5 : 0.56) - (movil ? 0.24 : 0.3) * Math.exp(-u * u * 2.2));
  };

  function armar() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = lienzo.clientWidth; H = lienzo.clientHeight;
    lienzo.width = W * dpr; lienzo.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    puntos = NODOS.map((n, i) => ({ ...n, px: n.x * W, py: colina(n.x) - 18 - (i % 2) * 22, fase: i * 0.8 }));
    enlaces = [];
    for (let i = 0; i < puntos.length - 1; i++) enlaces.push([i, i + 1]);
    for (let i = 0; i < puntos.length - 2; i += 2) enlaces.push([i, i + 2]);
    enlaces.push([3, 5], [4, 6]);
    edificios = [];
    let x = 0, semilla = 7;
    const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);
    while (x < W) {
      const ancho = 14 + azar() * 26;
      edificios.push({ x, ancho, alto: 16 + azar() * 46, retardo: azar() * 1.6, ventanas: azar() > 0.4 });
      x += ancho + 3;
    }
    paquetes = Array.from({ length: Math.max(6, Math.round(W / 140)) }, () => nuevoPaquete());
  }
  function nuevoPaquete() {
    const e = enlaces[(Math.random() * enlaces.length) | 0];
    return { e, avance: Math.random(), vel: 0.12 + Math.random() * 0.22, naranja: Math.random() < 0.3, ida: Math.random() < 0.5 };
  }

  function dibujar(ahora) {
    const t = (ahora - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    // Edificios que "crecen" (la ciudad que creció desde 2009)
    edificios.forEach((b) => {
      const k = quieto ? 1 : Math.min(1, Math.max(0, (t - b.retardo) / 1.2));
      const e = 1 - Math.pow(1 - k, 3);
      const base = colina(Math.min(1, (b.x + b.ancho / 2) / W)) + 26;
      const alto = b.alto * e;
      ctx.fillStyle = 'rgba(31, 92, 67, 0.28)';
      ctx.fillRect(b.x, base - alto, b.ancho, H - base + alto);
      if (b.ventanas && e > 0.9) {
        ctx.fillStyle = 'rgba(255, 196, 140, 0.35)';
        for (let y = base - alto + 6; y < base - 6; y += 10) {
          for (let wx = b.x + 4; wx < b.x + b.ancho - 5; wx += 8) {
            if (((wx * 13 + y * 7) | 0) % 5 === 0) ctx.fillRect(wx, y, 3, 4);
          }
        }
      }
    });

    // Línea de la colina
    ctx.beginPath();
    for (let x = 0; x <= W; x += 6) { const y = colina(x / W); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = 'rgba(61, 220, 151, 0.35)'; ctx.lineWidth = 2; ctx.stroke();

    // Enlaces
    enlaces.forEach(([a, b], i) => {
      const A = puntos[a], B = puntos[b];
      const brillo = quieto ? 0.5 : 0.25 + 0.25 * Math.sin(t * 1.4 + i);
      ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(B.px, B.py);
      ctx.strokeStyle = `rgba(61, 220, 151, ${brillo})`; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Paquetes de datos
    if (!quieto) {
      paquetes.forEach((p, i) => {
        p.avance += p.vel / 60;
        if (p.avance >= 1) paquetes[i] = nuevoPaquete();
        const [a, b] = p.ida ? p.e : [p.e[1], p.e[0]];
        const A = puntos[a], B = puntos[b];
        const x = A.px + (B.px - A.px) * p.avance, y = A.py + (B.py - A.py) * p.avance;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.naranja ? '#ff7a00' : '#c9ffe6'; ctx.fill();
      });
    }

    // Nodos con pulso
    puntos.forEach((n) => {
      const pulso = quieto ? 0 : (Math.sin(t * 2 + n.fase) + 1) / 2;
      ctx.beginPath(); ctx.arc(n.px, n.py, 10 + pulso * 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(61, 220, 151, ${0.16 * (1 - pulso)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.px, n.py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = n.nombre === 'Plaza' ? '#ff7a00' : '#0d1f18'; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = '#3ddc97'; ctx.stroke();
      if (W > 640) {
        ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(207, 231, 219, 0.75)'; ctx.fillText(n.nombre.toUpperCase(), n.px, n.py - 16);
      }
    });

    // Antena en la plaza: ondas que salen
    const plaza = puntos[3];
    if (!quieto) {
      for (let k = 0; k < 3; k++) {
        const r = ((t * 30 + k * 30) % 90) + 10;
        ctx.beginPath(); ctx.arc(plaza.px, plaza.py, r, Math.PI * 1.15, Math.PI * 1.85);
        ctx.strokeStyle = `rgba(255, 122, 0, ${0.6 * (1 - r / 100)})`; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    if (!quieto && visible) requestAnimationFrame(dibujar);
  }

  let visible = true;
  new IntersectionObserver(([e]) => {
    const antes = visible; visible = e.isIntersecting;
    if (visible && !antes && !quieto) requestAnimationFrame(dibujar);
  }).observe(lienzo);
  addEventListener('resize', () => { armar(); if (quieto) dibujar(performance.now()); }, { passive: true });
  armar();
  requestAnimationFrame(dibujar);
}
