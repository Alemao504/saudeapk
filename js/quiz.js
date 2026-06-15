/* =========================================================================
   quiz.js — Quiz de 10 questões aleatórias (múltipla escolha + V/F)
   render(container, { userEmail, onBack })
   ========================================================================= */

(function () {
  const { el, shuffle } = DOM;

  function render(container, { userEmail, onBack }) {
    const questions = shuffle(AppData.QUESTIONS).slice(0, 10);
    let current = 0;
    let selected = null;
    const details = [];

    function acertos() { return details.filter((d) => d.correct).length; }

    function drawQuestion() {
      const q = questions[current];
      const progress = ((current + 1) / questions.length) * 100;
      DOM.clear(container);

      const pad = el("div", { class: "game-pad" });

      // Barra de progresso
      pad.insertAdjacentHTML("beforeend", `
        <div style="margin-bottom:1rem;">
          <div class="progress-head">
            <span class="progress-label">Questão ${current + 1} de ${questions.length}</span>
            <span class="progress-count">${acertos()} ✓</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%;"></div></div>
        </div>`);

      // Card da questão
      const qCard = el("div", { class: "q-card animate-slide-in-right" });
      qCard.innerHTML = `
        <span class="q-type-pill">${q.type === "tf" ? "Verdadeiro ou Falso" : "Múltipla Escolha"}</span>
        <p class="q-text">${q.question}</p>`;
      pad.appendChild(qCard);

      // Opções
      const opts = el("div", { class: "options" });
      q.options.forEach((opt, idx) => {
        const btn = el("button", { class: "opt", attrs: { type: "button" } });
        const label = q.type === "mc" ? String.fromCharCode(65 + idx) : null;
        if (label) btn.appendChild(el("span", { class: "opt-letter", text: label }));
        btn.appendChild(el("span", { class: "opt-text", text: opt }));
        btn.addEventListener("click", () => handleSelect(idx));
        opts.appendChild(btn);
      });
      pad.appendChild(opts);

      const explainSlot = el("div");
      pad.appendChild(explainSlot);

      // Botão avançar
      const next = el("button", {
        class: "btn-next disabled",
        text: current + 1 >= questions.length ? "Ver Resultado" : "Próxima →",
        attrs: { type: "button" },
      });
      next.disabled = true;
      next.addEventListener("click", handleNext);
      pad.appendChild(next);

      container.appendChild(pad);

      // Lógica de seleção (closure local)
      function handleSelect(idx) {
        if (selected !== null) return;
        selected = idx;
        const correct = idx === q.correct;
        details.push({ questionId: q.id, correct });

        // Pinta opções
        [...opts.children].forEach((btn, i) => {
          btn.disabled = true;
          const letter = btn.querySelector(".opt-letter");
          if (i === q.correct) {
            btn.classList.add("correct");
            if (letter) letter.classList.add("correct");
            btn.appendChild(el("span", { class: "opt-mark", text: "✓" }));
          } else if (i === idx) {
            btn.classList.add("wrong");
            if (letter) letter.classList.add("wrong");
            btn.appendChild(el("span", { class: "opt-mark", text: "✗" }));
          }
        });

        // Explicação
        const ex = el("div", { class: `explain ${correct ? "correct" : "wrong"} animate-slide-in-right` });
        ex.innerHTML = `
          <p class="explain-head">${correct ? "✓ Correto!" : "✗ Incorreto"}</p>
          <p class="explain-text">${q.explanation}</p>`;
        explainSlot.appendChild(ex);

        // Habilita avançar
        next.disabled = false;
        next.classList.remove("disabled");
        next.classList.add("enabled");

        // Atualiza contador de acertos
        pad.querySelector(".progress-count").textContent = `${acertos()} ✓`;
      }
    }

    function handleNext() {
      if (current + 1 >= questions.length) return drawResult();
      current++;
      selected = null;
      drawQuestion();
    }

    function drawResult() {
      const score = acertos();
      const total = questions.length;
      const pct = Math.round((score / total) * 100);

      Storage.saveQuizResult({
        id: `quiz-${Date.now()}`, type: "quiz", score, total,
        date: new Date().toISOString(), user: userEmail, details,
      });

      let msg, emoji;
      if (pct >= 90) { msg = "Excelente! Você domina o tema!"; emoji = "🏆"; }
      else if (pct >= 70) { msg = "Muito bem! Continue estudando!"; emoji = "🎯"; }
      else if (pct >= 50) { msg = "Bom esforço! Revise os conteúdos."; emoji = "📚"; }
      else { msg = "Continue praticando, você consegue!"; emoji = "💪"; }

      DOM.clear(container);
      const wrap = el("div", { class: "result-wrap animate-slide-in-right" });
      wrap.innerHTML = `
        <div class="result-card">
          <div class="result-emoji">${emoji}</div>
          <h2 class="result-title">Quiz Concluído!</h2>
          <p class="result-msg">${msg}</p>
          <div class="result-score-box">
            <p class="result-score">${score}/${total}</p>
            <p class="result-pct">${pct}% de acerto</p>
          </div>
          <div class="result-btns">
            <button type="button" class="btn-half-primary" data-act="repeat">Repetir Quiz</button>
            <button type="button" class="btn-half-sec" data-act="back">Voltar</button>
          </div>
        </div>`;
      wrap.querySelector('[data-act="repeat"]').addEventListener("click", () =>
        render(container, { userEmail, onBack }));
      wrap.querySelector('[data-act="back"]').addEventListener("click", onBack);
      container.appendChild(wrap);
    }

    drawQuestion();
  }

  window.QuizScreen = { render };
})();
