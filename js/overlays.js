/* =========================================================================
   overlays.js — Sobreposições: countdown, player de vídeo e folha de detalhes
   Cada função cria o overlay no body e devolve uma função de remoção.
   ========================================================================= */

(function () {
  const { el, getDriveEmbedUrl, isLocalVideo } = DOM;

  /** Converte "<strong>x</strong> y" em HTML seguro mantendo só <strong>. */
  function parseRoteiro(html) {
    // O texto-fonte já é controlado (apenas <strong>); repassamos direto.
    return html;
  }

  /**
   * Contagem regressiva de 2s antes de abrir o player.
   * onDone() é chamado ao terminar.
   */
  function countdown(theme, onDone) {
    const ov = el("div", { class: "countdown-overlay", attrs: { "data-ocid": "countdown-overlay" } });
    ov.appendChild(el("span", { class: "countdown-emoji animate-pop", text: theme.icon }));
    ov.appendChild(el("h2", { class: "font-display countdown-name", text: theme.nome }));
    ov.appendChild(el("p", { class: "countdown-badge", text: theme.badge }));

    const ring = Anim.buildCountdownRing();
    ov.appendChild(ring.wrap);
    ov.appendChild(el("p", { class: "countdown-hint", text: "Abrindo em instantes…" }));
    document.body.appendChild(ov);

    let count = 2;
    ring.setSeconds(count);
    const timer = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(timer);
        ring.setSeconds(0);
        setTimeout(() => { ov.remove(); onDone(); }, 400);
      } else {
        ring.setSeconds(count);
      }
    }, 1000);

    return () => { clearInterval(timer); ov.remove(); };
  }

  /**
   * Player do tema. Mostra vídeo (Drive ou arquivo local) ou fallback de 5min.
   * onClose() é chamado ao fechar ou ao fim da contagem.
   */
  function player(theme, onClose) {
    const videos = Storage.getVideos();
    // Prioridade: vídeo cadastrado no admin; senão, arquivo local com nome do tema.
    const VIDEO_NAMES = {
      1: "pressao_alta", 2: "diabetes", 3: "automedicacao",
      4: "ansiedade_e_estresse", 5: "depressao", 6: "sedentarismo",
      7: "obesidade", 8: "dengue", 9: "falta_de_vacinacao",
      10: "saude_da_mulher", 11: "gravidez_na_adolescencia", 12: "ists",
      13: "alcool_e_drogas", 14: "higiene_pessoal", 15: "saude_do_idoso",
      16: "alimentacao_infantil", 17: "saude_bucal", 18: "insonia",
      19: "desidratacao", 20: "covid19_e_respiratorias",
    };
    const localName = VIDEO_NAMES[theme.num] || String(theme.num);
    const url = videos[String(theme.num)] || `video/${localName}.mp4`;

    const ov = el("div", { class: "player" });
    const closeBtn = el("button", {
      class: "player-close", html: "✕",
      attrs: { type: "button", "aria-label": "Fechar player" },
    });
    ov.appendChild(closeBtn);

    let timer = null;
    function close() { if (timer) clearInterval(timer); ov.remove(); onClose(); }
    closeBtn.addEventListener("click", close);

    // Mostra a contagem de 5 min (quando não há vídeo disponível para o tema)
    function showFallback() {
      const CIRC = 188;
      const fb = el("div", {
        class: "player-fallback",
        style: `background:linear-gradient(160deg, ${theme.c1} 0%, ${theme.c2} 60%, #000 100%);`,
      });
      fb.innerHTML = `
        <span class="player-emoji">${theme.icon}</span>
        <h2 class="font-display player-name">${theme.nome}</h2>
        <p class="player-badge">${theme.badge}</p>
        <div class="player-ring">
          <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
            <circle class="pring" cx="40" cy="40" r="30" fill="none" stroke="#e05a45" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="0" transform="rotate(-90 40 40)"/>
          </svg>
          <span class="player-time">5:00</span>
        </div>
        <p class="player-msg">O professor ainda não adicionou o vídeo para este tema. O acesso será liberado após a contagem.</p>`;
      ov.appendChild(fb);

      const pring = fb.querySelector(".pring");
      const timeEl = fb.querySelector(".player-time");
      let timeLeft = 300;
      timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) { clearInterval(timer); close(); return; }
        const m = Math.floor(timeLeft / 60);
        const s = String(timeLeft % 60).padStart(2, "0");
        timeEl.textContent = `${m}:${s}`;
        pring.style.strokeDashoffset = String(CIRC - (timeLeft / 300) * CIRC);
      }, 1000);
    }

    if (isLocalVideo(url)) {
      // Arquivo local (video/N.mp4). Se não existir/der erro, cai no fallback.
      const v = el("video", { attrs: { src: url, controls: "", autoplay: "", playsinline: "" } });
      v.addEventListener("error", showFallback);
      ov.appendChild(v);
      document.body.appendChild(ov);
    } else {
      // Link do Google Drive cadastrado no admin
      const iframe = el("iframe", {
        attrs: { src: getDriveEmbedUrl(url), allow: "autoplay", allowfullscreen: "", title: `Vídeo: ${theme.nome}` },
      });
      ov.appendChild(iframe);
      document.body.appendChild(ov);
    }

    return close;
  }

  /**
   * Folha de detalhes (bottom sheet) com intro, stats, riscos, prevenção e roteiro.
   */
  function details(theme, onClose) {
    const ov = el("div", { class: "details-wrap" });
    const backdrop = el("button", {
      class: "details-backdrop", attrs: { type: "button", "aria-label": "Fechar detalhes" },
    });
    function close() { ov.remove(); onClose(); }
    backdrop.addEventListener("click", close);
    ov.appendChild(backdrop);

    const sheet = el("div", { class: "details-sheet animate-slide-up" });
    sheet.innerHTML = `
      <div class="drag-handle"><div class="drag-bar"></div></div>
      <div class="details-banner" style="background:linear-gradient(135deg, ${theme.c1} 0%, ${theme.c2} 100%);">
        <div class="details-banner-inner">
          <span class="details-banner-emoji">${theme.icon}</span>
          <p class="details-banner-name">${theme.nome}</p>
        </div>
      </div>
      <div class="details-body">
        <div class="flex" style="align-items:center;gap:.5rem;margin-bottom:.25rem;">
          <span class="details-num">#${theme.num}</span>
          <span class="theme-row-badge">${theme.badge}</span>
        </div>
        <h2 class="font-display details-title">${theme.nome}</h2>
        <p class="details-intro">${theme.intro}</p>
        <div class="details-stats">
          ${theme.stats.map((s) => `<div class="details-stat"><p class="details-stat-v">${s.v}</p><p class="details-stat-l">${s.l}</p></div>`).join("")}
        </div>
        <div class="details-section">
          <h4>Riscos</h4>
          <div class="chip-wrap">${theme.riscos.map((r) => `<span class="chip chip-risk">${r}</span>`).join("")}</div>
        </div>
        <div class="details-section">
          <h4>Prevenção</h4>
          <div class="chip-wrap">${theme.prev.map((p) => `<span class="chip chip-prev">${p}</span>`).join("")}</div>
        </div>
        <div class="roteiro-box">
          <h4 style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;color:#7a7e96;">Roteiro sugerido</h4>
          <p>${parseRoteiro(theme.roteiro)}</p>
        </div>
      </div>`;
    ov.appendChild(sheet);
    document.body.appendChild(ov);

    return close;
  }

  window.Overlays = { countdown, player, details };
})();
