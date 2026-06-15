/* =========================================================================
   animations.js — Efeitos visuais do app

   Este arquivo cuida de tudo que é visual e animado no app:
     • Confete colorido que cai quando o usuário sorteia um tema
     • Corações caindo no fundo da tela de login
     • A linha de ECG animada (eletrocardiograma) no logo
     • O anel circular de contagem regressiva (2, 1...)

   Nenhuma lógica de negócio aqui — só efeitos visuais.
   ========================================================================= */

/*
  Paleta de cores usada nos papéis de confete:
    vermelho-coral, vermelho-claro, verde, bege, cinza, dourado
*/
const CONFETTI_COLORS = ["#e05a45", "#f07060", "#3dba7a", "#f0ece4", "#7a7e96", "#e8c86d"];

/*
  Paleta de cores usada nos corações que caem no fundo do login:
    vários tons de vermelho e rosa
*/
const HEART_COLORS = ["#e05a45", "#f07060", "#c94435", "#ff8a78", "#e05a45", "#ff6b8a", "#ffb3c1", "#e05a45"];

/*
  FUNÇÃO: prefersReduced (o usuário prefere menos movimento?)

  O que faz:
    Verifica se o usuário configurou o sistema operacional para
    reduzir animações (opção de acessibilidade para pessoas com
    epilepsia ou enjoo de movimento).
    Se sim, as animações mais intensas (confete) são desativadas.
*/
const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  FUNÇÃO: fireConfetti (lançar confete)

  O que faz:
    Cria 40 pedacinhos de papel colorido que caem da parte superior da tela.
    Eles aparecem por cima de tudo, não interagem com cliques do usuário
    (pointer-events:none) e se removem sozinhos após o tempo definido.

    É chamado em dois momentos:
      1. Quando o usuário sorteia um tema (confete por 3 segundos)
      2. Quando o usuário acerta uma pergunta no Joguinho (confete por 2 segundos)

  Parâmetro:
    - durationMs: quanto tempo o confete fica na tela (em milissegundos)
                  3000 = 3 segundos (padrão)
*/
function fireConfetti(durationMs = 3000) {
  // Respeita configuração de acessibilidade — não anima se usuário preferir menos movimento
  if (prefersReduced()) return;

  // Cria uma caixa transparente que cobre toda a tela para os confetes caírem
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true"); // leitores de tela ignoram o confete
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:100;";

  // Cria 40 pedacinhos de papel individualmente
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "confetti-particle"; // a animação de queda está definida no CSS

    // Configurações aleatórias para cada pedacinho (variedade visual)
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]; // cor aleatória
    const x = Math.random() * 100;         // posição horizontal (0% a 100% da tela)
    const duration = 1.5 + Math.random() * 1.0; // velocidade de queda (1,5s a 2,5s)
    const delay = Math.random() * 0.5;     // atraso antes de começar a cair (0s a 0,5s)
    const size = 6 + Math.random() * 6;    // tamanho (6px a 12px)

    p.style.cssText = `left:${x}%;top:0;background:${color};width:${size}px;height:${size}px;` +
      `animation-duration:${duration}s;animation-delay:${delay}s;` +
      // Metade dos pedacinhos é circular (bolinha), metade é retangular (papel)
      `border-radius:${Math.random() > 0.5 ? "50%" : "2px"};`;

    container.appendChild(p);
  }

  // Adiciona o confete à página
  document.body.appendChild(container);

  // Remove o confete automaticamente após o tempo definido
  setTimeout(() => container.remove(), durationMs);
}

/*
  FUNÇÃO: createFallingHearts (criar corações caindo)

  O que faz:
    Cria uma camada de corações ❤ que caem lentamente no fundo da
    tela de login. São sutis (semi-transparentes) e criam um efeito
    de profundidade e movimento no fundo.

    Cada coração:
      • Começa acima da tela (invisível)
      • Cai lentamente com velocidade e posição aleatórias
      • Repete infinitamente em loop

  Parâmetro:
    - count: quantidade de corações (padrão: 20)
*/
function createFallingHearts(count = 20) {
  // Caixa que contém todos os corações, cobrindo toda a tela
  const layer = document.createElement("div");
  layer.className = "fall-layer";
  layer.setAttribute("aria-hidden", "true"); // leitores de tela ignoram

  // Cria cada coração com características aleatórias
  for (let i = 0; i < count; i++) {
    const left     = Math.random() * 100;          // posição horizontal (0% a 100%)
    const size     = 10 + Math.random() * 14;      // tamanho (10px a 24px)
    const duration = 4 + Math.random() * 5;        // tempo para cair (4s a 9s)
    const delay    = Math.random() * 8;             // atraso para começar (0s a 8s)
    const opacity  = 0.25 + Math.random() * 0.55;  // transparência (25% a 80%)
    const color    = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]; // cor
    const drift    = (Math.random() - 0.5) * 80;   // desvio horizontal durante a queda
    const rotate   = Math.random() * 360;           // rotação inicial

    const span = document.createElement("span");
    span.className = "heart-particle";
    span.textContent = "❤"; // caractere de coração
    span.style.cssText =
      `left:${left}%;top:-40px;font-size:${size}px;opacity:${opacity};color:${color};` +
      // Animação "heart-fall" definida no CSS — faz o coração cair e girar
      `animation-name:heart-fall;animation-duration:${duration}s;animation-delay:${delay}s;` +
      `animation-timing-function:ease-in;animation-iteration-count:infinite;animation-fill-mode:both;` +
      // Variáveis CSS usadas pela animação heart-fall para desvio e rotação
      `--drift:${drift}px;--rotate:${rotate}deg;`;

    layer.appendChild(span);
  }

  return layer; // devolve a camada para ser inserida na tela de login
}

