/* =========================================================================
   simulado.js — Simulado: prova completa com 1 questão por tema de saúde

   O que é diferente do Quiz:
     • Tem até 20 questões (1 de múltipla escolha por tema)
     • O usuário pode navegar livremente entre as questões (← → )
     • Pode responder, mudar a resposta e deixar em branco
     • Só pode finalizar quando responder TODAS as questões
     • No resultado recebe um conceito de A a F
     • Pode copiar o resultado para colar em outro lugar
     • Mostra revisão das questões que errou com a resposta correta

   Conceitos:
     A → 90% ou mais de acerto
     B → 75% a 89%
     C → 60% a 74%
     D → 50% a 59%
     F → abaixo de 50%
   ========================================================================= */

(function () {
  const { el } = DOM;

  /*
    FUNÇÃO: buildSimulado (montar o simulado)

    O que faz:
      Cria a lista de questões do simulado: 1 questão de múltipla escolha por tema.
      Para cada um dos 20 temas, filtra as questões disponíveis de tipo "mc"
      e sorteia uma aleatoriamente.

    Resultado:
      Uma lista com 1 questão de cada tema = até 20 questões no total.
      (Se um tema não tiver questão "mc", simplesmente não entra na lista.)
  */
  function buildSimulado() {
    const result = [];
    for (let theme = 1; theme <= 20; theme++) {
      // Filtra questões do tema atual que são de múltipla escolha
      const cands = AppData.QUESTIONS.filter((q) => q.themeNum === theme && q.type === "mc");
      // Se encontrou alguma, escolhe uma aleatoriamente
      if (cands.length) result.push(cands[Math.floor(Math.random() * cands.length)]);
    }
    return result;
  }

  /*
    FUNÇÃO: getConceito (obter conceito/nota)

    O que faz:
      Converte o percentual de acerto em um conceito de A a F.
      Funciona como o sistema de notas de uma faculdade.

    Parâmetro:
      - pct: percentual de acerto (0 a 100)

    Retorna um objeto com:
      - label: a letra do conceito ("A", "B", "C", "D" ou "F")
      - color: a cor correspondente (verde para A, vermelho para F, etc.)
  */
  function getConceito(pct) {
    if (pct >= 90) return { label: "A", color: "#3dba7a" }; // verde
    if (pct >= 75) return { label: "B", color: "#7dba3d" }; // verde-amarelado
    if (pct >= 60) return { label: "C", color: "#e09a45" }; // laranja
    if (pct >= 50) return { label: "D", color: "#e05a45" }; // vermelho-claro
    return           { label: "F", color: "#c94435" };      // vermelho-escuro
  }

  /*
    FUNÇÃO: render (iniciar o simulado)

    Parâmetros:
      - container: onde o simulado será desenhado
      - userEmail: e-mail do usuário para salvar o resultado
      - onBack:    função para voltar à aba Início
  */
  function render(container, { userEmail, onBack }) {
    const questions = buildSimulado(); // monta as questões do simulado

    /*
      VARIÁVEIS DE ESTADO do simulado:

        answers:  dicionário de respostas { índiceQuestão: índiceOpção }
                  ex: { 0: 2, 3: 0, 5: 1 } = questão 0 → opção C, questão 3 → opção A...
                  Começa vazio {} porque nenhuma questão foi respondida ainda.
        current:  índice da questão sendo exibida no momento (0 = primeira)
    */
    const answers = {};
    let current = 0;

    /*
      FUNÇÃO: answered (contar questões respondidas)
      Conta quantas questões já têm resposta no dicionário "answers".
    */
    function answered() { return Object.keys(answers).length; }

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: draw (desenhar a questão atual)

       O que monta na tela:
         1. Barra de progresso ("Questão X/Y" + "Z respondidas")
         2. Card da questão com badge "✓ Respondida" (se já respondeu)
         3. Opções de resposta (a opção escolhida fica destacada em vermelho)
         4. Botões de navegação: ← Anterior e Próxima →
         5. Botão "🏁 Finalizar Simulado" (só aparece quando TODAS estão respondidas)
         6. Bolinhas numeradas de progresso (clicáveis para ir direto a qualquer questão)
    */
    function draw() {
      const q = questions[current]; // questão atual
      // Percentual baseado em quantas questões já foram respondidas
      const progress = (answered() / questions.length) * 100;

      DOM.clear(container);
      const pad = el("div", { class: "game-pad" });

      /* ── BARRA DE PROGRESSO ─────────────────────────────────────────── */
      pad.insertAdjacentHTML("beforeend", `
        <div style="margin-bottom:1rem;">
          <div class="progress-head">
            <!-- Número da questão atual -->
            <span class="progress-label">Questão ${current + 1}/${questions.length}</span>
            <!-- Quantas questões já foram respondidas (em vermelho) -->
            <span class="progress-label" style="color:#e05a45;">${answered()} respondidas</span>
          </div>
          <!-- Barra de progresso baseada em questões respondidas -->
          <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%;"></div>
          </div>
        </div>`);

      /* ── CARD DA QUESTÃO ────────────────────────────────────────────── */
      // Verifica se esta questão já foi respondida
      const respondida = answers[current] !== undefined;

      const qCard = el("div", { class: "q-card animate-slide-in-right" });
      qCard.innerHTML = `
        <div class="flex" style="align-items:center;gap:.5rem;margin-bottom:.75rem;">
          <!-- Badge "Múltipla Escolha" -->
          <span class="q-type-pill" style="margin:0;">Múltipla Escolha</span>
          <!-- Badge verde "✓ Respondida" (só aparece se já respondeu esta questão) -->
          ${respondida ? '<span class="q-type-pill" style="margin:0;background:rgba(61,186,122,0.15);color:#3dba7a;">✓ Respondida</span>' : ""}
        </div>
        <!-- Enunciado da questão -->
        <p class="q-text">${q.question}</p>`;
      pad.appendChild(qCard);

      /* ── OPÇÕES DE RESPOSTA ─────────────────────────────────────────── */
      /*
        No simulado, o usuário pode mudar de resposta (não bloqueia como no Quiz).
        A opção escolhida fica com fundo vermelho claro e borda vermelha.
        Clicar em outra opção muda a seleção.
      */
      const opts = el("div", { class: "options" });
      q.options.forEach((opt, idx) => {
        const sel = answers[current] === idx; // esta opção está selecionada?
        const btn = el("button", { class: "opt", attrs: { type: "button" } });

        // Se esta opção está selecionada, aplica destaque vermelho
        if (sel) {
          btn.style.background = "rgba(224,90,69,0.15)";
          btn.style.borderColor = "#e05a45";
        }

        // Letra da opção (A, B, C, D...)
        const letter = el("span", { class: "opt-letter", text: String.fromCharCode(65 + idx) });
        if (sel) letter.style.background = "#e05a45"; // letra vermelha se selecionada
        btn.appendChild(letter);
        btn.appendChild(el("span", { class: "opt-text", text: opt }));

        // Marcador ● na opção selecionada
        if (sel) btn.appendChild(el("span", { class: "opt-mark", text: "●" }));

        // Clicar em uma opção: salva a resposta e redesenha
        btn.addEventListener("click", () => { answers[current] = idx; draw(); });
        opts.appendChild(btn);
      });
      pad.appendChild(opts);

      /* ── NAVEGAÇÃO ENTRE QUESTÕES ───────────────────────────────────── */
      /*
        Dois botões para navegar livremente:
          ← Anterior: vai para a questão anterior (desabilitado na primeira)
          Próxima →:  vai para a questão seguinte (desabilitado na última)
      */
      const nav = el("div", { class: "nav-btns" });

      /* Botão ← Anterior */
      const prev = el("button", {
        class: `nav-btn ${current === 0 ? "disabled" : "active"}`,
        text: "← Anterior",
        attrs: { type: "button" },
      });
      prev.disabled = current === 0; // desabilitado se estiver na primeira questão
      prev.addEventListener("click", () => { if (current > 0) { current--; draw(); } });

      /* Botão Próxima → */
      const nxt = el("button", {
        class: `nav-btn ${current === questions.length - 1 ? "disabled" : "active"}`,
        text: "Próxima →",
        attrs: { type: "button" },
      });
      nxt.disabled = current === questions.length - 1; // desabilitado se for a última
      nxt.addEventListener("click", () => { if (current < questions.length - 1) { current++; draw(); } });

      nav.append(prev, nxt);
      pad.appendChild(nav);

      /* ── BOTÃO FINALIZAR (só aparece quando todas estão respondidas) ── */
      /*
        O botão "🏁 Finalizar Simulado" só aparece quando o número de
        questões respondidas (answered()) é igual ao total de questões.
        Isso garante que o usuário não finaliza com questões em branco.
      */
      if (answered() === questions.length) {
        const fin = el("button", {
          class: "btn-finish animate-slide-in-right",
          html: "🏁 Finalizar Simulado",
          attrs: { type: "button" },
        });
        fin.addEventListener("click", drawResult); // finaliza e mostra resultado
        pad.appendChild(fin);
      }

      /* ── BOLINHAS NUMERADAS DE PROGRESSO ────────────────────────────── */
      /*
        Uma bolinha numerada para cada questão.
        Clicando em qualquer bolinha, vai direto para aquela questão.

        Cores:
          Borda vermelha + número vermelho = questão atual
          Fundo avermelhado + número laranja = questão respondida
          Fundo escuro + número cinza = questão não respondida ainda
      */
      const dots = el("div", { class: "num-dots" });
      questions.forEach((_, i) => {
        const done = answers[i] !== undefined; // esta questão foi respondida?
        const d = el("button", {
          class: "num-dot",
          text: String(i + 1), // número da questão (1, 2, 3...)
          attrs: { type: "button" },
        });

        // Define cor de fundo conforme o estado
        d.style.background = done ? "rgba(224,90,69,0.2)" : i === current ? "#2e3248" : "#14151f";
        // Define cor da borda
        d.style.border = `1px solid ${i === current ? "#e05a45" : done ? "#e05a45" : "#2e3248"}`;
        // Define cor do texto/número
        d.style.color = i === current ? "#e05a45" : done ? "#f07060" : "#7a7e96";

        // Clicar leva diretamente para esta questão
        d.addEventListener("click", () => { current = i; draw(); });
        dots.appendChild(d);
      });
      pad.appendChild(dots);

      container.appendChild(pad);
    }

    /* ════════════════════════════════════════════════════════════════════
       FUNÇÃO: drawResult (exibir resultado final do simulado)

       O que monta na tela:
         1. Card com conceito (A/B/C/D/F), acertos, erros e aproveitamento
         2. Barra de progresso colorida com o percentual
         3. "✅ Aprovado" ou "📚 Precisa estudar mais"
         4. Botões: "📋 Copiar Resultado" e "Voltar"
         5. Lista de questões erradas para revisão (com resposta correta e explicação)
    */
    function drawResult() {
      // Calcula o número de acertos
      const score = questions.filter((_, i) => answers[i] === questions[i].correct).length;
      const total = questions.length;
      const pct = Math.round((score / total) * 100);
      const conceito = getConceito(pct); // objeto { label: "B", color: "#7dba3d" }

      /* Salva o resultado no histórico */
      Storage.saveQuizResult({
        id: `simulado-${Date.now()}`,
        type: "simulado",
        score,
        total,
        date: new Date().toISOString(),
        user: userEmail,
        // Mapeia cada questão para { questionId, correct: acertou? }
        details: questions.map((q, i) => ({ questionId: q.id, correct: answers[i] === q.correct })),
      });

      DOM.clear(container);
      const pad = el("div", { class: "game-pad animate-slide-in-right" });

      /* ── CARD DE PONTUAÇÃO ──────────────────────────────────────────── */
      pad.insertAdjacentHTML("beforeend", `
        <div class="sim-score-card">
          <!-- Círculo com a letra do conceito (A/B/C/D/F) com a cor correspondente -->
          <div class="sim-conceito" style="background:${conceito.color}22;color:${conceito.color};border:2px solid ${conceito.color};">
            ${conceito.label}
          </div>

          <h2 class="result-title">Simulado Concluído!</h2>

          <!-- Grade com 3 números: acertos, erros e aproveitamento -->
          <div class="sim-grid3">
            <div class="sim-mini">
              <p class="sim-mini-v" style="color:#3dba7a;">${score}</p>
              <p class="sim-mini-l">Acertos</p>
            </div>
            <div class="sim-mini">
              <p class="sim-mini-v" style="color:#e05a45;">${total - score}</p>
              <p class="sim-mini-l">Erros</p>
            </div>
            <div class="sim-mini">
              <p class="sim-mini-v" style="color:${conceito.color};">${pct}%</p>
              <p class="sim-mini-l">Aproveit.</p>
            </div>
          </div>

          <!-- Barra de progresso colorida com a cor do conceito -->
          <div class="progress-track" style="margin-bottom:.5rem;">
            <div class="progress-fill" style="width:${pct}%;background:${conceito.color};"></div>
          </div>

          <!-- Situação: aprovado (≥60%) ou precisa estudar mais (<60%) -->
          <p class="sim-status">${pct >= 60 ? "✅ Aprovado" : "📚 Precisa estudar mais"}</p>
        </div>`);

      /* ── BOTÕES DE AÇÃO ─────────────────────────────────────────────── */
      const actions = el("div", { class: "sim-actions" });

      /* Botão COPIAR RESULTADO: gera um texto e copia para a área de transferência */
      const copy = el("button", {
        class: "btn-half-sec",
        html: "📋 Copiar Resultado",
        attrs: { type: "button" },
      });
      copy.addEventListener("click", () => {
        // Texto formatado para colar no WhatsApp, e-mail, etc.
        const text = `📋 Saúde em Foco — Simulado\n✅ Resultado: ${score}/${total} (${pct}%)\n🎓 Conceito: ${conceito.label}\n📅 ${new Date().toLocaleDateString("pt-BR")}`;

        // navigator.clipboard é a API moderna para copiar texto
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});

        // Feedback visual: muda o texto do botão por 1,5 segundos
        copy.innerHTML = "✓ Copiado!";
        setTimeout(() => (copy.innerHTML = "📋 Copiar Resultado"), 1500);
      });

      const back = el("button", {
        class: "btn-half-primary",
        text: "Voltar",
        attrs: { type: "button" },
      });
      back.addEventListener("click", onBack);
      actions.append(copy, back);
      pad.appendChild(actions);

      /* ── REVISÃO DE ERROS ───────────────────────────────────────────── */
      /*
        Lista todas as questões que o usuário errou.
        Para cada erro, mostra:
          • O enunciado da questão
          • A resposta que o usuário deu (em vermelho)
          • A resposta correta (em verde)
          • A explicação do por quê
      */
      // Filtra apenas as questões erradas
      const wrong = questions
        .map((q, i) => ({ q, correct: answers[i] === q.correct, answerIdx: answers[i] }))
        .filter((it) => !it.correct); // mantém apenas onde correct = false

      if (wrong.length) {
        pad.appendChild(el("h3", {
          class: "section-label",
          text: `Questões para revisar (${wrong.length})`,
        }));

        const list = el("div", { style: "display:flex;flex-direction:column;gap:.75rem;" });
        wrong.forEach(({ q, answerIdx }) => {
          const card = el("div", { class: "review-card" });
          card.innerHTML = `
            <!-- Enunciado da questão errada -->
            <p class="review-q">${q.question}</p>

            <!-- Resposta que o usuário deu (em vermelho, com ✗) -->
            ${answerIdx !== undefined ? `<p class="review-wrong">✗ Sua resposta: ${q.options[answerIdx]}</p>` : ""}

            <!-- Resposta correta (em verde, com ✓) -->
            <p class="review-right">✓ Correta: ${q.options[q.correct]}</p>

            <!-- Explicação da resposta correta -->
            <p class="review-explain">${q.explanation}</p>`;
          list.appendChild(card);
        });
        pad.appendChild(list);
      }

      container.appendChild(pad);
    }

    // Começa exibindo a primeira questão do simulado
    draw();
  }

  // Exporta para ser usado em home.js
  window.SimuladoScreen = { render };
})();
