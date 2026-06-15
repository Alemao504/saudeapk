/* =========================================================================
   intro.js — Vídeo de introdução pós-login
   Toca em tela cheia toda vez que o usuário faz login. Sem botão pular:
   o app só é liberado quando o vídeo termina (ou se a mídia falhar).
   Use dois formatos (mp4 + webm) para máxima compatibilidade de navegador.
   Para trocar o vídeo, substitua os arquivos em video/intro.*.
   ========================================================================= */

window.IntroScreen = (function () {
  const SOURCES = [
    { src: "video/intro.mp4", type: "video/mp4" },
    { src: "video/intro.webm", type: "video/webm" },
  ];

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
      attrs: { autoplay: "", playsinline: "", preload: "auto" },
      on: { ended: finish },
    });
    video.controls = false; // sem controles: não dá para pular

    SOURCES.forEach(function (s) {
      video.appendChild(DOM.el("source", { attrs: { src: s.src, type: s.type } }));
    });

    // Só libera por erro se NENHUM source puder ser tocado
    video.addEventListener("error", finish);

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