/*
  FUNÇÃO: ecgLineSVG (linha de eletrocardiograma)

  O que faz:
    Cria um ícone SVG animado de linha de ECG (eletrocardiograma) —
    aquela linha que sobe e desce no monitor cardíaco.
    Aparece no logo da tela de login, abaixo do coração ❤️.

    SVG = formato de imagem vetorial feito com código, que escala
    perfeitamente em qualquer tamanho de tela.

  Retorna:
    Uma string HTML com o SVG da linha de ECG.
*/
function ecgLineSVG() {
  return `
    <svg width="220" height="36" viewBox="0 0 220 36" fill="none" aria-hidden="true" style="margin:0 auto;display:block;">
      <!--
        path = o caminho que forma a linha do ECG
        M = mover para (move to)
        L = linha reta até (line to)
        Os números são coordenadas x,y no espaço 220x36 do SVG

        A linha começa plana, então sobe e desce (simulando batimentos cardíacos),
        e termina plana do outro lado.
      -->
      <path d="M0 18 L30 18 L38 18 L42 4 L46 32 L50 4 L54 28 L58 18 L70 18 L80 18 L84 10 L88 26 L92 18 L220 18"
        stroke="#e05a45" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        class="ecg-line" fill="none" />
    </svg>`;
}

/*
  FUNÇÃO: buildCountdownRing (construir anel de contagem regressiva)

  O que faz:
    Cria o anel circular animado que aparece na sobreposição de contagem
    antes do vídeo começar. O anel vai se "esvaziando" conforme a contagem
    passa de 2 para 1 para 0.

    Funciona assim:
      • Um anel vermelho completo = 2 segundos
      • O traço vermelho vai encurtando a cada segundo
      • No centro do anel aparece o número atual (2, 1, 0)

  Retorna um objeto com:
    - wrap:       o elemento DOM pronto para inserir na tela
    - setSeconds: função para atualizar o número e o tamanho do traço
                  ex: setSeconds(1) → mostra "1" e o anel meio vazio
*/
function buildCountdownRing() {
  const SIZE = 120;   // diâmetro do anel em pixels
  const STROKE = 7;   // espessura da borda do anel
  const RADIUS = (SIZE - STROKE) / 2; // raio interno do anel
  const CIRC = 2 * Math.PI * RADIUS;  // circunferência total do anel (fórmula: 2πr)

  // Caixa que centraliza o anel
  const wrap = document.createElement("div");
  wrap.className = "countdown-ring-wrap";
  wrap.innerHTML = `
    <svg width="${SIZE}" height="${SIZE}" aria-hidden="true"
         style="position:absolute;inset:0;transform:rotate(-90deg);">
      <!--
        Círculo de fundo (cinza claro) — sempre completo, fica por baixo
      -->
      <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${RADIUS}" fill="none"
              stroke="rgba(255,255,255,0.1)" stroke-width="${STROKE}" />
      <!--
        Círculo vermelho por cima — vai encolhendo conforme o tempo passa.
        stroke-dasharray define o comprimento total do traço (= circunferência).
        stroke-dashoffset define quanto do traço está "escondido":
          0    = anel completo (100%)
          CIRC = anel vazio (0%)
        A transição de 0,9s faz a animação de encolhimento ser suave.
      -->
      <circle class="ring-progress" cx="${SIZE/2}" cy="${SIZE/2}" r="${RADIUS}" fill="none"
              stroke="#e05a45" stroke-width="${STROKE}" stroke-linecap="round"
              stroke-dasharray="${CIRC}" stroke-dashoffset="0"
              style="transition:stroke-dashoffset 0.9s linear;" />
    </svg>
    <!-- Número no centro do anel (começa em 2) -->
    <span class="countdown-num">2</span>`;

  // Referências para o traço vermelho e o número do centro
  const ring = wrap.querySelector(".ring-progress");
  const num = wrap.querySelector(".countdown-num");

  /*
    FUNÇÃO: setSeconds (definir segundos)

    O que faz:
      Atualiza o anel e o número para refletir o tempo restante.

    Parâmetro:
      - seconds: tempo restante (2, 1 ou 0)
  */
  function setSeconds(seconds) {
    const progress = seconds / 2; // 2→100%, 1→50%, 0→0%
    // Ajusta o "buraco" no traço (quanto está escondido)
    ring.style.strokeDashoffset = String(CIRC * (1 - progress));
    // Atualiza o número no centro
    num.textContent = String(seconds);
  }

  return { wrap, setSeconds };
}

/*
  EXPORTAÇÃO: window.Anim

  Agrupa as funções de animação em um objeto disponível para todo o app.

  Uso em outros arquivos:
    Anim.fireConfetti(3000)         → lança confete por 3 segundos
    Anim.createFallingHearts(20)    → cria 20 corações caindo (login)
    Anim.ecgLineSVG()               → retorna o HTML do ECG
    Anim.buildCountdownRing()       → cria o anel de contagem regressiva
*/
window.Anim = {
  fireConfetti,
  createFallingHearts,
  ecgLineSVG,
  buildCountdownRing,
};
