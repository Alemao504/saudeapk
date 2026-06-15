/* =========================================================================
   home.js — Tela principal do app (após o login)

   O que o usuário vê nesta tela:
     • Cabeçalho com "Bem-vindo(a), [Nome]" e botão de sair (avatar com inicial)
     • Barra de abas: Início | Quiz | Joguinho | Simulado
     • Na aba Início:
         - Card do tema atual com banner colorido, estatísticas e botão de sortear
         - Três botões de acesso rápido para os jogos (Quiz, Joguinho, Simulado)
         - Lista completa dos 20 temas de saúde

   Como funciona o sorteio:
     1. Usuário clica em "🎲 Sortear"
     2. O card pisca 18 temas aleatórios rapidamente (80ms cada)
     3. Um tema final é escolhido aleatoriamente
     4. app.js recebe o tema e dispara confete + vídeo
   ========================================================================= */

(function () {
  const { el } = DOM; // importa a função de criar elementos

  /*
    TABS: as quatro abas da barra de navegação inferior/superior.
    Cada aba tem id (identificador), texto e ícone.
  */
  const TABS = [
    { id: "home",     label: "Início",   icon: "🏠" },
    { id: "quiz",     label: "Quiz",     icon: "❓" },
    { id: "joguinho", label: "Joguinho", icon: "🎮" },
    { id: "simulado", label: "Simulado", icon: "📋" },
  ];

  /*
    QUICK: os três botões de acesso rápido que aparecem abaixo do card do tema.
    Cada um tem a cor do respectivo jogo (tons escuros de roxo, verde, marrom).
  */
  const QUICK = [
    { tab: "quiz",     icon: "❓", label: "Quiz",     color: "#5c2d91" },
    { tab: "joguinho", icon: "🎮", label: "Joguinho", color: "#0a6b5a" },
    { tab: "simulado", icon: "📋", label: "Simulado", color: "#6b3d00" },
  ];

  /*
    FUNÇÃO: render (desenhar a tela principal)

    O que faz:
      Monta toda a estrutura da tela: cabeçalho, abas e área de conteúdo.

    Parâmetros:
      - root:            onde a tela será inserida (div#app)
      - user:            dados do usuário logado (nome, email, etc.)
      - onLogout:        função chamada quando o usuário clica no avatar para sair
      - onThemeSelected: função chamada quando um tema é sorteado/escolhido
                         (em app.js: dispara confete e abre o vídeo)
      - onShowDetails:   função chamada quando o usuário clica em "Detalhes →"
                         (em app.js: abre o painel de detalhes do tema)
  */
  function render(root, { user, onLogout, onThemeSelected, onShowDetails }) {
    const THEMES = AppData.THEMES; // os 20 temas de saúde (do data.js)

    /*
      VARIÁVEIS DE ESTADO da tela principal:

        activeTab:     qual aba está ativa ("home", "quiz", "joguinho" ou "simulado")
        selectedTheme: o tema exibido atualmente no card do sorteio
                       começa com o primeiro tema (Hipertensão)
        isSpinning:    true enquanto a animação de sorteio está rodando
                       (impede clicar em Sortear de novo durante o sorteio)
        hasSelected:   true depois do primeiro sorteio
                       (controla se o botão "Detalhes →" aparece)
        spinTimer:     referência ao intervalo do sorteio (para poder cancelá-lo)
    */
    let activeTab = "home";
    let selectedTheme = THEMES[0];
    let isSpinning = false;
    let hasSelected = false;
    let spinTimer = null;

    // Caixa principal da tela (com espaço em baixo para não ficar colado)
    const screen = el("div", { class: "screen", style: "padding-bottom:2rem;" });

    /* ── CABEÇALHO ─────────────────────────────────────────────────────── */

    /*
      Barra fixa no topo com:
        • "Bem-vindo(a)," + nome do usuário (à esquerda)
        • Botão circular com a inicial do nome (à direita) — clicando faz logout
    */
    const header = el("div", { class: "header-bar" });
    header.innerHTML = `
      <div>
        <p class="header-hello">Bem-vindo(a),</p>
        <p class="header-name">${user.nome}</p>
      </div>`;

    // Botão avatar: círculo com a primeira letra do nome do usuário
    const avatar = el("button", {
      class: "avatar-btn",
      text: user.nome.charAt(0).toUpperCase(), // ex: "J" para "João"
      attrs: { type: "button", title: "Sair" },
      on: { click: onLogout }, // clicar nele faz logout
    });
    header.appendChild(avatar);
    screen.appendChild(header);

    /* ── BARRA DE ABAS ──────────────────────────────────────────────────── */

    /*
      Barra de navegação com quatro abas. Cada aba tem ícone e texto.
      A aba ativa fica com cor vermelha e borda inferior vermelha.
      Ao clicar em uma aba:
        1. Atualiza "activeTab"
        2. Destaca visualmente a aba clicada (refreshTabs)
        3. Redesenha o conteúdo (drawContent)
    */
    const nav = el("div", { class: "tab-nav scrollbar-hide" });
    TABS.forEach((t) => {
      const b = el("button", {
        class: t.id === "home" ? "active" : "", // "home" começa ativa
        attrs: { type: "button" },
        html: `<span class="tab-icon">${t.icon}</span>${t.label}`,
      });
      b.addEventListener("click", () => { activeTab = t.id; refreshTabs(); drawContent(); });
      nav.appendChild(b);
    });
    screen.appendChild(nav);

    /*
      FUNÇÃO: refreshTabs (atualizar visual das abas)

      O que faz:
        Marca a aba ativa com a classe "active" e remove das outras.
        O CSS usa "active" para aplicar a cor vermelha.
    */
    function refreshTabs() {
      [...nav.children].forEach((b, i) =>
        b.classList.toggle("active", TABS[i].id === activeTab)
      );
    }

    // Área de conteúdo que muda conforme a aba ativa
    const content = el("div");
    screen.appendChild(content);
    root.appendChild(screen);

    /* ── GERENCIAMENTO DE CONTEÚDO ──────────────────────────────────────── */

    /*
      FUNÇÃO: drawContent (desenhar conteúdo)

      O que faz:
        Limpa a área de conteúdo e chama a tela correspondente à aba ativa.
        Cada jogo (Quiz, Joguinho, Simulado) recebe o e-mail do usuário
        (para salvar o resultado) e a função "onBack" para voltar ao início.
    */
    function drawContent() {
      DOM.clear(content); // apaga o conteúdo anterior

      if (activeTab === "quiz")
        return QuizScreen.render(content, { userEmail: user.email, onBack: goHome });
      if (activeTab === "joguinho")
        return JoguinhoScreen.render(content, { userEmail: user.email, onBack: goHome });
      if (activeTab === "simulado")
        return SimuladoScreen.render(content, { userEmail: user.email, onBack: goHome });

      // Se for "home", desenha a tela principal
      drawHome();
    }

    /*
      FUNÇÃO: goHome (voltar ao início)

      O que faz:
        Volta para a aba "Início" a partir de qualquer jogo.
        Chamada quando o usuário clica em "Voltar" dentro de um jogo.
    */
    function goHome() { activeTab = "home"; refreshTabs(); drawContent(); }

    /* ════════════════════════════════════════════════════════════════════
       ABA INÍCIO (HOME)
       ════════════════════════════════════════════════════════════════════ */

    /*
      FUNÇÃO: drawHome (desenhar a aba Início)

      O que monta:
        1. Badge "● Atividade Avaliativa" + título "Saúde em Foco"
        2. Card do tema com banner, estatísticas e botões
        3. Grid de acesso rápido (Quiz, Joguinho, Simulado)
        4. Lista de todos os 20 temas
    */
    function drawHome() {
      const videos = Storage.getVideos(); // links de vídeos configurados pelo admin
      const pad = el("div", { class: "content-pad" });

      /* Badge de atividade e título */
      pad.insertAdjacentHTML("beforeend", `
        <!-- Badge verde pulsante indicando que é uma atividade ativa -->
        <div class="activity-badge">
          <span class="activity-dot pulse-dot"></span>
          <span class="activity-text">Atividade Avaliativa</span>
        </div>
        <!-- Título grande da tela -->
        <h2 class="font-display home-title">Saúde em Foco</h2>`);

      /*
        "cardSlot" é uma caixa reservada para o card do tema.
        O card é redesenhado sempre que o sorteio muda de tema
        (a cada 80ms durante a animação e uma vez quando termina).
      */
      const cardSlot = el("div");
      pad.appendChild(cardSlot);

      /* ── CARD DO TEMA ─────────────────────────────────────────────────── */

      /*
        FUNÇÃO: drawCard (desenhar card do tema)

        O que faz:
          Cria o card visual com o tema atualmente selecionado.
          O card tem:
            • Banner colorido com gradiente do tema, ícone, nome e badge
            • Corpo com estatísticas (3 números em grade)
            • Botão "🎲 Sortear" (e "Detalhes →" após o primeiro sorteio)

          É chamado muitas vezes durante a animação do sorteio (troca de tema).
      */
      function drawCard() {
        DOM.clear(cardSlot); // remove o card anterior
        const t = selectedTheme; // tema atual

        // Verifica se este tema tem vídeo configurado (mostra ▶ se tiver)
        const hasVideo = !!videos[String(t.num)];

        const card = el("div", { class: "sorteio-card" });
        card.innerHTML = `
          <!-- Banner do tema: fundo com gradiente nas cores do tema (c1 → c2) -->
          <div class="banner" style="background:linear-gradient(135deg, ${t.c1} 0%, ${t.c2} 100%);">
            <!-- Dois orbes decorativos nos cantos do banner (efeito de profundidade) -->
            <div class="banner-orb1" aria-hidden="true"></div>
            <div class="banner-orb2" aria-hidden="true"></div>

            <!-- Número do tema em tamanho enorme, quase invisível (opacidade 10%) -->
            <div class="banner-num" aria-hidden="true"><span>${t.num}</span></div>

            <!-- Conteúdo central: ícone, nome e categoria do tema -->
            <div class="banner-center">
              <span class="banner-emoji">${t.icon}</span>
              <h3 class="banner-name">${t.nome}</h3>
              <span class="banner-badge">${t.badge}</span>
            </div>

            <!-- Etiqueta verde "▶ Vídeo disponível" (só aparece se tiver vídeo) -->
            ${hasVideo ? '<div class="video-flag"><span>▶</span> Vídeo disponível</div>' : ""}
          </div>

          <!-- Corpo do card: categoria, título, descrição e estatísticas -->
          <div class="card-body">
            <div class="flex" style="align-items:center;gap:.5rem;margin-bottom:.5rem;">
              <span class="badge-pill">${t.badge}</span>
            </div>
            <h3 class="font-display card-title">${t.nome}</h3>
            <p class="card-desc">${t.desc}</p>

            <!-- Grade com 3 estatísticas do tema (valor + legenda) -->
            <div class="stats-grid">
              ${t.stats.map((s) => `<div class="stat-box"><p class="stat-v">${s.v}</p><p class="stat-l">${s.l}</p></div>`).join("")}
            </div>

            <!-- Área dos botões (preenchida abaixo) -->
            <div class="btn-row"></div>
          </div>`;

        /* Linha de botões do card */
        const btnRow = card.querySelector(".btn-row");

        /* Botão SORTEAR */
        const sortBtn = el("button", {
          class: "btn-sortear",
          attrs: { type: "button" },
          // Texto muda durante a animação: "Sorteando…" enquanto gira
          html: `<span>${isSpinning ? "Sorteando…" : "🎲 Sortear"}</span>`,
        });
        sortBtn.disabled = isSpinning; // desabilita durante a animação
        sortBtn.addEventListener("click", handleSortear);
        btnRow.appendChild(sortBtn);

        /* Botão DETALHES (só aparece depois do primeiro sorteio) */
        if (hasSelected) {
          const detBtn = el("button", {
            class: "btn-detalhes",
            text: "Detalhes →",
            attrs: { type: "button" },
          });
          detBtn.addEventListener("click", () => onShowDetails(selectedTheme));
          btnRow.appendChild(detBtn);
        }

        cardSlot.appendChild(card);
      }

      /* ── ANIMAÇÃO DO SORTEIO ────────────────────────────────────────── */

      /*
        FUNÇÃO: handleSortear (processar clique em Sortear)

        O que faz:
          Inicia a animação "caça-níquel" do sorteio:
            1. Define isSpinning = true (bloqueia novo clique)
            2. Atualiza o card 18 vezes, trocando o tema aleatoriamente (a cada 80ms)
            3. Na 18ª troca, escolhe o tema final e para
            4. Aguarda 500ms e chama onThemeSelected() para abrir o vídeo
      */
      function handleSortear() {
        if (isSpinning) return; // ignora se já está sorteando
        isSpinning = true;
        drawCard(); // atualiza o botão para "Sorteando…"

        let count = 0;
        spinTimer = setInterval(() => {
          // Escolhe um tema aleatório a cada 80ms (efeito visual de girar)
          selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          drawCard();
          count++;

          if (count >= 18) {
            clearInterval(spinTimer); // para a animação após 18 trocas
            selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)]; // tema final
            isSpinning = false;
            hasSelected = true; // ativa o botão "Detalhes →"
            drawCard();
            // 500ms depois chama app.js para disparar o confete e abrir o vídeo
            setTimeout(() => onThemeSelected(selectedTheme), 500);
          }
        }, 80); // 80ms entre cada troca = ~1,4 segundo no total
      }

      // Desenha o card com o tema inicial
      drawCard();

      /* ── ACESSO RÁPIDO AOS JOGOS ────────────────────────────────────── */

      /*
        Grade 3×1 com botões para Quiz, Joguinho e Simulado.
        Cada botão tem fundo semi-transparente na cor do jogo.
      */
      const quick = el("div", { class: "quick-grid" });
      QUICK.forEach(({ tab, icon, label, color }) => {
        const b = el("button", {
          class: "quick-btn",
          attrs: { type: "button" },
          // Fundo e borda com a cor do jogo em 20% e 40% de opacidade
          style: `background:${color}33;border:1px solid ${color}66;`,
          html: `<span class="quick-icon">${icon}</span><span class="quick-label">${label}</span>`,
        });
        // Ao clicar, vai para a aba do jogo correspondente
        b.addEventListener("click", () => { activeTab = tab; refreshTabs(); drawContent(); });
        quick.appendChild(b);
      });
      pad.appendChild(quick);

      /* ── LISTA DE TODOS OS TEMAS ─────────────────────────────────────── */

      /*
        Lista vertical com todos os 20 temas de saúde.
        Cada linha tem: ícone + número + nome + categoria + etiqueta "Vídeo" (se tiver).
        Clicar em qualquer tema tem o mesmo efeito que sortear aquele tema diretamente.
      */
      pad.appendChild(el("h3", { class: "section-label", text: "Todos os temas" }));
      const list = el("div", { class: "theme-list" });

      THEMES.forEach((t) => {
        const hasVideo = !!videos[String(t.num)];
        const row = el("button", { class: "theme-row", attrs: { type: "button" } });
        row.innerHTML = `
          <!-- Ícone do tema à esquerda -->
          <span class="theme-row-icon">${t.icon}</span>

          <!-- Informações: número, nome e categoria -->
          <div class="theme-row-info">
            <div class="theme-row-top">
              <span class="theme-row-num">#${t.num}</span>
              <p class="theme-row-name">${t.nome}</p>
            </div>
            <p class="theme-row-badge">${t.badge}</p>
          </div>

          <!-- Etiqueta verde "Vídeo" (só aparece se tiver vídeo configurado) -->
          ${hasVideo ? '<span class="theme-row-flag">Vídeo</span>' : ""}`;

        // Clicar no tema: seleciona e abre o vídeo (mesmo fluxo do sortear)
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

    // Desenha o conteúdo inicial (aba Início)
    drawContent();
  }

  // Exporta a função render para ser chamada em app.js
  window.HomeScreen = { render };
})();
