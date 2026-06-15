/* =========================================================================
   app.js — Roteador central
   Controla qual tela é exibida e coordena os overlays (sorteio -> player).
   ========================================================================= */

(function () {
  const root = document.getElementById("app");
  const ADMIN_EMAIL = "admin@saudeemfoco.com";

  let currentUser = null;
  let selectedTheme = null;
  let removeOverlay = null; // função para fechar overlay ativo

  function clearOverlay() {
    if (removeOverlay) { removeOverlay(); removeOverlay = null; }
  }

  function show(screen) {
    clearOverlay();
    DOM.clear(root);
    if (screen === "login") {
      LoginScreen.render(root, { onLogin: handleLogin });
    } else if (screen === "home") {
      HomeScreen.render(root, {
        user: currentUser,
        onLogout: handleLogout,
        onThemeSelected: handleThemeSelected,
        onShowDetails: handleShowDetails,
      });
    } else if (screen === "admin") {
      AdminScreen.render(root, { onLogout: handleLogout });
    }
  }

  function handleLogin(user) {
    currentUser = user;
    Storage.saveSession(user);
    if (user.email === ADMIN_EMAIL) {
      show("admin"); // admin entra direto, sem vídeo
    } else {
      clearOverlay();
      DOM.clear(root);
      IntroScreen.render(root, { onFinish: function () { show("home"); } });
    }
  }

  function handleLogout() {
    currentUser = null;
    selectedTheme = null;
    Storage.saveSession(null);
    show("login");
  }

  // Sorteio escolhido -> confete -> contagem -> player
  function handleThemeSelected(theme) {
    selectedTheme = theme;
    Anim.fireConfetti(3000);
    if (currentUser) {
      Storage.addSorteio({ num: theme.num, ts: new Date().toISOString(), user: currentUser.email });
    }
    setTimeout(() => {
      removeOverlay = Overlays.countdown(theme, () => {
        removeOverlay = Overlays.player(theme, () => {
          removeOverlay = null;
          show("home");
        });
      });
    }, 500);
  }

  function handleShowDetails(theme) {
    selectedTheme = theme;
    removeOverlay = Overlays.details(theme, () => { removeOverlay = null; });
  }

  // Sempre inicia no login: os dados (usuários cadastrados) continuam
  // salvos, mas é preciso clicar em "fazer login" toda vez que abrir/voltar.
  function init() {
    Storage.saveSession(null);
    show("login");
  }

  init();
})();
