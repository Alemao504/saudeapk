/* =========================================================================
   intro.js — Vídeo de introdução que toca logo após o login

   O que este arquivo faz:
     Exibe um vídeo em tela cheia assim que o usuário faz login.
     O app fica "bloqueado" neste vídeo até ele terminar — não há botão
     de pular. Só depois o usuário chega à tela principal.

   Onde fica o arquivo de vídeo:
     video/intro.mp4  (pasta "video" dentro do projeto)
     Para trocar o vídeo de introdução, basta substituir esse arquivo.

   O que acontece se o vídeo não carregar:
     O app detecta o erro e vai direto para a tela principal,
     sem travar o usuário na tela preta.
   ========================================================================= */

window.IntroScreen = (function () {

  /*
    FUNÇÃO: render (desenhar/exibir)

    O que faz:
      Limpa a tela atual e coloca o vídeo de introdução em tela cheia.
      Quando o vídeo terminar (ou der erro), chama onFinish()
      para liberar o acesso à tela principal.

    Parâmetros que recebe:
      - root:     a caixa principal da página onde o vídeo será inserido
      - onFinish: função a ser chamada quando o vídeo terminar
                  (definida em app.js como: ir para a tela home)
  */
  function render(root, { onFinish }) {
    DOM.clear(root); // limpa qualquer conteúdo anterior da tela

    /*
      "done" controla se o vídeo já terminou.
      Serve para evitar que onFinish() seja chamada duas vezes
      (uma vez pelo evento 'ended' e outra pelo evento 'error').
    */
    let done = false;

    /*
      FUNÇÃO: finish (finalizar)
      Chama onFinish() apenas uma vez, mesmo se mais de um evento disparar.
    */
    function finish() {
      if (done) return; // se já finalizou antes, ignora
      done = true;
      onFinish(); // libera o acesso à tela principal
    }

    /*
      Cria o elemento de vídeo HTML com as configurações necessárias.

      Atributos do vídeo:
        autoplay    → inicia automaticamente sem o usuário clicar em play
        playsinline → evita que o vídeo abra em tela cheia no iPhone (comportamento nativo)
        preload     → carrega o vídeo antes de precisar reproduzir ("auto" = carrega logo)
        src         → caminho do arquivo de vídeo

      Eventos:
        ended → quando o vídeo terminar de tocar, chama finish()
        error → se o vídeo não carregar (arquivo faltando, formato não suportado), chama finish()
    */
    const video = DOM.el("video", {
      class: "intro-video",
      attrs: { autoplay: "", playsinline: "", preload: "auto", src: "video/intro.mp4" },
      on: { ended: finish, error: finish },
    });

    // Remove os controles (botão de play/pause, barra de progresso, etc.)
    // O usuário não pode pausar nem avançar — o vídeo toca completo
    video.controls = false;

    /*
      Cria a caixa preta que cobre toda a tela e coloca o vídeo dentro dela.
      "intro-screen" é uma classe CSS que define:
        - fundo preto
        - ocupa toda a tela (posição fixa, inset:0)
        - fica acima de tudo (z-index altíssimo)
    */
    const wrap = DOM.el("div", { class: "intro-screen" }, [video]);
    root.appendChild(wrap); // adiciona a tela de introdução na página

    /*
      Tenta iniciar a reprodução do vídeo.

      Por que o try com .catch?
        Navegadores modernos bloqueiam áudio automático sem interação do usuário.
        Se a reprodução com som for bloqueada, o .catch silencia o vídeo (muted)
        e tenta tocar sem som. Se ainda assim falhar, chama finish() direto.
    */
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        video.muted = true;         // silencia o vídeo
        video.play().catch(finish); // tenta tocar sem som; se falhar, finaliza
      });
    }
  }

  // Exporta a função render para ser usada em app.js
  return { render };
})();
