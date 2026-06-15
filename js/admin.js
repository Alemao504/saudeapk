/* =========================================================================
   admin.js — Painel administrativo (vídeos, estatísticas, usuários)

   Quem acessa esta tela:
     Apenas o administrador, com login: admin@saudeemfoco.com / admin2024

   O que o admin pode fazer aqui:
     📹 Vídeos      → configurar o link do vídeo de cada um dos 20 temas
     📊 Estatísticas → ver quantos usuários existem e quais temas são mais sorteados
     👥 Usuários    → ver a lista de todos os usuários cadastrados

   Como funciona internamente:
     A tela é dividida em três abas. Quando o admin clica em uma aba,
     o conteúdo da área principal é apagado e redesenhado com o conteúdo
     da aba clicada.
   ========================================================================= */

(function () {
  /*
    Importa a função el (criar elementos HTML) do dom.js.
    const { el } = DOM é a mesma coisa que escrever:
      const el = DOM.el;
  */
  const { el } = DOM;

  /*
    ADMIN_TABS: define as três abas do painel admin.
    Cada aba tem:
      id    → identificador interno usado para saber qual aba está ativa
      label → texto e ícone que aparece no botão da aba
  */
  const ADMIN_TABS = [

    /*
      { id: "videos", label: "📹 Vídeos" }

      O QUE É:
        Um objeto (conjunto de informações) que representa a aba de vídeos.

      CAMPOS:
        id: "videos"
          → Nome interno que o código usa para saber qual aba está ativa.
            Nunca aparece na tela. É como o "CPF" da aba — só o sistema usa.
            Quando o admin clica nesta aba, a variável "tab" vira "videos",
            e o código chama a função drawVideos() para montar o conteúdo.

        label: "📹 Vídeos"
          → O texto que APARECE no botão da aba na tela.
            O admin vê exatamente isso escrito no botão.

      ONDE APARECE NA TELA:
        Primeiro botão da barra de abas no topo do painel admin.

      PARA QUE SERVE:
        Ao clicar, mostra a lista dos 20 temas de saúde onde o admin
        pode configurar o link do vídeo de cada tema
        (colando um link do Google Drive ou o caminho de um arquivo local).

      COMO AGE:
        O código faz um loop por esta lista e cria um botão para cada item.
        Quando clicado, compara o "id" com a variável "tab" para saber
        qual função chamar (drawVideos, drawStats ou drawUsers).
    */
    { id: "videos", label: "📹 Vídeos" },

    /*
      { id: "stats", label: "📊 Estatísticas" }

      O QUE É:
        Objeto que representa a aba de estatísticas.

      CAMPOS:
        id: "stats"
          → Identificador interno. Quando ativo, o código chama drawStats().

        label: "📊 Estatísticas"
          → Texto do botão que o admin vê na tela.

      ONDE APARECE NA TELA:
        Segundo botão da barra de abas (entre Vídeos e Usuários).

      PARA QUE SERVE:
        Mostra um painel com números e gráficos simples:
          • Total de usuários cadastrados no app
          • Total de sorteios realizados
          • Top 5 temas mais sorteados (em ordem de popularidade)

      COMO AGE:
        Ativa a função drawStats() que lê os dados do localStorage
        (Storage.getSorteios e Storage.getUsers) e monta a tela com os números.
    */
    { id: "stats",  label: "📊 Estatísticas" },

    /*
      { id: "users", label: "👥 Usuários" }

      O QUE É:
        Objeto que representa a aba de usuários.

      CAMPOS:
        id: "users"
          → Identificador interno. Quando ativo, o código chama drawUsers().

        label: "👥 Usuários"
          → Texto do botão que o admin vê na tela.

      ONDE APARECE NA TELA:
        Terceiro e último botão da barra de abas.

      PARA QUE SERVE:
        Mostra a lista de todos os alunos/usuários cadastrados no app.
        Para cada usuário aparece:
          • Avatar com a inicial do nome (círculo vermelho com a letra)
          • Nome completo
          • E-mail
          • Universidade, cidade e estado

      COMO AGE:
        Ativa a função drawUsers() que lê Storage.getUsers() e cria
        um card para cada usuário encontrado na lista.
        Se não houver nenhum usuário, mostra "Nenhum usuário cadastrado."
    */
    { id: "users",  label: "👥 Usuários" },

  ];

  /*
    FUNÇÃO: render (desenhar o painel admin)

    O que faz:
      Monta toda a estrutura do painel: cabeçalho, abas e área de conteúdo.
      A área de conteúdo é atualizada toda vez que o admin clica em uma aba.

    Parâmetros:
      - root:     a caixa principal da página (div#app)
      - onLogout: função chamada quando o admin clica em "Sair"
  */
  function render(root, { onLogout }) {
    const THEMES = AppData.THEMES; // lista dos 20 temas de saúde (do data.js)

    /*
      VARIÁVEIS DE ESTADO do painel admin:

        tab        → qual aba está ativa agora (começa em "videos")
        videos     → dicionário de links de vídeos salvos { "1": "url...", "5": "url..." }
        expanded   → número do tema que está com o formulário de edição aberto
                     null = nenhum tema expandido
        inputVals  → rascunho dos links digitados pelo admin antes de salvar
                     { "3": "https://drive..." }
    */
    let tab = "videos";
    let videos = Storage.getVideos();
    let expanded = null;
    const inputVals = {};

    /* ── ESTRUTURA DA TELA ──────────────────────────────────────────────── */

    // Caixa que ocupa a tela inteira
    const screen = el("div", { class: "screen" });

    /* ── CABEÇALHO ─────────────────────────────────────────────────────── */

    /*
      Barra no topo da tela com:
        • Título "⚙️ Painel Admin" à esquerda
        • Botão "Sair" à direita (chama onLogout quando clicado)
    */
    const header = el("div", { class: "header-bar" });
    header.appendChild(el("h1", { class: "admin-header-title", text: "⚙️ Painel Admin" }));
    header.appendChild(el("button", {
      class: "btn-logout-admin",
      text: "Sair",
      attrs: { type: "button" },
      on: { click: onLogout }, // chama onLogout() quando clicado
    }));
    screen.appendChild(header);

    /* ── ABAS DE NAVEGAÇÃO ──────────────────────────────────────────────── */

    /*
      Cria os três botões de aba (Vídeos, Estatísticas, Usuários).
      Quando clicado, cada botão:
        1. Atualiza "tab" com o id da aba clicada
        2. Chama refreshTabs() para destacar a aba ativa
        3. Chama draw() para redesenhar o conteúdo
    */
    const tabs = el("div", { class: "admin-tabs" });
    ADMIN_TABS.forEach((t) => {
      const b = el("button", {
        class: t.id === "videos" ? "active" : "", // "videos" começa como aba ativa
        text: t.label,
        attrs: { type: "button" },
      });
      b.addEventListener("click", () => { tab = t.id; refreshTabs(); draw(); });
      tabs.appendChild(b);
    });
    screen.appendChild(tabs);

    /*
      FUNÇÃO: refreshTabs (atualizar visual das abas)

      O que faz:
        Percorre todos os botões de aba e adiciona/remove a classe "active"
        dependendo se a aba corresponde à "tab" atual.
        O CSS usa "active" para destacar a aba selecionada (cor + borda inferior).
    */
    function refreshTabs() {
      [...tabs.children].forEach((b, i) =>
        b.classList.toggle("active", ADMIN_TABS[i].id === tab)
      );
    }

    // Área de conteúdo principal (abaixo das abas)
    const body = el("div", { class: "admin-pad" });
    screen.appendChild(body);
    root.appendChild(screen);

    /* ════════════════════════════════════════════════════════════════════
       ABA: VÍDEOS
       ════════════════════════════════════════════════════════════════════

       Mostra uma lista com os 20 temas de saúde.
       Para cada tema, o admin pode:
         • Ver se já tem vídeo configurado (aparece o ✓ verde)
         • Clicar no tema para expandir e ver/editar o link do vídeo
         • Colar um link do Google Drive ou o caminho de um vídeo local
         • Salvar ou remover o vídeo
    */
    function drawVideos() {
      const wrap = el("div");

      // Dica de uso no topo da aba
      wrap.appendChild(el("p", {
        class: "admin-hint",
        text: 'Use links do Google Drive ("Qualquer pessoa com o link") ou um arquivo de vídeo local (mp4/webm).',
      }));

      /*
        Para cada um dos 20 temas, cria um item da lista.
        Cada item tem:
          • Cabeçalho clicável (ícone + número + nome + ✓ se tem vídeo + seta ▲/▼)
          • Formulário oculto que aparece quando clicado (campo de URL + botões)
      */
      THEMES.forEach((t) => {
        // Verifica se já existe um vídeo configurado para este tema
        const hasVideo = !!videos[String(t.num)]; // !! converte para true/false

        // Caixa do item (borda arredondada, fundo escuro)
        const item = el("div", { class: "video-item" });

        /* ── Cabeçalho do item (sempre visível) ── */
        const head = el("button", { class: "video-head", attrs: { type: "button" } });
        head.innerHTML = `
          <!-- Ícone do tema (emoji) -->
          <span class="video-head-icon">${t.icon}</span>

          <!-- Informações: número e nome do tema -->
          <div class="video-head-info">
            <span class="video-head-num">#${t.num}</span>
            <p class="video-head-name">${t.nome}</p>
          </div>

          <!-- Marca de vídeo configurado (só aparece se hasVideo for true) -->
          ${hasVideo ? '<span class="video-check">✓</span>' : ""}

          <!-- Seta: ▲ se este tema está expandido, ▼ se está fechado -->
          <span class="video-chevron">${expanded === t.num ? "▲" : "▼"}</span>`;

        /*
          Quando o admin clica no cabeçalho:
            • Se o tema clicado JÁ estava expandido → fecha (expanded = null)
            • Se o tema clicado estava fechado → expande (expanded = t.num)
            Depois redesenha a lista para refletir a mudança.
        */
        head.addEventListener("click", () => {
          expanded = expanded === t.num ? null : t.num;
          draw();
        });
        item.appendChild(head);

        /* ── Formulário de edição (só aparece quando o tema está expandido) ── */
        if (expanded === t.num) {
          const bodyEl = el("div", { class: "video-body" });

          /*
            Campo de texto onde o admin cola o link do vídeo.
            O valor inicial é:
              1. O que o admin já digitou nesta sessão (inputVals)
              2. Ou o link já salvo no localStorage (videos)
              3. Ou vazio ("") se não tem nada
          */
          const input = el("input", {
            class: "video-input",
            attrs: {
              type: "url",
              placeholder: "https://drive.google.com/file/d/... ou video/pressao_alta.mp4"
            },
          });
          input.value = inputVals[String(t.num)] ?? videos[String(t.num)] ?? "";

          // Atualiza o rascunho enquanto o admin digita (sem salvar ainda)
          input.addEventListener("input", (e) => { inputVals[String(t.num)] = e.target.value; });
          bodyEl.appendChild(input);

          // Linha de botões: Salvar + Remover (se já houver vídeo)
          const btns = el("div", { class: "video-btns" });

          /* Botão SALVAR */
          const save = el("button", { class: "video-save", text: "Salvar", attrs: { type: "button" } });
          save.addEventListener("click", () => {
            // Lê o link digitado (ou o existente se nada foi digitado)
            const url = inputVals[String(t.num)] ?? videos[String(t.num)] ?? "";
            // Adiciona o link ao dicionário de vídeos (sem apagar os outros temas)
            videos = { ...videos, [String(t.num)]: url };
            Storage.saveVideos(videos); // salva no navegador
            expanded = null;            // fecha o formulário
            draw();                     // redesenha a lista
          });
          btns.appendChild(save);

          /* Botão REMOVER (só aparece se já existe um vídeo configurado) */
          if (hasVideo) {
            const remove = el("button", { class: "video-remove", text: "Remover", attrs: { type: "button" } });
            remove.addEventListener("click", () => {
              const upd = { ...videos };      // cópia do dicionário atual
              delete upd[String(t.num)];      // remove o link deste tema
              videos = upd;
              Storage.saveVideos(videos);
              delete inputVals[String(t.num)]; // limpa o rascunho também
              draw();
            });
            btns.appendChild(remove);
          }

          bodyEl.appendChild(btns);
          item.appendChild(bodyEl);
        }

        wrap.appendChild(item);
      });

      return wrap;
    }

    /* ════════════════════════════════════════════════════════════════════
       ABA: ESTATÍSTICAS
       ════════════════════════════════════════════════════════════════════

       Mostra dois números grandes:
         • Total de usuários cadastrados
         • Total de sorteios realizados

       E abaixo: os 5 temas mais sorteados em ordem de popularidade.
    */
    function drawStats() {
      // Busca os dados do localStorage
      const sorteios = Storage.getSorteios(); // lista de todos os sorteios
      const users = Storage.getUsers();       // lista de todos os usuários

      /*
        Conta quantas vezes cada tema foi sorteado.
        "counts" fica assim: { 1: 5, 3: 12, 7: 2, ... }
        Onde a chave é o número do tema e o valor é a quantidade de sorteios.
      */
      const counts = {};
      sorteios.forEach((s) => { counts[s.num] = (counts[s.num] ?? 0) + 1; });

      /*
        Ordena os temas por número de sorteios (do mais para o menos sorteado)
        e pega apenas os 5 primeiros.
      */
      const top = [...THEMES]
        .sort((a, b) => (counts[b.num] ?? 0) - (counts[a.num] ?? 0))
        .slice(0, 5);

      const wrap = el("div");

      // Grade com os dois números grandes (usuários e sorteios)
      wrap.insertAdjacentHTML("beforeend", `
        <div class="admin-stat-grid">
          <!-- Número de usuários cadastrados (em vermelho) -->
          <div class="admin-stat">
            <p class="font-display admin-stat-v" style="color:#e05a45;">${users.length}</p>
            <p class="admin-stat-l">Usuários</p>
          </div>
          <!-- Total de sorteios realizados (em verde) -->
          <div class="admin-stat">
            <p class="font-display admin-stat-v" style="color:#3dba7a;">${sorteios.length}</p>
            <p class="admin-stat-l">Sorteios</p>
          </div>
        </div>
        <h3 class="section-label">Top 5 temas sorteados</h3>`);

      // Lista dos 5 temas mais populares
      const list = el("div");
      top.forEach((t, i) => {
        const row = el("div", { class: "top-theme" });
        row.innerHTML = `
          <!-- Posição no ranking: #1 em vermelho, demais em cinza -->
          <span class="top-rank" style="color:${i === 0 ? "#e05a45" : "#7a7e96"};">#${i + 1}</span>
          <span class="top-icon">${t.icon}</span>
          <span class="top-name">${t.nome}</span>
          <!-- Número de sorteios deste tema (0 se nunca foi sorteado) -->
          <span class="top-count">${counts[t.num] ?? 0}</span>`;
        list.appendChild(row);
      });
      wrap.appendChild(list);

      return wrap;
    }

    /* ════════════════════════════════════════════════════════════════════
       ABA: USUÁRIOS
       ════════════════════════════════════════════════════════════════════

       Mostra a lista de todos os usuários cadastrados.
       Para cada usuário: avatar com a inicial do nome, nome, e-mail, universidade, cidade/estado.
       Se não houver nenhum usuário, mostra uma mensagem "Nenhum usuário cadastrado."
    */
    function drawUsers() {
      const users = Storage.getUsers(); // busca a lista do localStorage
      const wrap = el("div");

      // Se a lista estiver vazia, mostra mensagem e encerra
      if (!users.length) {
        wrap.appendChild(el("p", { class: "empty-msg", text: "Nenhum usuário cadastrado." }));
        return wrap;
      }

      // Para cada usuário, cria um card com suas informações
      users.forEach((u) => {
        const item = el("div", { class: "user-item" });
        item.innerHTML = `
          <div class="user-row">
            <!-- Avatar circular com a primeira letra do nome em maiúsculo -->
            <div class="user-avatar">${u.nome.charAt(0).toUpperCase()}</div>

            <!-- Informações do usuário -->
            <div class="user-info">
              <p class="user-name">${u.nome}</p>
              <p class="user-email">${u.email}</p>
              <!-- Universidade, cidade e estado separados por travessão -->
              <p class="user-meta">${u.univ} — ${u.cidade}/${u.estado}</p>
            </div>
          </div>`;
        wrap.appendChild(item);
      });

      return wrap;
    }

    /* ── FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO ──────────────────────────────── */

    /*
      FUNÇÃO: draw (desenhar o conteúdo)

      O que faz:
        Limpa a área de conteúdo e redesenha com a aba atualmente ativa.
        É chamada:
          • Ao abrir o painel (exibe a aba Vídeos por padrão)
          • Toda vez que o admin clica em uma aba diferente
          • Toda vez que o admin salva/remove um vídeo (para atualizar o ✓)
          • Toda vez que o admin expande/fecha um item da lista de vídeos
    */
    function draw() {
      DOM.clear(body); // limpa o conteúdo atual

      if (tab === "videos")      body.appendChild(drawVideos());
      else if (tab === "stats")  body.appendChild(drawStats());
      else                       body.appendChild(drawUsers());
    }

    // Desenha o conteúdo inicial (aba Vídeos)
    draw();
  }

  // Exporta a função render para ser chamada em app.js
  window.AdminScreen = { render };
})();
