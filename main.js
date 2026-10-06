// Draws the Lorenz attractor. Three trajectories start 0.001 apart and
// visibly separate — sensitive dependence on initial conditions.
(() => {
  const canvas = document.getElementById('attractor');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const SIGMA = 10, RHO = 28, BETA = 8 / 3;
  const DT = 0.005, STEPS_PER_FRAME = 4, MAX_STEPS = 6000;
  let trails, colors, steps, frame, width, height, scale, originX, originY;
  let visible = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // The attractor spans roughly x ∈ [-20, 20] and z ∈ [0, 50].
    scale = Math.min(width / 44, height / 54);
    originX = width / 2;
    originY = height / 2 + 25 * scale;
  }

  const projectX = (p) => originX + p[0] * scale;
  const projectY = (p) => originY - p[2] * scale;

  function step(p) {
    const [x, y, z] = p;
    p[0] = x + SIGMA * (y - x) * DT;
    p[1] = y + (x * (RHO - z) - y) * DT;
    p[2] = z + (x * y - BETA * z) * DT;
  }

  function advance(n) {
    n = Math.min(n, MAX_STEPS - steps);
    trails.forEach((p, k) => {
      ctx.strokeStyle = colors[k];
      ctx.beginPath();
      ctx.moveTo(projectX(p), projectY(p));
      for (let i = 0; i < n; i++) {
        step(p);
        ctx.lineTo(projectX(p), projectY(p));
      }
      ctx.stroke();
    });
    steps += n;
  }

  function tick() {
    advance(STEPS_PER_FRAME);
    if (steps < MAX_STEPS) frame = requestAnimationFrame(tick);
  }

  function restart() {
    cancelAnimationFrame(frame);
    resize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 0.9;
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.6;
    const styles = getComputedStyle(document.documentElement);
    colors = ['--trail-1', '--trail-2', '--trail-3'].map((v) => styles.getPropertyValue(v).trim());
    trails = [[1, 1, 1], [1.001, 1, 1], [1.002, 1, 1]];
    steps = 0;
    if (reduceMotion.matches) advance(MAX_STEPS);
    else if (visible) frame = requestAnimationFrame(tick);
  }

  // Fires once on load, then again only when the canvas width changes.
  let lastWidth = 0;
  new ResizeObserver(() => {
    if (canvas.clientWidth === lastWidth) return;
    lastWidth = canvas.clientWidth;
    restart();
  }).observe(canvas);
  darkQuery.addEventListener('change', restart);

  // Start drawing only once the canvas scrolls into view.
  new IntersectionObserver((entries) => {
    if (visible || !entries[0].isIntersecting) return;
    visible = true;
    if (!reduceMotion.matches && steps === 0) frame = requestAnimationFrame(tick);
  }, { threshold: 0.3 }).observe(canvas);
})();
