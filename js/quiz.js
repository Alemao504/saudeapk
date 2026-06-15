/* =========================================================================
   quiz.js — Quiz de perguntas de múltipla escolha e verdadeiro/falso

   O que o usuário faz:
     Responde 10 perguntas aleatórias sobre os temas de saúde.
     Cada pergunta é de múltipla escolha (A/B/C/D) ou verdadeiro/falso.
     Ao responder, aparece imediatamente a correção com explicação.
     No final, aparece a pontuação com emoji e mensagem de incentivo.

   Detalhes:
     • As 10 perguntas são sorteadas aleatoriamente das 60 disponíveis
     • Após responder, não é possível mudar a resposta
     • O botão "Próxima →" só aparece depois de responder
     • O resultado é salvo no histórico do navegador
   ========================================================================= */

(function () {
  const { el, shuffle } = DOM; // importa funções do dom.js

  /*
    FUNÇÃO: render (iniciar o quiz)

    O que faz:
      Seleciona 10 perguntas aleatórias e exibe a primeira.
      Controla o fluxo de pergunta em pergunta até o resultado final.

    Parâmetros:
      - container: onde o quiz será desenhado (dentro da aba Quiz da home)
      - userEmail: e-mail do usuário para salvar o resultado
      - onBack:    função para voltar à aba Início quando o usuário clicar "Voltar"
  */
  function render(container, { userEmail, onBack }) {
    /*
      Embaralha todas as 60 perguntas e pega as 10 primeiras.
      "shuffle" garante que cada vez é uma sequência diferente.
    */
    const questions = shuffle(AppData.QUESTIONS).slice(0, 10);

    /*
      VARIÁVEIS DE ESTADO do quiz:

        current:  índice da pergunta atual (0 = primeira, 9 = última)
        selected: opção que o usuário escolheu (null = ainda não respondeu)
        details:  lista de resultados de cada pergunta
                  [{ questionId: 1, correct: true }, { questionId: 5, correct: false }, ...]
    */
    let current = 0;
    let selected = null;
    const details = [];

    /*
      FUNÇÃO: acertos (contar acertos)
      Conta quantas perguntas o usuário acertou até agora.
      "filter" retorna apenas os itens onde correct é true.
    */
    function acertos() { return details.filter((d) => d.correct).length; }

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: drawQuestion (desenhar pergunta)

       O que monta na tela:
         1. Barra de progresso (ex: "Questão 3 de 10" + "2 ✓")
         2. Card com o tipo da pergunta e o enunciado
         3. Opções de resposta (botões A/B/C/D ou Verdadeiro/Falso)
         4. Área reservada para a explicação (aparece após responder)
         5. Botão "Próxima →" ou "Ver Resultado" (começa desabilitado)
    */
    function drawQuestion() {
      const q = questions[current]; // pergunta atual
      // Percentual de progresso para a barra (ex: questão 3/10 = 30%)
      const progress = ((current + 1) / questions.length) * 100;

      DOM.clear(container); // apaga o conteúdo anterior

      const pad = el("div", { class: "game-pad" });

      /* ── BARRA DE PROGRESSO ─────────────────────────────────────────── */
      pad.insertAdjacentHTML("beforeend", `
        <div style="margin-bottom:1rem;">
          <!-- Cabeçalho da barra: "Questão X de Y" e contador de acertos -->
          <div class="progress-head">
            <span class="progress-label">Questão ${current + 1} de ${questions.length}</span>
            <span class="progress-count">${acertos()} ✓</span>
          </div>
          <!-- Barra cinza com preenchimento vermelho proporcional ao progresso -->
          <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%;"></div>
          </div>
        </div>`);

      /* ── CARD DA PERGUNTA ───────────────────────────────────────────── */
      /*
        "animate-slide-in-right" faz o card deslizar da direita ao aparecer.
        Isso dá uma sensação de avanço/progresso ao trocar de pergunta.
      */
      const qCard = el("div", { class: "q-card animate-slide-in-right" });
      qCard.innerHTML = `
        <!-- Pílula indicando o tipo: "Verdadeiro ou Falso" ou "Múltipla Escolha" -->
        <span class="q-type-pill">${q.type === "tf" ? "Verdadeiro ou Falso" : "Múltipla Escolha"}</span>
        <!-- Enunciado da pergunta -->
        <p class="q-text">${q.question}</p>`;
      pad.appendChild(qCard);

      /* ── OPÇÕES DE RESPOSTA ─────────────────────────────────────────── */
      /*
        Para cada opção, cria um botão.
        Múltipla escolha: botões com letra (A, B, C, D)
        Verdadeiro/Falso: botões com apenas o texto ("Verdadeiro", "Falso")
      */
      const opts = el("div", { class: "options" });
      q.options.forEach((opt, idx) => {
        const btn = el("button", { class: "opt", attrs: { type: "button" } });

        // Para múltipla escolha, adiciona a letra (A=65, B=66, C=67, D=68 em ASCII)
        const label = q.type === "mc" ? String.fromCharCode(65 + idx) : null;
        if (label) btn.appendChild(el("span", { class: "opt-letter", text: label }));

        btn.appendChild(el("span", { class: "opt-text", text: opt }));
        btn.addEventListener("click", () => handleSelect(idx));
        opts.appendChild(btn);
      });
      pad.appendChild(opts);

      /* Espaço reservado para a explicação (preenchido após responder) */
      const explainSlot = el("div");
      pad.appendChild(explainSlot);

      /* ── BOTÃO PRÓXIMA ──────────────────────────────────────────────── */
      /*
        Na última pergunta, o texto muda para "Ver Resultado".
        O botão começa desabilitado (disabled + classe "disabled").
        Só é ativado quando o usuário responde (em handleSelect).
      */
      const next = el("button", {
        class: "btn-next disabled",
        text: current + 1 >= questions.length ? "Ver Resultado" : "Próxima →",
        attrs: { type: "button" },
      });
      next.disabled = true;
      next.addEventListener("click", handleNext);
      pad.appendChild(next);

      container.appendChild(pad);

      /* ── LÓGICA DE SELEÇÃO DE RESPOSTA ─────────────────────────────── */

      /*
        FUNÇÃO: handleSelect (processar resposta selecionada)

        O que faz quando o usuário clica em uma opção:
          1. Bloqueia novos cliques (cada pergunta só pode ser respondida uma vez)
          2. Verifica se a resposta está correta
          3. Registra o resultado em "details"
          4. Coloriza as opções: verde (correta) e vermelho (errada, se escolhida)
          5. Exibe a explicação da resposta
          6. Habilita o botão "Próxima →"
          7. Atualiza o contador de acertos na barra

        Parâmetro:
          - idx: índice da opção clicada (0=primeira, 1=segunda, etc.)
      */
      function handleSelect(idx) {
        if (selected !== null) return; // ignora se já respondeu
        selected = idx;

        // Verifica se acertou (o índice clicado é o mesmo que o índice correto)
        const correct = idx === q.correct;
        details.push({ questionId: q.id, correct });

        /* Coloriza todas as opções após responder */
        [...opts.children].forEach((btn, i) => {
          btn.disabled = true; // bloqueia todos os botões
          const letter = btn.querySelector(".opt-letter");

          if (i === q.correct) {
            // A opção correta fica verde com ✓
            btn.classList.add("correct");
            if (letter) letter.classList.add("correct");
            btn.appendChild(el("span", { class: "opt-mark", text: "✓" }));
          } else if (i === idx && !correct) {
            // A opção errada escolhida fica vermelha com ✗
            btn.classList.add("wrong");
            if (letter) letter.classList.add("wrong");
            btn.appendChild(el("span", { class: "opt-mark", text: "✗" }));
          }
        });

        /* Exibe a caixa de explicação com a cor correta (verde ou vermelha) */
        const ex = el("div", { class: `explain ${correct ? "correct" : "wrong"} animate-slide-in-right` });
        ex.innerHTML = `
          <!-- "✓ Correto!" em verde ou "✗ Incorreto" em vermelho -->
          <p class="explain-head">${correct ? "✓ Correto!" : "✗ Incorreto"}</p>
          <!-- Texto explicando por que a resposta correta é correta -->
          <p class="explain-text">${q.explanation}</p>`;
        explainSlot.appendChild(ex);

        /* Ativa o botão "Próxima →" para o usuário poder avançar */
        next.disabled = false;
        next.classList.remove("disabled");
        next.classList.add("enabled");

        /* Atualiza o contador de acertos no cabeçalho da barra de progresso */
        pad.querySelector(".progress-count").textContent = `${acertos()} ✓`;
      }
    }

    /*
      FUNÇÃO: handleNext (avançar para a próxima pergunta)

      O que faz:
        • Se ainda há perguntas: avança para a próxima (current++) e redesenha
        • Se era a última pergunta: exibe o resultado final
    */
    function handleNext() {
      if (current + 1 >= questions.length) return drawResult();
      current++;        // avança para a próxima pergunta
      selected = null;  // reseta para que possa responder novamente
      drawQuestion();   // redesenha com a nova pergunta
    }

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: drawResult (exibir resultado final)

       O que monta na tela:
         • Emoji comemorativo (🏆 🎯 📚 💪 dependendo do desempenho)
         • "Quiz Concluído!"
         • Mensagem personalizada de incentivo
         • Placar: "X/10" e "Y% de acerto"
         • Botões: "Repetir Quiz" e "Voltar"
    */
    function drawResult() {
      const score = acertos();
      const total = questions.length;
      const pct = Math.round((score / total) * 100); // arredonda para número inteiro

      /* Salva o resultado no histórico do navegador */
      Storage.saveQuizResult({
        id: `quiz-${Date.now()}`, // ID único baseado no horário
        type: "quiz",
        score,
        total,
        date: new Date().toISOString(),
        user: userEmail,
        details, // lista com o resultado de cada pergunta
      });

      /* Define emoji e mensagem conforme o desempenho */
      let msg, emoji;
      if (pct >= 90) { msg = "Excelente! Você domina o tema!";       emoji = "🏆"; }
      else if (pct >= 70) { msg = "Muito bem! Continue estudando!";   emoji = "🎯"; }
      else if (pct >= 50) { msg = "Bom esforço! Revise os conteúdos."; emoji = "📚"; }
      else                { msg = "Continue praticando, você consegue!"; emoji = "💪"; }

      DOM.clear(container);

      const wrap = el("div", { class: "result-wrap animate-slide-in-right" });
      wrap.innerHTML = `
        <div class="result-card">
          <!-- Emoji de desempenho -->
          <div class="result-emoji">${emoji}</div>

          <h2 class="result-title">Quiz Concluído!</h2>
          <p class="result-msg">${msg}</p>

          <!-- Caixa com placar: "7/10" e "70% de acerto" -->
          <div class="result-score-box">
            <p class="result-score">${score}/${total}</p>
            <p class="result-pct">${pct}% de acerto</p>
          </div>

          <!-- Botões de ação -->
          <div class="result-btns">
            <!-- Reinicia o quiz com novas 10 perguntas aleatórias -->
            <button type="button" class="btn-half-primary" data-act="repeat">Repetir Quiz</button>
            <!-- Volta para a aba Início -->
            <button type="button" class="btn-half-sec" data-act="back">Voltar</button>
          </div>
        </div>`;

      // Configura as ações dos botões
      wrap.querySelector('[data-act="repeat"]').addEventListener("click", () =>
        render(container, { userEmail, onBack })); // reinicia o quiz
      wrap.querySelector('[data-act="back"]').addEventListener("click", onBack); // volta ao início

      container.appendChild(wrap);
    }

    // Começa exibindo a primeira pergunta
    drawQuestion();
  }

  // Exporta a função render para ser usada em home.js
  window.QuizScreen = { render };
})();
