/* =========================================================================
   animations.js — Efeitos visuais (confete, corações, ECG, anéis SVG)
   Cada função cria/retorna um elemento DOM pronto para inserir.
   ========================================================================= */

const CONFETTI_COLORS = ["#e05a45", "#f07060", "#3dba7a", "#f0ece4", "#7a7e96", "#e8c86d"];
const HEART_COLORS = ["#e05a45", "#f07060", "#c94435", "#ff8a78", "#e05a45", "#ff6b8a", "#ffb3c1", "#e05a45"];

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Dispara confete em tela cheia por ~3s. Remove-se sozinho.
 */
function fireConfetti(durationMs = 3000) {
  if (prefersReduced()) return;
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:100;";

  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "confetti-particle";
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const x = Math.random() * 100;
    const duration = 1.5 + Math.random() * 1.0;
    const delay = Math.random() * 0.5;
    const size = 6 + Math.random() * 6;
    p.style.cssText = `left:${x}%;top:0;background:${color};width:${size}px;height:${size}px;` +
      `animation-duration:${duration}s;animation-delay:${delay}s;` +
      `border-radius:${Math.random() > 0.5 ? "50%" : "2px"};`;
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), durationMs);
}

/**
 * Cria a camada de corações caindo (usada no fundo do login).
 */
function createFallingHearts(count = 20) {
  const layer = document.createElement("div");
  layer.className = "fall-layer";
  layer.setAttribute("aria-hidden", "true");

  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const size = 10 + Math.random() * 14;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 8;
    const opacity = 0.25 + Math.random() * 0.55;
    const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const drift = (Math.random() - 0.5) * 80;
    const rotate = Math.random() * 360;

    const span = document.createElement("span");
    span.className = "heart-particle";
    span.textContent = "❤";
    span.style.cssText =
      `left:${left}%;top:-40px;font-size:${size}px;opacity:${opacity};color:${color};` +
      `animation-name:heart-fall;animation-duration:${duration}s;animation-delay:${delay}s;` +
      `animation-timing-function:ease-in;animation-iteration-count:infinite;animation-fill-mode:both;` +
      `--drift:${drift}px;--rotate:${rotate}deg;`;
    layer.appendChild(span);
  }
  return layer;
}

/**
 * SVG da linha de ECG animada (logo do login).
 */
function ecgLineSVG() {
  return `
    <svg width="220" height="36" viewBox="0 0 220 36" fill="none" aria-hidden="true" style="margin:0 auto;display:block;">
      <path d="M0 18 L30 18 L38 18 L42 4 L46 32 L50 4 L54 28 L58 18 L70 18 L80 18 L84 10 L88 26 L92 18 L220 18"
        stroke="#e05a45" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        class="ecg-line" fill="none" />
    </svg>`;
}

/**
 * Anel de contagem regressiva (overlay de sorteio). 120px, 2s.
 * Retorna { wrap, setSeconds } para atualizar o número e o traço.
 */
function buildCountdownRing() {
  const SIZE = 120, STROKE = 7;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;

  const wrap = document.createElement("div");
  wrap.className = "countdown-ring-wrap";
  wrap.innerHTML = `
    <svg width="${SIZE}" height="${SIZE}" aria-hidden="true"
         style="position:absolute;inset:0;transform:rotate(-90deg);">
      <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${RADIUS}" fill="none"
              stroke="rgba(255,255,255,0.1)" stroke-width="${STROKE}" />
      <circle class="ring-progress" cx="${SIZE/2}" cy="${SIZE/2}" r="${RADIUS}" fill="none"
              stroke="#e05a45" stroke-width="${STROKE}" stroke-linecap="round"
              stroke-dasharray="${CIRC}" stroke-dashoffset="0"
              style="transition:stroke-dashoffset 0.9s linear;" />
    </svg>
    <span class="countdown-num">2</span>`;

  const ring = wrap.querySelector(".ring-progress");
  const num = wrap.querySelector(".countdown-num");

  function setSeconds(seconds) {
    const progress = seconds / 2;
    ring.style.strokeDashoffset = String(CIRC * (1 - progress));
    num.textContent = String(seconds);
  }
  return { wrap, setSeconds };
}

window.Anim = {
  fireConfetti,
  createFallingHearts,
  ecgLineSVG,
  buildCountdownRing,
};
