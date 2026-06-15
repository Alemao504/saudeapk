/* =========================================================================
   app.js — Cérebro do app: decide qual tela mostrar e quando

   Este é o arquivo principal do app. Ele funciona como um gerente:
   sabe qual tela está sendo exibida no momento e decide quando trocar
   para outra. Também coordena o fluxo do sorteio:
     1. Usuário clica em Sortear
     2. App lança confete
     3. App exibe contagem regressiva (2, 1...)
     4. App abre o player de vídeo do tema sorteado
     5. Quando o vídeo termina, volta para a tela principal
   ========================================================================= */

(function () {
  /*
    "root" é a caixa principal do HTML onde todo o conteúdo do app é colocado.
    Ela está no index.html como: <div id="app"></div>
    Tudo que aparece na tela fica dentro dessa caixa.
  */
  const root = document.getElementById("app");

  /*
    E-mail especial do administrador.
    Quando alguém loga com esse e-mail, em vez de ver a tela principal,
    é levado direto para o painel de admin (sem ver o vídeo de introdução).
  */
  const ADMIN_EMAIL = "admin@saudeemfoco.com";

  /*
    VARIÁVEIS DE ESTADO: guardam informações sobre o que está acontecendo agora.

    currentUser    → dados do usuário logado (nome, e-mail, etc.)
                     Vale null se ninguém estiver logado.
    selectedTheme  → o tema de saúde que foi sorteado/escolhido
                     Vale null se nenhum tema foi selecionado ainda.
    removeOverlay  → função para fechar a sobreposição atual (contador, player, etc.)
                     Vale null se não há sobreposição aberta.
  */
  let currentUser = null;
  let selectedTheme = null;
  let removeOverlay = null;

  /*
    FUNÇÃO: clearOverlay (fechar sobreposição)

    O que faz:
      Fecha qualquer sobreposição que esteja aberta no momento
      (contagem regressiva, player de vídeo, painel de detalhes).
      Se não há sobreposição aberta, não faz nada.
  */
  function clearOverlay() {
    if (removeOverlay) { removeOverlay(); removeOverlay = null; }
  }

  /*
    FUNÇÃO: show (mostrar tela)

    O que faz:
      Troca a tela atual pela tela solicitada.
      Primeiro fecha qualquer sobreposição aberta, depois limpa
      o conteúdo atual e desenha a nova tela.

    Parâmetro:
      - screen: nome da tela a mostrar:
          "login" → tela de login e cadastro
          "home"  → tela principal com sorteio e jogos
          "admin" → painel do administrador

    Como cada tela recebe as informações que precisa:
      Login recebe: onLogin (função chamada quando o usuário faz login)
      Home recebe:  user (dados do usuário), onLogout, onThemeSelected, onShowDetails
      Admin recebe: onLogout (função chamada quando o admin clica em Sair)
  */
  function show(screen) {
    clearOverlay();    // fecha sobreposições abertas
    DOM.clear(root);   // limpa tudo que estava na tela

    if (screen === "login") {
      // Desenha a tela de login, passando a função handleLogin para ser chamada
      // quando o usuário terminar de logar
      LoginScreen.render(root, { onLogin: handleLogin });

    } else if (screen === "home") {
      // Desenha a tela principal, com todos os dados do usuário logado
      // e as funções para lidar com logout, sorteio e detalhes
      HomeScreen.render(root, {
        user: currentUser,
        onLogout: handleLogout,
        onThemeSelected: handleThemeSelected,
        onShowDetails: handleShowDetails,
      });

    } else if (screen === "admin") {
      // Desenha o painel de administrador
      AdminScreen.render(root, { onLogout: handleLogout });
    }
  }

  /*
    FUNÇÃO: handleLogin (processar login)

    O que faz:
      É chamada pela tela de login quando o usuário termina de entrar/cadastrar.
      Guarda os dados do usuário, salva a sessão e decide para onde ir:
        • Se for o admin → vai direto para o painel admin (sem vídeo)
        • Se for usuário normal → toca o vídeo de introdução primeiro,
          depois vai para a tela principal

    Parâmetro:
      - user: objeto com os dados do usuário (nome, email, etc.)
  */
  function handleLogin(user) {
    currentUser = user;          // guarda os dados do usuário logado
    Storage.saveSession(user);   // salva no navegador que esse usuário está logado

    if (user.email === ADMIN_EMAIL) {
      // Admin não vê o vídeo de introdução
      show("admin");
    } else {
      // Usuário normal: primeiro toca o vídeo de introdução
      clearOverlay();
      DOM.clear(root);
      IntroScreen.render(root, {
        // Quando o vídeo terminar, vai para a tela principal
        onFinish: function () { show("home"); }
      });
    }
  }

  /*
    FUNÇÃO: handleLogout (processar logout)

    O que faz:
      É chamada quando o usuário clica em "Sair".
      Apaga os dados do usuário logado, limpa o tema selecionado,
      remove a sessão do navegador e volta para a tela de login.
  */
  function handleLogout() {
    currentUser = null;       // esquece quem estava logado
    selectedTheme = null;     // esquece o tema selecionado
    Storage.saveSession(null);// apaga a sessão do navegador
    show("login");            // volta para a tela de login
  }

  /*
    FUNÇÃO: handleThemeSelected (processar tema sorteado)

    O que faz:
      É chamada quando o usuário sorteia ou escolhe um tema da lista.
      Executa o fluxo completo do sorteio:
        1. Lança confete colorido na tela (por 3 segundos)
        2. Registra o sorteio no histórico (quem sorteou e qual tema)
        3. Após 0,5s, abre a contagem regressiva (2, 1...)
        4. Quando a contagem termina, abre o player de vídeo
        5. Quando o player fecha, volta para a tela principal

    Parâmetro:
      - theme: o tema sorteado (objeto com nome, ícone, vídeo, etc.)
  */
  function handleThemeSelected(theme) {
    selectedTheme = theme;

    // Dispara o efeito de confete por 3 segundos
    Anim.fireConfetti(3000);

    // Registra o sorteio no histórico (salvo no navegador)
    if (currentUser) {
      Storage.addSorteio({
        num: theme.num,                    // número do tema (1 a 20)
        ts: new Date().toISOString(),      // data e hora do sorteio
        user: currentUser.email,           // e-mail de quem sorteou
      });
    }

    // Aguarda 0,5 segundos e então abre a contagem regressiva
    setTimeout(() => {
      // Abre a contagem (2, 1...) e quando ela terminar, abre o player
      removeOverlay = Overlays.countdown(theme, () => {
        // Abre o player de vídeo do tema
        removeOverlay = Overlays.player(theme, () => {
          // Quando o vídeo terminar ou o usuário fechar, volta para a home
          removeOverlay = null;
          show("home");
        });
      });
    }, 500);
  }

  /*
    FUNÇÃO: handleShowDetails (mostrar detalhes de um tema)

    O que faz:
      É chamada quando o usuário clica no botão "Detalhes →" ou em um tema
      da lista. Abre o painel deslizante com informações completas do tema:
      introdução, estatísticas, riscos, prevenção e roteiro do vídeo.

    Parâmetro:
      - theme: o tema cujos detalhes serão exibidos
  */
  function handleShowDetails(theme) {
    selectedTheme = theme;
    // Abre o painel de detalhes; quando fechado, limpa a referência
    removeOverlay = Overlays.details(theme, () => { removeOverlay = null; });
  }

  /*
    FUNÇÃO: init (inicializar o app)

    O que faz:
      Ponto de partida do app. Chamada uma única vez quando a página carrega.
      Garante que o app sempre começa na tela de login —
      mesmo que o usuário tenha ficado logado antes, precisa logar de novo.

      Atenção: os dados CADASTRADOS (usuários, sorteios, etc.) continuam
      salvos no navegador. Apenas a sessão ativa é apagada.
  */
  function init() {
    Storage.saveSession(null); // garante que ninguém começa logado
    show("login");             // exibe a tela de login
  }

  // Inicia o app imediatamente quando esta função é carregada
  init();
})();
