import land from './world-land.js';

/** Dotted geographic globe and a smaller moon, rendered entirely offline. */
export class InteractiveCyberCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    if (!this.context) return;
    this.host = canvas.parentElement;
    this.hero = canvas.closest('#home');
    this.button = this.hero.querySelector('[data-canvas-toggle]');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.systemTheme = matchMedia('(prefers-color-scheme: dark)');
    this.pointer = { x: 0, y: 0, active: false };
    this.parallax = { x: 0, y: 0 };
    this.points = [];
    this.moonPoints = [];
    this.cleanups = [];
    this.phase = 0;
    this.frame = 0;
    this.visible = false;
    this.paused = this.button.dataset.userPaused === 'true';
    this.motionOverride = this.button.dataset.motionOverride === 'true';
    this.destroyed = false;
    this.tick = this.tick.bind(this);
    this.readColors();
    this.listen(this.hero, 'pointermove', event => {
      if (!this.motionAllowed() || this.paused || event.pointerType === 'touch') return;
      const bounds = this.canvas.getBoundingClientRect();
      this.pointer.x = event.clientX - bounds.left;
      this.pointer.y = event.clientY - bounds.top;
      this.pointer.active = true;
    }, { passive: true });
    this.listen(this.hero, 'pointerleave', () => { this.pointer.active = false; });
    this.listen(document, 'visibilitychange', () => this.sync());
    this.listen(this.canvas, 'contextlost', event => {
      event.preventDefault();
      this.contextLost = true;
      this.failed = true;
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.canvas.dataset.motion = 'fallback';
      this.host.classList.remove('canvas-ready');
      this.button.hidden = true;
    });
    this.listen(this.canvas, 'contextrestored', () => {
      this.contextLost = false;
      this.readColors();
      this.resize();
      this.checkVisibility();
    });
    this.listen(this.motion, 'change', () => { this.motionOverride = false; this.sync(); });
    this.listen(this.systemTheme, 'change', () => { this.readColors(); this.render(0); });
    this.listen(this.button, 'click', () => {
      if (this.paused || !this.motionAllowed()) {
        this.paused = false;
        this.motionOverride = true;
      } else {
        this.paused = true;
        this.motionOverride = false;
      }
      this.sync();
    });
    this.themeObserver = new MutationObserver(() => { this.readColors(); this.render(0); });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (typeof window.ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => { this.resize(); this.checkVisibility(); });
      this.resizeObserver.observe(this.host);
    } else {
      this.listen(window, 'resize', () => { this.resize(); this.checkVisibility(); }, { passive: true });
    }
    if (typeof window.IntersectionObserver === 'function') {
      this.intersectionObserver = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.sync();
      });
      this.intersectionObserver.observe(this.host);
    } else {
      this.listen(window, 'scroll', () => this.checkVisibility(), { passive: true });
    }
    this.resize();
    this.checkVisibility();
  }

  listen(target, type, handler, options) {
    if (target.addEventListener) {
      target.addEventListener(type, handler, options);
      this.cleanups.push(() => target.removeEventListener(type, handler, options));
    } else if (target.addListener && type === 'change') {
      target.addListener(handler);
      this.cleanups.push(() => target.removeListener(handler));
    }
  }

  motionAllowed() {
    return !this.motion.matches || this.motionOverride;
  }

  checkVisibility() {
    const bounds = this.host.getBoundingClientRect();
    this.visible = bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < window.innerHeight;
    this.sync();
  }

  readColors() {
    const style = getComputedStyle(document.documentElement);
    const dark = document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && this.systemTheme.matches);
    const color = (token, fallback) => {
      // Canvas normalizes supported CSS colors, including rgb(), without
      // assuming a #RRGGBB representation or concatenating alpha suffixes.
      this.context.fillStyle = fallback;
      this.context.fillStyle = style.getPropertyValue(token).trim() || fallback;
      return this.context.fillStyle;
    };
    this.colors = {
      primary: color('--accent', dark ? '#44E1E9' : '#0787A0'),
      secondary: color('--accent-secondary', dark ? '#34D399' : '#087F66'),
      line: color('--canvas-line', dark ? '#44E1E9' : '#0787A0'),
      moon: color('--secondary', dark ? '#92AAB8' : '#526C78'),
      background: color('--bg', dark ? '#09121C' : '#EAF4F5'),
      surface: color('--surface', dark ? '#162837' : '#FFFFFF')
    };
  }

  resize() {
    const bounds = this.host.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.points = land.filter((point, index) => this.width >= 440 || index % 2 === 0);
    this.moonPoints = Array.from({ length: this.width < 440 ? 190 : 320 }, (_, index) => {
      const z = 1 - 2 * (index + .5) / (this.width < 440 ? 190 : 320);
      const angle = index * Math.PI * (3 - Math.sqrt(5));
      const r = Math.sqrt(1 - z * z);
      return [r * Math.cos(angle), r * Math.sin(angle), z];
    });
    this.render(0);
  }

  sync() {
    if (this.destroyed) return;
    if (this.failed) return;
    const animate = this.visible && !document.hidden && this.motionAllowed() && !this.paused;
    this.canvas.dataset.motion = animate ? 'running' : this.paused ? 'paused' : !this.motionAllowed() ? 'reduced' : 'idle';
    const stopped = this.paused || !this.motionAllowed();
    this.button.disabled = false;
    this.button.setAttribute('aria-pressed', String(stopped));
    this.button.setAttribute('aria-label', stopped ? 'Animar globo' : 'Pausar rotação do globo');
    this.button.textContent = stopped ? '▶ ANIMAR' : 'Ⅱ PAUSAR';
    this.button.dataset.userPaused = String(this.paused);
    this.button.dataset.motionOverride = String(this.motionOverride);
    this.button.title = !this.motionAllowed() ? 'Movimento reduzido ativo. Clique para iniciar a animação.' : '';
    if (!animate) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.pointer.active = false;
      this.render(0);
    } else if (!this.frame) {
      this.lastTime = 0;
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  tick(time) {
    this.frame = 0;
    if (this.destroyed || !this.visible || document.hidden || !this.motionAllowed() || this.paused) {
      this.frame = 0;
      if (!this.destroyed) this.sync();
      return;
    }
    const delta = this.lastTime ? Math.min(time - this.lastTime, 34) : 16.67;
    this.lastTime = time;
    this.phase += delta / 1000;
    if (!this.render(delta / 16.67)) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  render(step) {
    if (!this.width || !this.height || !this.context || this.contextLost || this.destroyed) return false;
    try {
      this.drawGlobe(step);
      this.failed = false;
      // Reveal Canvas only after Earth and Moon have both finished drawing.
      this.host.classList.add('canvas-ready');
      this.button.hidden = false;
      return true;
    } catch (error) {
      this.failed = true;
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.canvas.dataset.motion = 'fallback';
      this.host.classList.remove('canvas-ready');
      this.button.hidden = true;
      console.error('Could not render the globe; keeping the image fallback.', error);
      return false;
    }
  }

  drawGlobe(step) {
    const ctx = this.context;
    const t = this.phase;
    const radius = Math.min(this.width * .35, this.height * .35);
    const cx = this.width * .44, cy = this.height * .47;
    const targetX = this.pointer.active ? Math.max(-.5, Math.min(.5, this.pointer.x / this.width - .5)) * .5 : 0;
    const targetY = this.pointer.active ? Math.max(-.5, Math.min(.5, this.pointer.y / this.height - .5)) * .25 : 0;
    const ease = 1 - Math.pow(.94, step);
    this.parallax.x += (targetX - this.parallax.x) * ease;
    this.parallax.y += (targetY - this.parallax.y) * ease;
    const yaw = .45 + t * .065 + this.parallax.x;
    const pitch = .12 + this.parallax.y;
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    ctx.clearRect(0, 0, this.width, this.height);

    // A restrained atmosphere defines the sphere without drawing a mesh.
    const halo = ctx.createRadialGradient(cx, cy, radius * .9, cx, cy, radius * 1.12);
    halo.addColorStop(0, this.colors.primary);
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.globalAlpha = .07;
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, radius * 1.12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .22;
    ctx.strokeStyle = this.colors.line;
    ctx.lineWidth = .8;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

    // Project real land samples; discard the far hemisphere to preserve coastlines.
    for (let i = 0; i < this.points.length; i++) {
      const [x, y, z] = this.points[i];
      const rx = x * cos + z * sin;
      const rz = z * cos - x * sin;
      const ry = y * cp - rz * sp;
      const depth = y * sp + rz * cp;
      if (depth <= .02) continue;
      ctx.globalAlpha = .3 + depth * .7;
      ctx.fillStyle = i % 47 === 0 ? this.colors.secondary : this.colors.primary;
      const size = (this.width < 440 ? 1.05 : 1.1) + depth * .65;
      ctx.beginPath(); ctx.arc(cx + rx * radius, cy - ry * radius, size, 0, Math.PI * 2); ctx.fill();
    }

    // The smaller moon has its own slow rotation and subtle, procedural craters.
    const moonRadius = radius * .22;
    const mx = cx + radius * 1.1, my = cy - radius * .88 + Math.sin(t * .18) * radius * .025;
    const moonShade = ctx.createRadialGradient(mx - moonRadius * .35, my - moonRadius * .35, 0, mx, my, moonRadius);
    moonShade.addColorStop(0, this.colors.surface);
    moonShade.addColorStop(1, this.colors.background);
    ctx.globalAlpha = 1;
    ctx.fillStyle = moonShade;
    ctx.beginPath(); ctx.arc(mx, my, moonRadius, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .3;
    ctx.strokeStyle = this.colors.moon;
    ctx.beginPath(); ctx.arc(mx, my, moonRadius, 0, Math.PI * 2); ctx.stroke();
    const moonCos = Math.cos(t * .035), moonSin = Math.sin(t * .035);
    ctx.fillStyle = this.colors.moon;
    for (const [x, y, z] of this.moonPoints) {
      const rx = x * moonCos + z * moonSin;
      const depth = z * moonCos - x * moonSin;
      if (depth <= 0) continue;
      const crater = Math.hypot(rx + .22, y - .25) < .3 || Math.hypot(rx - .35, y + .23) < .22;
      ctx.globalAlpha = (.3 + depth * .6) * (crater ? .3 : 1);
      ctx.beginPath(); ctx.arc(mx + rx * moonRadius, my - y * moonRadius, .75 + depth * .55, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.cleanups.forEach(cleanup => cleanup());
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.themeObserver?.disconnect();
    this.context.clearRect(0, 0, this.width, this.height);
    this.points = [];
    this.moonPoints = [];
    this.canvas.dataset.motion = 'destroyed';
    this.button.hidden = true;
    this.host.classList.remove('canvas-ready');
  }
}

export default function initInteractiveCyberCanvas() {
  const canvas = document.querySelector('[data-cyber-canvas]');
  if (!canvas) return null;
  try {
    const controller = new InteractiveCyberCanvas(canvas);
    return controller.context ? controller : null;
  } catch (error) {
    canvas.parentElement.classList.remove('canvas-ready');
    console.error('Could not initialize the globe; keeping the image fallback.', error);
    return null;
  }
}
