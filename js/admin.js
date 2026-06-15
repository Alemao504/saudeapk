/* =========================================================================
   admin.js — Painel administrativo (vídeos, estatísticas, usuários)
   render(root, { onLogout })
   ========================================================================= */

(function () {
  const { el } = DOM;

  const ADMIN_TABS = [
    { id: "videos", label: "📹 Vídeos" },
    { id: "stats", label: "📊 Estatísticas" },
    { id: "users", label: "👥 Usuários" },
  ];

  function render(root, { onLogout }) {
    const THEMES = AppData.THEMES;
    let tab = "videos";
    let videos = Storage.getVideos();
    let expanded = null;
    const inputVals = {};

    const screen = el("div", { class: "screen" });

    // Cabeçalho
    const header = el("div", { class: "header-bar" });
    header.appendChild(el("h1", { class: "admin-header-title", text: "⚙️ Painel Admin" }));
    header.appendChild(el("button", {
      class: "btn-logout-admin", text: "Sair", attrs: { type: "button" }, on: { click: onLogout },
    }));
    screen.appendChild(header);

    // Abas
    const tabs = el("div", { class: "admin-tabs" });
    ADMIN_TABS.forEach((t) => {
      const b = el("button", {
        class: t.id === "videos" ? "active" : "", text: t.label, attrs: { type: "button" },
      });
      b.addEventListener("click", () => { tab = t.id; refreshTabs(); draw(); });
      tabs.appendChild(b);
    });
    screen.appendChild(tabs);

    function refreshTabs() {
      [...tabs.children].forEach((b, i) => b.classList.toggle("active", ADMIN_TABS[i].id === tab));
    }

    const body = el("div", { class: "admin-pad" });
    screen.appendChild(body);
    root.appendChild(screen);

    // ── Aba Vídeos ───────────────────────────────────────────────────────
    function drawVideos() {
      const wrap = el("div");
      wrap.appendChild(el("p", {
        class: "admin-hint",
        text: 'Use links do Google Drive ("Qualquer pessoa com o link") ou um arquivo de vídeo local (mp4/webm).',
      }));

      THEMES.forEach((t) => {
        const hasVideo = !!videos[String(t.num)];
        const item = el("div", { class: "video-item" });

        const head = el("button", { class: "video-head", attrs: { type: "button" } });
        head.innerHTML = `
          <span class="video-head-icon">${t.icon}</span>
          <div class="video-head-info">
            <span class="video-head-num">#${t.num}</span>
            <p class="video-head-name">${t.nome}</p>
          </div>
          ${hasVideo ? '<span class="video-check">✓</span>' : ""}
          <span class="video-chevron">${expanded === t.num ? "▲" : "▼"}</span>`;
        head.addEventListener("click", () => {
          expanded = expanded === t.num ? null : t.num;
          draw();
        });
        item.appendChild(head);

        if (expanded === t.num) {
          const bodyEl = el("div", { class: "video-body" });
          const input = el("input", {
            class: "video-input",
            attrs: { type: "url", placeholder: "https://drive.google.com/file/d/... ou video/1.mp4" },
          });
          input.value = inputVals[String(t.num)] ?? videos[String(t.num)] ?? "";
          input.addEventListener("input", (e) => { inputVals[String(t.num)] = e.target.value; });
          bodyEl.appendChild(input);

          const btns = el("div", { class: "video-btns" });
          const save = el("button", { class: "video-save", text: "Salvar", attrs: { type: "button" } });
          save.addEventListener("click", () => {
            const url = inputVals[String(t.num)] ?? videos[String(t.num)] ?? "";
            videos = { ...videos, [String(t.num)]: url };
            Storage.saveVideos(videos);
            expanded = null;
            draw();
          });
          btns.appendChild(save);

          if (hasVideo) {
            const remove = el("button", { class: "video-remove", text: "Remover", attrs: { type: "button" } });
            remove.addEventListener("click", () => {
              const upd = { ...videos };
              delete upd[String(t.num)];
              videos = upd;
              Storage.saveVideos(videos);
              delete inputVals[String(t.num)];
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

    // ── Aba Estatísticas ─────────────────────────────────────────────────
    function drawStats() {
      const sorteios = Storage.getSorteios();
      const users = Storage.getUsers();
      const counts = {};
      sorteios.forEach((s) => { counts[s.num] = (counts[s.num] ?? 0) + 1; });
      const top = [...THEMES].sort((a, b) => (counts[b.num] ?? 0) - (counts[a.num] ?? 0)).slice(0, 5);

      const wrap = el("div");
      wrap.insertAdjacentHTML("beforeend", `
        <div class="admin-stat-grid">
          <div class="admin-stat"><p class="font-display admin-stat-v" style="color:#e05a45;">${users.length}</p><p class="admin-stat-l">Usuários</p></div>
          <div class="admin-stat"><p class="font-display admin-stat-v" style="color:#3dba7a;">${sorteios.length}</p><p class="admin-stat-l">Sorteios</p></div>
        </div>
        <h3 class="section-label">Top 5 temas sorteados</h3>`);

      const list = el("div");
      top.forEach((t, i) => {
        const row = el("div", { class: "top-theme" });
        row.innerHTML = `
          <span class="top-rank" style="color:${i === 0 ? "#e05a45" : "#7a7e96"};">#${i + 1}</span>
          <span class="top-icon">${t.icon}</span>
          <span class="top-name">${t.nome}</span>
          <span class="top-count">${counts[t.num] ?? 0}</span>`;
        list.appendChild(row);
      });
      wrap.appendChild(list);
      return wrap;
    }

    // ── Aba Usuários ─────────────────────────────────────────────────────
    function drawUsers() {
      const users = Storage.getUsers();
      const wrap = el("div");
      if (!users.length) {
        wrap.appendChild(el("p", { class: "empty-msg", text: "Nenhum usuário cadastrado." }));
        return wrap;
      }
      users.forEach((u) => {
        const item = el("div", { class: "user-item" });
        item.innerHTML = `
          <div class="user-row">
            <div class="user-avatar">${u.nome.charAt(0).toUpperCase()}</div>
            <div class="user-info">
              <p class="user-name">${u.nome}</p>
              <p class="user-email">${u.email}</p>
              <p class="user-meta">${u.univ} — ${u.cidade}/${u.estado}</p>
            </div>
          </div>`;
        wrap.appendChild(item);
      });
      return wrap;
    }

    function draw() {
      DOM.clear(body);
      if (tab === "videos") body.appendChild(drawVideos());
      else if (tab === "stats") body.appendChild(drawStats());
      else body.appendChild(drawUsers());
    }

    draw();
  }

  window.AdminScreen = { render };
})();
