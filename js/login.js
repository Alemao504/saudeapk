/* =========================================================================
   login.js — Tela de login e cadastro
   render(root, { onLogin }) -> desenha a tela e liga os eventos.
   ========================================================================= */

(function () {
  const { el, ecgLineSVG } = { el: DOM.el, ecgLineSVG: Anim.ecgLineSVG };

  const ADMIN = {
    email: "admin@saudeemfoco.com",
    senha: "admin2024",
    nome: "Administrador",
    univ: "Saúde em Foco",
    estado: "SP",
    cidade: "São Paulo",
  };

  function render(root, { onLogin }) {
    let tab = "login";

    const wrap = el("div", { class: "login-wrap" });

    // Camada de corações + orbes de brilho (fundo)
    wrap.appendChild(Anim.createFallingHearts(20));
    wrap.appendChild(el("div", { class: "glow-orb tr", attrs: { "aria-hidden": "true" } }));
    wrap.appendChild(el("div", { class: "glow-orb bl", attrs: { "aria-hidden": "true" } }));
    wrap.appendChild(el("div", { class: "glow-orb center", attrs: { "aria-hidden": "true" } }));

    // Cruzes decorativas + ícones flutuantes
    wrap.insertAdjacentHTML("beforeend", `
      <div class="deco-cross float-cross" style="top:3rem;left:1.5rem;opacity:.12;" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="#e05a45">
          <rect x="14" y="2" width="12" height="36" rx="3"/><rect x="2" y="14" width="36" height="12" rx="3"/>
        </svg>
      </div>
      <div class="deco-cross float-cross" style="bottom:4rem;right:1.5rem;opacity:.08;animation-delay:2s;" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="#3dba7a">
          <rect x="14" y="2" width="12" height="36" rx="3"/><rect x="2" y="14" width="36" height="12" rx="3"/>
        </svg>
      </div>
      <div class="deco-icon" style="top:25%;right:2rem;opacity:.15;font-size:22px;animation:float-cross 5s ease-in-out 1s infinite;" aria-hidden="true">🩺</div>
      <div class="deco-icon" style="bottom:25%;left:2rem;opacity:.12;font-size:18px;animation:float-cross 6s ease-in-out 3s infinite;" aria-hidden="true">💊</div>
    `);

    // Cartão de login
    const card = el("div", { class: "login-card login-card-enter", style: "animation-delay:.1s;" });

    // Logo
    card.insertAdjacentHTML("beforeend", `
      <div class="text-center" style="margin-bottom:1.5rem;">
        <div class="relative" style="display:inline-flex;flex-direction:column;align-items:center;">
          <div class="logo-badge glow-pulse">
            <span class="heartbeat" style="font-size:2.25rem;" role="img" aria-label="coração">❤️</span>
          </div>
          <h1 class="font-display logo-title">
            <span style="color:#f0ece4;">Saúde em </span><span style="color:#e05a45;">Foco</span>
          </h1>
          <p class="logo-sub">Educação Médica</p>
        </div>
        <div style="margin-top:1rem;margin-bottom:.25rem;opacity:.8;">${ecgLineSVG()}</div>
        <p class="logo-prof">Prof. Lucas Fernandes</p>
      </div>
    `);

    // Cartão glass
    const glass = el("div", { class: "glass-card" });

    // Ícones de saúde animados
    const iconRow = el("div", { class: "icon-row" });
    ["🫀", "🧬", "🩺", "💉", "🩻"].forEach((ic, i) => {
      const s = el("span", { text: ic });
      s.style.animation = `float-cross ${3.5 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`;
      iconRow.appendChild(s);
    });
    glass.appendChild(iconRow);

    // Abas Entrar/Cadastrar
    const tabSwitch = el("div", { class: "tab-switch" });
    const btnLogin = el("button", { class: "active", text: "Entrar", attrs: { type: "button" } });
    const btnReg = el("button", { text: "Cadastrar", attrs: { type: "button" } });
    tabSwitch.append(btnLogin, btnReg);
    glass.appendChild(tabSwitch);

    // Área de erro + formulários
    const errorBox = el("div", { class: "alert-error hidden" });
    glass.appendChild(errorBox);

    const formArea = el("div");
    glass.appendChild(formArea);

    card.appendChild(glass);
    card.appendChild(el("p", { class: "login-footer", text: "🏥 Educação médica para estudantes da saúde" }));
    wrap.appendChild(card);
    root.appendChild(wrap);

    function showError(msg) {
      if (msg) { errorBox.textContent = msg; errorBox.classList.remove("hidden"); }
      else errorBox.classList.add("hidden");
    }

    // ── Formulário de login ──────────────────────────────────────────────
    function loginForm() {
      const f = el("form");
      f.innerHTML = `
        <div class="field">
          <label class="field-label" for="login-email">E-mail</label>
          <input id="login-email" class="field-input" type="email" placeholder="seu@email.com">
        </div>
        <div class="field">
          <label class="field-label" for="login-senha">Senha</label>
          <input id="login-senha" class="field-input" type="password" placeholder="••••••">
        </div>
        <button type="submit" class="btn-primary">Entrar</button>`;
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        showError("");
        const email = f.querySelector("#login-email").value.trim();
        const senha = f.querySelector("#login-senha").value;
        if (!email || !senha) return showError("Preencha todos os campos.");
        if (email === ADMIN.email && senha === ADMIN.senha) {
          return onLogin({ ...ADMIN, criadoEm: new Date().toISOString() });
        }
        const user = Storage.getUsers().find((u) => u.email === email && u.senha === senha);
        if (!user) return showError("E-mail ou senha incorretos.");
        onLogin(user);
      });
      return f;
    }

    // ── Formulário de cadastro ───────────────────────────────────────────
    function registerForm() {
      const f = el("form");
      const ufOpts = ["<option value=''>UF</option>"]
        .concat(AppData.ESTADOS.map((uf) => `<option value="${uf}">${uf}</option>`))
        .join("");
      f.innerHTML = `
        <div class="field"><label class="field-label" for="reg-nome">Nome completo</label>
          <input id="reg-nome" class="field-input" type="text" placeholder="Seu nome"></div>
        <div class="field"><label class="field-label" for="reg-email">E-mail</label>
          <input id="reg-email" class="field-input" type="email" placeholder="seu@email.com"></div>
        <div class="field"><label class="field-label" for="reg-senha">Senha</label>
          <input id="reg-senha" class="field-input" type="password" placeholder="Mín. 6 caracteres"></div>
        <div class="field"><label class="field-label" for="reg-univ">Universidade</label>
          <input id="reg-univ" class="field-input" type="text" placeholder="Nome da faculdade"></div>
        <div class="field-grid2">
          <div><label class="field-label" for="reg-estado">Estado</label>
            <select id="reg-estado" class="field-input">${ufOpts}</select></div>
          <div><label class="field-label" for="reg-cidade">Cidade</label>
            <input id="reg-cidade" class="field-input" type="text" placeholder="Cidade"></div>
        </div>
        <button type="submit" class="btn-primary">Criar conta</button>`;
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        showError("");
        const nome = f.querySelector("#reg-nome").value.trim();
        const email = f.querySelector("#reg-email").value.trim();
        const senha = f.querySelector("#reg-senha").value;
        const univ = f.querySelector("#reg-univ").value.trim();
        const estado = f.querySelector("#reg-estado").value;
        const cidade = f.querySelector("#reg-cidade").value.trim();
        if (!nome || !email || !senha || !univ || !estado || !cidade)
          return showError("Preencha todos os campos.");
        if (senha.length < 6) return showError("Senha deve ter ao menos 6 caracteres.");
        const users = Storage.getUsers();
        if (users.find((u) => u.email === email)) return showError("E-mail já cadastrado.");
        const novo = { email, senha, nome, univ, estado, cidade, criadoEm: new Date().toISOString() };
        users.push(novo);
        Storage.saveUsers(users);
        onLogin(novo);
      });
      return f;
    }

    function renderForm() {
      formArea.replaceChildren(tab === "login" ? loginForm() : registerForm());
    }

    btnLogin.addEventListener("click", () => {
      tab = "login"; showError("");
      btnLogin.classList.add("active"); btnReg.classList.remove("active");
      renderForm();
    });
    btnReg.addEventListener("click", () => {
      tab = "register"; showError("");
      btnReg.classList.add("active"); btnLogin.classList.remove("active");
      renderForm();
    });

    renderForm();
  }

  window.LoginScreen = { render };
})();
