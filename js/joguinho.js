/* =========================================================================
   joguinho.js — Jogo de cartões "Verdade ou Mito" (flip cards)

   O que o usuário faz:
     Vê uma afirmação sobre saúde e decide se é VERDADE 👍 ou MITO 👎.
     Após clicar, o cartão vira (animação de flip) e mostra a resposta com explicação.
     2 segundos depois, avança automaticamente para o próximo cartão.

   Diferencial em relação ao Quiz:
     • Só usa perguntas do tipo Verdadeiro/Falso (tipo "tf")
     • Tem sistema de sequência (streak) 🔥 — bônus motivacional por acertos consecutivos
     • Confete a cada acerto
     • Avança automaticamente (sem precisar clicar em "Próxima")
     • O cartão tem animação de virar (flip card)
   ========================================================================= */

(function () {
  const { el, shuffle } = DOM;

  /*
    FUNÇÃO: render (iniciar o joguinho)

    Parâmetros:
      - container: onde o jogo será desenhado
      - userEmail: e-mail do usuário para salvar o resultado
      - onBack:    função para voltar à aba Início
  */
  function render(container, { userEmail, onBack }) {
    /*
      Filtra apenas as perguntas do tipo "tf" (verdadeiro ou falso),
      embaralha e pega as 10 primeiras.
    */
    const questions = shuffle(AppData.QUESTIONS.filter((q) => q.type === "tf")).slice(0, 10);

    /*
      VARIÁVEIS DE ESTADO do joguinho:

        current:     índice do cartão atual (0 a 9)
        cardState:   estado do cartão atual:
                       "idle"    → aguardando resposta do usuário
                       "correct" → usuário acertou (cartão verde)
                       "wrong"   → usuário errou (cartão vermelho)
        score:       quantos acertos o usuário tem no total
        streak:      quantos acertos consecutivos (zera ao errar)
        maxStreak:   maior sequência de acertos (salvo para o resultado)
        details:     histórico de cada cartão (acertou ou errou)
        advanceTimer: referência ao timer que avança automaticamente após 2s
    */
    let current = 0;
    let cardState = "idle";
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    const details = [];
    let advanceTimer = null;

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: draw (desenhar o cartão atual)

       O que monta na tela:
         1. Cabeçalho: "X/10 cards" + streak 🔥 + placar
         2. Flip card (frente com a pergunta, verso oculto com a resposta)
         3. Botões: 👍 VERDADE e 👎 MITO
         4. Bolinhas de progresso coloridas (verde=acerto, vermelho=erro, branco=atual)
    */
    function draw() {
      const q = questions[current]; // cartão atual
      DOM.clear(container);

      const pad = el("div", { class: "game-pad" });

      /* ── CABEÇALHO ──────────────────────────────────────────────────── */
      const head = el("div", { class: "jog-head" });
      head.innerHTML = `
        <!-- Contador de cartões à esquerda: "3/10 cards" -->
        <div class="flex" style="align-items:center;gap:.5rem;">
          <span class="jog-counter">${current + 1}/${questions.length} cards</span>
        </div>

        <!-- Streak e placar à direita -->
        <div class="jog-right">
          <!-- Espaço reservado para o indicador de sequência (preenchido abaixo se streak > 0) -->
          <span class="jog-streak-slot"></span>
          <!-- Placar de acertos -->
          <span class="jog-score">${score} ✓</span>
        </div>`;

      // Mostra o indicador de sequência se o usuário estiver em sequência
      const streakSlot = head.querySelector(".jog-streak-slot");
      if (streak > 0) streakSlot.innerHTML = `<span class="jog-streak">🔥 ×${streak}</span>`;
      pad.appendChild(head);

      /* ── FLIP CARD (cartão virável) ─────────────────────────────────── */
      /*
        Estrutura do flip card:
          .flip-wrap   → caixa externa com perspectiva 3D
            .flip-inner → caixa que gira 180° (frente e verso são absolutos dentro dela)
              .flip-front → FRENTE: pergunta visível inicialmente
              .flip-back  → VERSO: resposta oculta inicialmente (girada 180°)

        Quando o usuário responde, a classe "flipped" é adicionada ao .flip-inner,
        que gira 180° revelando o verso com a resposta.
      */
      const flipWrap = el("div", { class: "flip-wrap" });
      const inner = el("div", { class: "flip-inner" });

      /* Frente do cartão: mostra a afirmação */
      const front = el("div", { class: "flip-face flip-front" });
      front.innerHTML = `
        <span class="flip-pill">Verdadeiro ou Falso?</span>
        <p class="flip-q">${q.question}</p>`;

      /*
        Verso do cartão: começa vazio.
        É preenchido com a resposta em handleAnswer() após o usuário clicar.
      */
      const back = el("div", { class: "flip-face flip-back" });

      inner.append(front, back);
      flipWrap.appendChild(inner);
      pad.appendChild(flipWrap);

      /* ── BOTÕES DE RESPOSTA ─────────────────────────────────────────── */
      const btns = el("div", { class: "answer-btns" });
      const btnTrue  = el("button", { class: "ans-btn ans-true",  html: "👍 VERDADE", attrs: { type: "button" } });
      const btnFalse = el("button", { class: "ans-btn ans-false", html: "👎 MITO",    attrs: { type: "button" } });

      // Cada botão passa true/false para a função de resposta
      btnTrue.addEventListener("click",  () => answer(true));
      btnFalse.addEventListener("click", () => answer(false));

      btns.append(btnTrue, btnFalse);
      pad.appendChild(btns);

      /* ── BOLINHAS DE PROGRESSO ─────────────────────────────────────── */
      /*
        Uma bolinha para cada cartão:
          Cinza escuro  = ainda não chegou neste cartão
          Branco        = cartão atual
          Verde         = acerto
          Vermelho      = erro
      */
      const dots = el("div", { class: "dots" });
      questions.forEach((_, i) => {
        let bg = "#2e3248"; // cor padrão: cinza escuro (ainda não chegou)
        if (i < current) {
          // Cartões anteriores: verde se acertou, vermelho se errou
          bg = details[i]?.correct ? "#3dba7a" : "#e05a45";
        } else if (i === current) {
          bg = "#f0ece4"; // cartão atual: branco/bege
        }
        dots.appendChild(el("div", { class: "dot", style: `background:${bg};` }));
      });
      pad.appendChild(dots);

      container.appendChild(pad);

      /* ── LÓGICA DE RESPOSTA ─────────────────────────────────────────── */

      /*
        FUNÇÃO: answer (processar resposta)

        O que faz quando o usuário clica em VERDADE ou MITO:
          1. Bloqueia novas respostas (cardState muda de "idle")
          2. Determina se acertou
          3. Gira o cartão (adiciona classe "flipped")
          4. Coloriza frente e verso (verde ou vermelho)
          5. Preenche o verso com a resposta e explicação
          6. Desabilita os botões
          7. Se acertou: incrementa score/streak, lança confete
             Se errou: zera streak
          8. Aguarda 2 segundos e avança para o próximo cartão

        Parâmetro:
          - userSaysTrue: true se clicou em VERDADE, false se clicou em MITO
      */
      function answer(userSaysTrue) {
        if (cardState !== "idle") return; // ignora se já respondeu

        /*
          Verifica se a resposta está correta.
          q.correct = 0 significa que "Verdadeiro" é a opção correta (índice 0).
          q.correct = 1 significa que "Falso" é a opção correta (índice 1).
        */
        const correctIsTrue = q.correct === 0; // true se a resposta certa for "Verdadeiro"
        const correct = userSaysTrue === correctIsTrue;

        cardState = correct ? "correct" : "wrong";
        details.push({ questionId: q.id, correct });

        /* Gira o cartão adicionando a classe "flipped" */
        inner.classList.add("flipped");

        /* Coloriza frente e verso (verde para acerto, vermelho para erro) */
        front.classList.add(cardState);
        back.classList.add(cardState);

        /* Se errou, adiciona um efeito de tremor (shake) no cartão */
        if (!correct) inner.classList.add("animate-shake");

        /* Preenche o verso com o resultado */
        back.innerHTML = `
          <!-- Ícone grande: ✓ verde ou ✗ vermelho -->
          <div class="flip-mark">${correct ? "✓" : "✗"}</div>

          <!-- Resposta correta em destaque -->
          <p class="flip-answer ${cardState}">${q.options[q.correct]}</p>

          <!-- Explicação do por quê -->
          <p class="flip-explain">${q.explanation}</p>`;

        /* Desabilita os botões para não deixar clicar de novo */
        btnTrue.disabled = true;
        btnFalse.disabled = true;

        /* Atualiza placar e streak */
        if (correct) {
          score++;
          streak++;
          if (streak > maxStreak) maxStreak = streak; // atualiza recorde

          /* Lança confete ao acertar */
          Anim.fireConfetti(2000);

          /* Se a sequência for 5 ou mais, mostra mensagem especial */
          if (streak >= 5) {
            streakSlot.innerHTML = `<span class="jog-streak-big animate-slide-in-right">🔥 ${streak} em sequência!</span>`;
          }

          // Atualiza o placar no cabeçalho
          head.querySelector(".jog-score").textContent = `${score} ✓`;
        } else {
          streak = 0; // zera a sequência ao errar
        }

        /*
          Aguarda 2 segundos para o usuário ler a resposta,
          depois avança automaticamente para o próximo cartão.
          Se era o último, vai para o resultado.
        */
        advanceTimer = setTimeout(() => {
          if (current + 1 >= questions.length) return drawResult();
          current++;
          cardState = "idle"; // reseta para o próximo cartão
          draw();
        }, 2000); // 2000ms = 2 segundos
      }
    }

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: drawResult (exibir resultado final)

       O que monta na tela:
         • Emoji (🔥 🎯 💪 conforme desempenho)
         • "Joguinho Concluído!"
         • Mensagem de incentivo
         • Grade com acertos e maior sequência
         • Botões: "Jogar Novamente" e "Voltar"
    */
    function drawResult() {
      const total = questions.length;
      const pct = Math.round((score / total) * 100);

      /* Salva o resultado no histórico */
      Storage.saveQuizResult({
        id: `joguinho-${Date.now()}`,
        type: "joguinho",
        score,
        total,
        date: new Date().toISOString(),
        user: userEmail,
        details,
      });

      /* Emoji e mensagem conforme percentual de acerto */
      const emoji = pct >= 80 ? "🔥" : pct >= 60 ? "🎯" : "💪";
      const msg   = pct >= 80 ? "Você arrasou!" : pct >= 60 ? "Muito bom!" : "Continue praticando!";

      DOM.clear(container);
      const wrap = el("div", { class: "result-wrap animate-slide-in-right" });
      wrap.innerHTML = `
        <div class="result-card">
          <div class="result-emoji">${emoji}</div>
          <h2 class="result-title">Joguinho Concluído!</h2>
          <p class="result-msg">${msg}</p>

          <!-- Grade com dois números: acertos e maior sequência -->
          <div class="result-grid2">
            <!-- Acertos em vermelho -->
            <div class="result-mini">
              <p class="result-mini-v" style="color:#e05a45;">${score}/${total}</p>
              <p class="result-mini-l">Acertos</p>
            </div>
            <!-- Maior sequência em verde com fogo -->
            <div class="result-mini">
              <p class="result-mini-v" style="color:#3dba7a;">${maxStreak}🔥</p>
              <p class="result-mini-l">Sequência máx.</p>
            </div>
          </div>

          <div class="result-btns">
            <button type="button" class="btn-half-primary" data-act="repeat">Jogar Novamente</button>
            <button type="button" class="btn-half-sec" data-act="back">Voltar</button>
          </div>
        </div>`;

      wrap.querySelector('[data-act="repeat"]').addEventListener("click", () =>
        render(container, { userEmail, onBack })); // reinicia o jogo
      wrap.querySelector('[data-act="back"]').addEventListener("click", onBack);

      container.appendChild(wrap);
    }

    // Começa exibindo o primeiro cartão
    draw();
  }

  // Exporta para ser usado em home.js
  window.JoguinhoScreen = { render };
})();
