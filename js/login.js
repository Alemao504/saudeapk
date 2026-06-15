/* =========================================================================
   login.js — Tela de login e cadastro

   O que o usuário vê nesta tela:
     • Fundo animado com corações caindo e brilhos coloridos
     • Logo "Saúde em Foco" com o coração ❤️ pulsando e a linha de ECG
     • Duas abas: "Entrar" (usuário já cadastrado) e "Cadastrar" (novo usuário)
     • Formulário de login: e-mail e senha
     • Formulário de cadastro: nome, e-mail, senha, universidade, estado, cidade

   O admin tem login especial:
     E-mail: admin@saudeemfoco.com
     Senha:  admin2024
     (Definidos no objeto ADMIN abaixo — ao logar com esses dados,
      o app vai direto para o painel de administrador)
   ========================================================================= */

(function () {
  /*
    Importa as funções que este arquivo vai usar:
      el          → cria elementos HTML (do dom.js)
      ecgLineSVG  → o SVG da linha de ECG (do animations.js)
  */
  const { el, ecgLineSVG } = { el: DOM.el, ecgLineSVG: Anim.ecgLineSVG };

  /*
    ADMIN: dados do administrador fixos no código.
    Quando alguém digitar exatamente esse e-mail e senha, entra como admin.
    O admin não passa pelo cadastro — já está "pré-cadastrado" aqui.
  */
  const ADMIN = {
    email: "admin@saudeemfoco.com",
    senha: "admin2024",
    nome: "Administrador",
    univ: "Saúde em Foco",
    estado: "SP",
    cidade: "São Paulo",
  };

  /*
    FUNÇÃO: render (desenhar a tela de login)

    O que faz:
      Monta toda a tela de login e a coloca dentro de "root".
      Configura os formulários, as abas e os botões.

    Parâmetros:
      - root:    a caixa principal da página (div#app do index.html)
      - onLogin: função de app.js a ser chamada quando o login for bem-sucedido
                 (recebe os dados do usuário e decide para onde ir)
  */
  function render(root, { onLogin }) {
    /*
      "tab" controla qual formulário está visível:
        "login"    → formulário de entrar (padrão ao abrir a tela)
        "register" → formulário de cadastrar
    */
    let tab = "login";

    /*
      Cria a caixa principal da tela de login.
      A classe "login-wrap" define no CSS:
        - fundo gradiente escuro (azul-roxo)
        - tela inteira (min-height: 100vh)
        - conteúdo centralizado
    */
    const wrap = el("div", { class: "login-wrap" });

    /* ── ELEMENTOS DE FUNDO (decorativos, não interativos) ─────────────── */

    // Cria os 20 corações que caem no fundo (animations.js)
    wrap.appendChild(Anim.createFallingHearts(20));

    // Orbes de brilho: manchas de luz difusa nos cantos e no centro
    // "tr" = top-right (vermelho-coral), "bl" = bottom-left (verde), "center" = centro (sutil)
    wrap.appendChild(el("div", { class: "glow-orb tr", attrs: { "aria-hidden": "true" } }));
    wrap.appendChild(el("div", { class: "glow-orb bl", attrs: { "aria-hidden": "true" } }));
    wrap.appendChild(el("div", { class: "glow-orb center", attrs: { "aria-hidden": "true" } }));

    // Cruzes decorativas (símbolo de saúde/medicina) e ícones flutuantes (🩺 💊)
    // aria-hidden="true" → leitores de tela ignoram esses elementos decorativos
    wrap.insertAdjacentHTML("beforeend", `
      <!-- Cruz vermelha no canto superior esquerdo, com animação de flutuar -->
      <div class="deco-cross float-cross" style="top:3rem;left:1.5rem;opacity:.12;" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="#e05a45">
          <rect x="14" y="2" width="12" height="36" rx="3"/>
          <rect x="2" y="14" width="36" height="12" rx="3"/>
        </svg>
      </div>
      <!-- Cruz verde no canto inferior direito, com atraso na animação -->
      <div class="deco-cross float-cross" style="bottom:4rem;right:1.5rem;opacity:.08;animation-delay:2s;" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="#3dba7a">
          <rect x="14" y="2" width="12" height="36" rx="3"/>
          <rect x="2" y="14" width="36" height="12" rx="3"/>
        </svg>
      </div>
      <!-- Estetoscópio 🩺 flutuando do lado direito -->
      <div class="deco-icon" style="top:25%;right:2rem;opacity:.15;font-size:22px;animation:float-cross 5s ease-in-out 1s infinite;" aria-hidden="true">🩺</div>
      <!-- Comprimido 💊 flutuando do lado esquerdo -->
      <div class="deco-icon" style="bottom:25%;left:2rem;opacity:.12;font-size:18px;animation:float-cross 6s ease-in-out 3s infinite;" aria-hidden="true">💊</div>
    `);

    /* ── CARTÃO DE LOGIN (conteúdo principal) ──────────────────────────── */

    /*
      O cartão fica centralizado na tela e contém:
        1. O logo (coração + título + ECG)
        2. O card de vidro com o formulário
      "login-card-enter" adiciona uma animação de entrada (fade + slide)
    */
    const card = el("div", { class: "login-card login-card-enter", style: "animation-delay:.1s;" });

    /* ── LOGO ──────────────────────────────────────────────────────────── */
    card.insertAdjacentHTML("beforeend", `
      <div class="text-center" style="margin-bottom:1.5rem;">
        <div class="relative" style="display:inline-flex;flex-direction:column;align-items:center;">

          <!-- Badge do logo: caixa quadrada com borda avermelhada -->
          <!-- "glow-pulse" adiciona um brilho pulsante ao redor da caixa -->
          <div class="logo-badge glow-pulse">
            <!-- Coração pulsante — "heartbeat" anima como batimento cardíaco -->
            <span class="heartbeat" style="font-size:2.25rem;" role="img" aria-label="coração">❤️</span>
          </div>

          <!-- Título principal: "Saúde em" em bege e "Foco" em vermelho -->
          <h1 class="font-display logo-title">
            <span style="color:#f0ece4;">Saúde em </span><span style="color:#e05a45;">Foco</span>
          </h1>

          <!-- Subtítulo em letras pequenas maiúsculas -->
          <p class="logo-sub">Educação Médica</p>
        </div>

        <!-- Linha de ECG animada (gerada por Anim.ecgLineSVG()) -->
        <div style="margin-top:1rem;margin-bottom:.25rem;opacity:.8;">${ecgLineSVG()}</div>

        <!-- Nome do professor abaixo da linha de ECG -->
        <p class="logo-prof">Prof. Lucas Fernandes</p>
      </div>
    `);

    /* ── CARD DE VIDRO (formulário) ────────────────────────────────────── */

    /*
      "glass-card" = cartão com efeito de vidro fosco (glassmorphism):
        - fundo semi-transparente escuro
        - desfoque do fundo (backdrop-filter: blur)
        - borda sutil avermelhada
    */
    const glass = el("div", { class: "glass-card" });

    /* Linha de ícones de saúde animados que "flutuam" no topo do card */
    const iconRow = el("div", { class: "icon-row" });
    // Cada ícone tem velocidade e atraso de animação ligeiramente diferentes
    ["🫀", "🧬", "🩺", "💉", "🩻"].forEach((ic, i) => {
      const s = el("span", { text: ic });
      s.style.animation = `float-cross ${3.5 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`;
      iconRow.appendChild(s);
    });
    glass.appendChild(iconRow);

    /* ── ABAS: ENTRAR / CADASTRAR ──────────────────────────────────────── */

    /*
      Duas abas no topo do formulário para alternar entre:
        "Entrar"    → formulário de login (padrão, começa ativa)
        "Cadastrar" → formulário de cadastro
    */
    const tabSwitch = el("div", { class: "tab-switch" });
    const btnLogin = el("button", { class: "active", text: "Entrar", attrs: { type: "button" } });
    const btnReg = el("button", { text: "Cadastrar", attrs: { type: "button" } });
    tabSwitch.append(btnLogin, btnReg);
    glass.appendChild(tabSwitch);

    /* ── CAIXA DE ERRO ─────────────────────────────────────────────────── */

    /*
      Aparece em vermelho quando acontece um erro:
        • "E-mail ou senha incorretos."
        • "Preencha todos os campos."
        • "E-mail já cadastrado."
        etc.
      Começa oculta ("hidden") e aparece quando showError() é chamada.
    */
    const errorBox = el("div", { class: "alert-error hidden" });
    glass.appendChild(errorBox);

    /* Área onde o formulário (login ou cadastro) será inserido */
    const formArea = el("div");
    glass.appendChild(formArea);

    card.appendChild(glass);

    /* Rodapé abaixo do cartão */
    card.appendChild(el("p", { class: "login-footer", text: "🏥 Educação médica para estudantes da saúde" }));

    wrap.appendChild(card);
    root.appendChild(wrap);

    /* ── FUNÇÕES AUXILIARES ─────────────────────────────────────────────── */

    /*
      FUNÇÃO: showError (mostrar erro)

      O que faz:
        Exibe ou esconde a caixa de erro vermelha.
          showError("mensagem") → mostra a mensagem de erro
          showError("")         → esconde a caixa de erro
    */
    function showError(msg) {
      if (msg) {
        errorBox.textContent = msg;            // define o texto do erro
        errorBox.classList.remove("hidden");   // torna a caixa visível
      } else {
        errorBox.classList.add("hidden");      // esconde a caixa
      }
    }

    /* ── FORMULÁRIO DE LOGIN ────────────────────────────────────────────── */

    /*
      FUNÇÃO: loginForm (criar formulário de login)

      O que faz:
        Cria o formulário com os campos:
          • E-mail (campo de texto para e-mail)
          • Senha  (campo oculto — mostra pontos em vez de letras)
          • Botão "Entrar"

        Quando o usuário envia o formulário:
          1. Valida se os campos estão preenchidos
          2. Verifica se é o admin (e-mail e senha do objeto ADMIN)
          3. Se não for admin, busca o usuário na lista do localStorage
          4. Se encontrar, chama onLogin() com os dados do usuário
          5. Se não encontrar, mostra erro
    */
    function loginForm() {
      const f = el("form");
      f.innerHTML = `
        <!-- Campo de e-mail -->
        <div class="field">
          <label class="field-label" for="login-email">E-mail</label>
          <input id="login-email" class="field-input" type="email" placeholder="seu@email.com">
        </div>
        <!-- Campo de senha (type="password" oculta o texto digitado) -->
        <div class="field">
          <label class="field-label" for="login-senha">Senha</label>
          <input id="login-senha" class="field-input" type="password" placeholder="••••••">
        </div>
        <button type="submit" class="btn-primary">Entrar</button>`;

      /* Evento de envio do formulário (quando o usuário clica em "Entrar") */
      f.addEventListener("submit", (e) => {
        e.preventDefault(); // impede a página de recarregar (comportamento padrão de forms)
        showError("");       // limpa erros anteriores

        // Lê o que o usuário digitou (trim() remove espaços extras no início e fim)
        const email = f.querySelector("#login-email").value.trim();
        const senha = f.querySelector("#login-senha").value;

        // Valida se os campos estão preenchidos
        if (!email || !senha) return showError("Preencha todos os campos.");

        // Verifica se é o login do admin
        if (email === ADMIN.email && senha === ADMIN.senha) {
          return onLogin({ ...ADMIN, criadoEm: new Date().toISOString() });
        }

        // Busca o usuário na lista salva no navegador
        const user = Storage.getUsers().find((u) => u.email === email && u.senha === senha);

        // Se não encontrou, mostra erro
        if (!user) return showError("E-mail ou senha incorretos.");

        // Login bem-sucedido — chama onLogin com os dados do usuário
        onLogin(user);
      });

      return f;
    }

    /* ── FORMULÁRIO DE CADASTRO ─────────────────────────────────────────── */

    /*
      FUNÇÃO: registerForm (criar formulário de cadastro)

      O que faz:
        Cria o formulário com os campos:
          • Nome completo
          • E-mail
          • Senha (mínimo 6 caracteres)
          • Universidade
          • Estado (lista de UFs — siglas dos 27 estados brasileiros)
          • Cidade

        Quando o usuário envia:
          1. Valida se todos os campos estão preenchidos
          2. Valida se a senha tem pelo menos 6 caracteres
          3. Verifica se o e-mail já está cadastrado
          4. Se tudo ok, cria o novo usuário e faz login automaticamente
    */
    function registerForm() {
      const f = el("form");

      // Cria as opções do select de estado com as siglas de todos os estados brasileiros
      // AppData.ESTADOS contém: ["AC","AL","AP","AM","BA","CE","DF",...,"TO"]
      const ufOpts = ["<option value=''>UF</option>"]
        .concat(AppData.ESTADOS.map((uf) => `<option value="${uf}">${uf}</option>`))
        .join("");

      f.innerHTML = `
        <!-- Nome completo -->
        <div class="field"><label class="field-label" for="reg-nome">Nome completo</label>
          <input id="reg-nome" class="field-input" type="text" placeholder="Seu nome"></div>

        <!-- E-mail -->
        <div class="field"><label class="field-label" for="reg-email">E-mail</label>
          <input id="reg-email" class="field-input" type="email" placeholder="seu@email.com"></div>

        <!-- Senha -->
        <div class="field"><label class="field-label" for="reg-senha">Senha</label>
          <input id="reg-senha" class="field-input" type="password" placeholder="Mín. 6 caracteres"></div>

        <!-- Universidade -->
        <div class="field"><label class="field-label" for="reg-univ">Universidade</label>
          <input id="reg-univ" class="field-input" type="text" placeholder="Nome da faculdade"></div>

        <!-- Estado e Cidade lado a lado (grid de 2 colunas) -->
        <div class="field-grid2">
          <div><label class="field-label" for="reg-estado">Estado</label>
            <select id="reg-estado" class="field-input">${ufOpts}</select></div>
          <div><label class="field-label" for="reg-cidade">Cidade</label>
            <input id="reg-cidade" class="field-input" type="text" placeholder="Cidade"></div>
        </div>

        <button type="submit" class="btn-primary">Criar conta</button>`;

      /* Evento de envio do formulário de cadastro */
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        showError("");

        // Lê todos os campos
        const nome   = f.querySelector("#reg-nome").value.trim();
        const email  = f.querySelector("#reg-email").value.trim();
        const senha  = f.querySelector("#reg-senha").value;
        const univ   = f.querySelector("#reg-univ").value.trim();
        const estado = f.querySelector("#reg-estado").value;
        const cidade = f.querySelector("#reg-cidade").value.trim();

        // Valida se todos os campos foram preenchidos
        if (!nome || !email || !senha || !univ || !estado || !cidade)
          return showError("Preencha todos os campos.");

        // Valida o tamanho mínimo da senha
        if (senha.length < 6) return showError("Senha deve ter ao menos 6 caracteres.");

        // Busca a lista atual de usuários
        const users = Storage.getUsers();

        // Verifica se o e-mail já existe (não pode ter dois cadastros com o mesmo e-mail)
        if (users.find((u) => u.email === email)) return showError("E-mail já cadastrado.");

        // Cria o objeto do novo usuário com todos os dados + data de criação
        const novo = { email, senha, nome, univ, estado, cidade, criadoEm: new Date().toISOString() };

        // Adiciona o novo usuário à lista e salva
        users.push(novo);
        Storage.saveUsers(users);

        // Faz login automático com o usuário recém-cadastrado
        onLogin(novo);
      });

      return f;
    }

    /*
      FUNÇÃO: renderForm (renderizar formulário)

      O que faz:
        Troca o conteúdo da área do formulário:
          • Se "tab" for "login"    → mostra o formulário de login
          • Se "tab" for "register" → mostra o formulário de cadastro
    */
    function renderForm() {
      formArea.replaceChildren(tab === "login" ? loginForm() : registerForm());
    }

    /* Quando o usuário clica na aba "Entrar" */
    btnLogin.addEventListener("click", () => {
      tab = "login";
      showError(""); // limpa erros
      btnLogin.classList.add("active");    // destaca o botão "Entrar"
      btnReg.classList.remove("active");   // remove destaque do "Cadastrar"
      renderForm();  // troca para o formulário de login
    });

    /* Quando o usuário clica na aba "Cadastrar" */
    btnReg.addEventListener("click", () => {
      tab = "register";
      showError("");
      btnReg.classList.add("active");      // destaca o botão "Cadastrar"
      btnLogin.classList.remove("active"); // remove destaque do "Entrar"
      renderForm();  // troca para o formulário de cadastro
    });

    // Desenha o formulário de login ao abrir a tela (aba padrão)
    renderForm();
  }

  // Exporta a função render para ser chamada em app.js
  window.LoginScreen = { render };
})();
