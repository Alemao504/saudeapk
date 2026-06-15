/* =========================================================================
   home.js — Tela principal: sorteio de temas, abas de jogos e lista de temas
   render(root, { user, onLogout, onThemeSelected, onShowDetails })
   ========================================================================= */

(function () {
  const { el } = DOM;

  const TABS = [
    { id: "home", label: "Início", icon: "🏠" },
    { id: "quiz", label: "Quiz", icon: "❓" },
    { id: "joguinho", label: "Joguinho", icon: "🎮" },
    { id: "simulado", label: "Simulado", icon: "📋" },
  ];

  const QUICK = [
    { tab: "quiz", icon: "❓", label: "Quiz", color: "#5c2d91" },
    { tab: "joguinho", icon: "🎮", label: "Joguinho", color: "#0a6b5a" },
    { tab: "simulado", icon: "📋", label: "Simulado", color: "#6b3d00" },
  ];

  function render(root, { user, onLogout, onThemeSelected, onShowDetails }) {
    const THEMES = AppData.THEMES;
    let activeTab = "home";
    let selectedTheme = THEMES[0];
    let isSpinning = false;
    let hasSelected = false;
    let spinTimer = null;

    const screen = el("div", { class: "screen", style: "padding-bottom:2rem;" });

    // Cabeçalho
    const header = el("div", { class: "header-bar" });
    header.innerHTML = `
      <div>
        <p class="header-hello">Bem-vindo(a),</p>
        <p class="header-name">${user.nome}</p>
      </div>`;
    const avatar = el("button", {
      class: "avatar-btn", text: user.nome.charAt(0).toUpperCase(),
      attrs: { type: "button", title: "Sair" }, on: { click: onLogout },
    });
    header.appendChild(avatar);
    screen.appendChild(header);

    // Navegação de abas
    const nav = el("div", { class: "tab-nav scrollbar-hide" });
    TABS.forEach((t) => {
      const b = el("button", {
        class: t.id === "home" ? "active" : "", attrs: { type: "button" },
        html: `<span class="tab-icon">${t.icon}</span>${t.label}`,
      });
      b.addEventListener("click", () => { activeTab = t.id; refreshTabs(); drawContent(); });
      nav.appendChild(b);
    });
    screen.appendChild(nav);

    function refreshTabs() {
      [...nav.children].forEach((b, i) =>
        b.classList.toggle("active", TABS[i].id === activeTab));
    }

    // Conteúdo
    const content = el("div");
    screen.appendChild(content);
    root.appendChild(screen);

    function drawContent() {
      DOM.clear(content);
      if (activeTab === "quiz")
        return QuizScreen.render(content, { userEmail: user.email, onBack: goHome });
      if (activeTab === "joguinho")
        return JoguinhoScreen.render(content, { userEmail: user.email, onBack: goHome });
      if (activeTab === "simulado")
        return SimuladoScreen.render(content, { userEmail: user.email, onBack: goHome });
      drawHome();
    }

    function goHome() { activeTab = "home"; refreshTabs(); drawContent(); }

    function drawHome() {
      const videos = Storage.getVideos();
      const pad = el("div", { class: "content-pad" });

      // Badge de atividade + título
      pad.insertAdjacentHTML("beforeend", `
        <div class="activity-badge">
          <span class="activity-dot pulse-dot"></span>
          <span class="activity-text">Atividade Avaliativa</span>
        </div>
        <h2 class="font-display home-title">Saúde em Foco</h2>`);

      // Card de sorteio (re-renderizável)
      const cardSlot = el("div");
      pad.appendChild(cardSlot);

      function drawCard() {
        DOM.clear(cardSlot);
        const t = selectedTheme;
        const hasVideo = !!videos[String(t.num)];
        const card = el("div", { class: "sorteio-card" });
        card.innerHTML = `
          <div class="banner" style="background:linear-gradient(135deg, ${t.c1} 0%, ${t.c2} 100%);">
            <div class="banner-orb1" aria-hidden="true"></div>
            <div class="banner-orb2" aria-hidden="true"></div>
            <div class="banner-num" aria-hidden="true"><span>${t.num}</span></div>
            <div class="banner-center">
              <span class="banner-emoji">${t.icon}</span>
              <h3 class="banner-name">${t.nome}</h3>
              <span class="banner-badge">${t.badge}</span>
            </div>
            ${hasVideo ? '<div class="video-flag"><span>▶</span> Vídeo disponível</div>' : ""}
          </div>
          <div class="card-body">
            <div class="flex" style="align-items:center;gap:.5rem;margin-bottom:.5rem;">
              <span class="badge-pill">${t.badge}</span>
            </div>
            <h3 class="font-display card-title">${t.nome}</h3>
            <p class="card-desc">${t.desc}</p>
            <div class="stats-grid">
              ${t.stats.map((s) => `<div class="stat-box"><p class="stat-v">${s.v}</p><p class="stat-l">${s.l}</p></div>`).join("")}
            </div>
            <div class="btn-row"></div>
          </div>`;

        const btnRow = card.querySelector(".btn-row");
        const sortBtn = el("button", {
          class: "btn-sortear", attrs: { type: "button" },
          html: `<span>${isSpinning ? "Sorteando…" : "🎲 Sortear"}</span>`,
        });
        sortBtn.disabled = isSpinning;
        sortBtn.addEventListener("click", handleSortear);
        btnRow.appendChild(sortBtn);

        if (hasSelected) {
          const detBtn = el("button", { class: "btn-detalhes", text: "Detalhes →", attrs: { type: "button" } });
          detBtn.addEventListener("click", () => onShowDetails(selectedTheme));
          btnRow.appendChild(detBtn);
        }
        cardSlot.appendChild(card);
      }

      function handleSortear() {
        if (isSpinning) return;
        isSpinning = true;
        drawCard();
        let count = 0;
        spinTimer = setInterval(() => {
          selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          drawCard();
          count++;
          if (count >= 18) {
            clearInterval(spinTimer);
            selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
            isSpinning = false;
            hasSelected = true;
            drawCard();
            setTimeout(() => onThemeSelected(selectedTheme), 500);
          }
        }, 80);
      }

      drawCard();

      // Acesso rápido aos jogos
      const quick = el("div", { class: "quick-grid" });
      QUICK.forEach(({ tab, icon, label, color }) => {
        const b = el("button", {
          class: "quick-btn", attrs: { type: "button" },
          style: `background:${color}33;border:1px solid ${color}66;`,
          html: `<span class="quick-icon">${icon}</span><span class="quick-label">${label}</span>`,
        });
        b.addEventListener("click", () => { activeTab = tab; refreshTabs(); drawContent(); });
        quick.appendChild(b);
      });
      pad.appendChild(quick);

      // Lista de todos os temas
      pad.appendChild(el("h3", { class: "section-label", text: "Todos os temas" }));
      const list = el("div", { class: "theme-list" });
      THEMES.forEach((t) => {
        const hasVideo = !!videos[String(t.num)];
        const row = el("button", { class: "theme-row", attrs: { type: "button" } });
        row.innerHTML = `
          <span class="theme-row-icon">${t.icon}</span>
          <div class="theme-row-info">
            <div class="theme-row-top">
              <span class="theme-row-num">#${t.num}</span>
              <p class="theme-row-name">${t.nome}</p>
            </div>
            <p class="theme-row-badge">${t.badge}</p>
          </div>
          ${hasVideo ? '<span class="theme-row-flag">Vídeo</span>' : ""}`;
        row.addEventListener("click", () => {
          selectedTheme = t;
          hasSelected = true;
          setTimeout(() => onThemeSelected(t), 500);
        });
        list.appendChild(row);
      });
      pad.appendChild(list);

      content.appendChild(pad);
    }

    drawContent();
  }

  window.HomeScreen = { render };
})();
