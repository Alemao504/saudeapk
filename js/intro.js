/* =========================================================================
   intro.js — Vídeo de introdução pós-login
   Toca em tela cheia toda vez que o usuário faz login. Sem botão pular:
   o app só é liberado quando o vídeo termina (ou se a mídia falhar).
   Use dois formatos (mp4 + webm) para máxima compatibilidade de navegador.
   Para trocar o vídeo, substitua os arquivos em video/intro.*.
   ========================================================================= */

window.IntroScreen = (function () {
  function render(root, { onFinish }) {
    DOM.clear(root);

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      onFinish();
    }

    const video = DOM.el("video", {
      class: "intro-video",
      attrs: { autoplay: "", playsinline: "", preload: "auto", src: "video/intro.mp4" },
      on: { ended: finish, error: finish },
    });
    video.controls = false;

    const wrap = DOM.el("div", { class: "intro-screen" }, [video]);
    root.appendChild(wrap);

    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        video.muted = true;
        video.play().catch(finish);
      });
    }
  }

  return { render };
})();
