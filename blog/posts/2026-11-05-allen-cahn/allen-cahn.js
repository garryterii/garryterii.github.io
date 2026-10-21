// Simulation de l'équation d'Allen–Cahn  u_t = Δu − (u³ − u)/ε²
// Grille N×N périodique, pas h = 1, schéma explicite, δt = 0,2 (stable : δt ≤ h²/4).
// Couleurs lues dans les variables CSS du thème (--gt-accent, --gt-field-bg…), clair ou sombre.
(() => {
  const root = document.getElementById('sim-allen-cahn');
  if (!root) return;
  const N = 128, dt = 0.2, STEPS = 12;
  let u = new Float32Array(N * N), w = new Float32Array(N * N);
  let eps = 1.5, t = 0, running = true, mode = 'disk', A0 = 0, series = [];
  const field = root.querySelector('.sim-field'), fctx = field.getContext('2d');
  const img = fctx.createImageData(N, N);
  const chart = root.querySelector('.sim-chart'), cctx = chart.getContext('2d');
  const $ = r => root.querySelector(`[data-role="${r}"]`);

  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const rgb = s => { const m = (s || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16)); };
  let cA, cB;
  const readColors = () => { cA = rgb(css('--gt-field-bg')); cB = rgb(css('--gt-accent')); };
  // Quarto change de feuille de style quand on bascule clair/sombre : on relit les couleurs
  new MutationObserver(() => { readColors(); draw(); drawChart(); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const area = () => { let a = 0; for (let k = 0; k < N * N; k++) if (u[k] > 0) a++; return a; };

  function init(m) {
    mode = m; t = 0; series = [];
    const c = N / 2;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const x = j - c + 0.5, y = i - c + 0.5, r = Math.hypot(x, y), th = Math.atan2(y, x);
      let d = null;
      if (m === 'disk') d = 40 - r;
      else if (m === 'flower') d = 30 + 14 * Math.cos(5 * th) - r;
      u[i * N + j] = d === null ? 0.4 * (Math.random() * 2 - 1) : Math.tanh(d / (Math.SQRT2 * eps));
    }
    A0 = area(); series.push([0, A0]);
    root.querySelectorAll('[data-init]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.init === m)));
    draw(); drawChart(); readout();
  }

  function step() {
    const e2 = eps * eps;
    for (let i = 0; i < N; i++) {
      const iu = ((i + N - 1) % N) * N, id = ((i + 1) % N) * N, ii = i * N;
      for (let j = 0; j < N; j++) {
        const k = ii + j, v = u[k];
        const lap = u[iu + j] + u[id + j] + u[ii + (j + N - 1) % N] + u[ii + (j + 1) % N] - 4 * v;
        w[k] = v + dt * (lap - (v * v * v - v) / e2);
      }
    }
    const tmp = u; u = w; w = tmp; t += dt;
  }

  function draw() {
    const d = img.data;
    for (let k = 0; k < N * N; k++) {
      const s = Math.min(1, Math.max(0, (u[k] + 1) / 2));
      for (let c = 0; c < 3; c++) d[4 * k + c] = cA[c] + (cB[c] - cA[c]) * s;
      d[4 * k + 3] = 255;
    }
    fctx.putImageData(img, 0, 0);
  }

  const nice = m => { const p = Math.pow(10, Math.floor(Math.log10(m))), r = m / p; return r < 2 ? p / 5 : r < 5 ? p / 2 : p; };
  function drawChart() {
    const W = chart.width, H = chart.height, L = 72, R = 14, T = 14, B = 34;
    cctx.clearRect(0, 0, W, H);
    const ink = css('--gt-ink-soft') || '#56606b', grid = css('--gt-rule') || '#dfe2e4', acc = css('--gt-accent') || '#136f72';
    const tMax = Math.max(A0 / (2 * Math.PI), t, 1), aMax = Math.max(A0, 1) * 1.05;
    const X = v => L + (v / tMax) * (W - L - R), Y = v => H - B - (v / aMax) * (H - T - B);
    cctx.font = '20px "IBM Plex Sans", system-ui, sans-serif';
    cctx.fillStyle = ink; cctx.strokeStyle = grid; cctx.lineWidth = 1;
    cctx.textAlign = 'right'; cctx.textBaseline = 'middle';
    for (let a = 0, s = nice(aMax); a <= aMax; a += s) { cctx.beginPath(); cctx.moveTo(L, Y(a)); cctx.lineTo(W - R, Y(a)); cctx.stroke(); cctx.fillText(String(Math.round(a)), L - 8, Y(a)); }
    cctx.textAlign = 'center'; cctx.textBaseline = 'top';
    for (let s = 0, st = nice(tMax); s <= tMax; s += st) cctx.fillText(String(Math.round(s)), X(s), H - B + 8);
    if (mode === 'disk') {
      cctx.setLineDash([6, 5]); cctx.strokeStyle = ink; cctx.lineWidth = 2;
      cctx.beginPath(); cctx.moveTo(X(0), Y(A0)); cctx.lineTo(X(A0 / (2 * Math.PI)), Y(0)); cctx.stroke(); cctx.setLineDash([]);
    }
    if (series.length > 1) {
      cctx.strokeStyle = acc; cctx.lineWidth = 3; cctx.beginPath();
      series.forEach(([s, a], n) => n ? cctx.lineTo(X(s), Y(a)) : cctx.moveTo(X(s), Y(a)));
      cctx.stroke();
      const last = series.at(-1); cctx.fillStyle = acc; cctx.beginPath(); cctx.arc(X(last[0]), Y(last[1]), 5, 0, 7); cctx.fill();
    }
  }

  const fmt = n => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  function readout() {
    $('t').textContent = fmt(t);
    $('a').textContent = fmt(area()) + ' px²' + (mode === 'disk' ? ' (théorie ' + fmt(Math.max(0, A0 - 2 * Math.PI * t)) + ')' : '');
  }

  const playBtn = $('play');
  const setPlay = () => { playBtn.textContent = running ? 'Pause' : 'Lancer'; };
  let frame = 0;
  function loop() {
    if (running) {
      for (let s = 0; s < STEPS; s++) step();
      if (++frame % 2 === 0) { series.push([t, area()]); drawChart(); }
      draw(); readout();
      if (mode !== 'noise' && area() === 0) { running = false; setPlay(); }
    }
    requestAnimationFrame(loop);
  }

  playBtn.addEventListener('click', () => { if (!running && mode !== 'noise' && area() === 0) init(mode); running = !running; setPlay(); });
  root.querySelectorAll('[data-init]').forEach(b => b.addEventListener('click', () => { init(b.dataset.init); running = true; setPlay(); }));
  const epsIn = $('eps');
  epsIn.addEventListener('input', () => {
    eps = parseFloat(epsIn.value);
    $('eps-val').textContent = 'ε = ' + eps.toLocaleString('fr-FR') + ' h';
    init(mode === 'free' ? 'noise' : mode);
  });

  // peindre la phase u = 1 à la souris ou au doigt
  let painting = false;
  const paint = ev => {
    const r = field.getBoundingClientRect();
    const cx = (ev.clientX - r.left) / r.width * N, cy = (ev.clientY - r.top) / r.height * N;
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
      if (i * i + j * j > 36) continue;
      const y = Math.floor(cy) + i, x = Math.floor(cx) + j;
      if (x >= 0 && x < N && y >= 0 && y < N) u[y * N + x] = 1;
    }
    if (mode === 'disk') mode = 'free';
    draw();
  };
  field.addEventListener('pointerdown', ev => { painting = true; field.setPointerCapture(ev.pointerId); paint(ev); });
  field.addEventListener('pointermove', ev => { if (painting) paint(ev); });
  field.addEventListener('pointerup', () => { painting = false; });

  readColors();
  init('disk');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { running = false; setPlay(); }
  requestAnimationFrame(loop);
})();
