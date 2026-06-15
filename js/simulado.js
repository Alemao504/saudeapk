/* =========================================================================
   simulado.js — Simulado: 1 questão MC por tema (até 20), navegável,
   com conceito (A–F) e revisão de erros ao final.
   render(container, { userEmail, onBack })
   ========================================================================= */

(function () {
  const { el } = DOM;

  function buildSimulado() {
    const result = [];
    for (let theme = 1; theme <= 20; theme++) {
      const cands = AppData.QUESTIONS.filter((q) => q.themeNum === theme && q.type === "mc");
      if (cands.length) result.push(cands[Math.floor(Math.random() * cands.length)]);
    }
    return result;
  }

  function getConceito(pct) {
    if (pct >= 90) return { label: "A", color: "#3dba7a" };
    if (pct >= 75) return { label: "B", color: "#7dba3d" };
    if (pct >= 60) return { label: "C", color: "#e09a45" };
    if (pct >= 50) return { label: "D", color: "#e05a45" };
    return { label: "F", color: "#c94435" };
  }

  function render(container, { userEmail, onBack }) {
    const questions = buildSimulado();
    const answers = {}; // index -> opção escolhida
    let current = 0;

    function answered() { return Object.keys(answers).length; }

    function draw() {
      const q = questions[current];
      const progress = (answered() / questions.length) * 100;
      DOM.clear(container);
      const pad = el("div", { class: "game-pad" });

      // Progresso
      pad.insertAdjacentHTML("beforeend", `
        <div style="margin-bottom:1rem;">
          <div class="progress-head">
            <span class="progress-label">Questão ${current + 1}/${questions.length}</span>
            <span class="progress-label" style="color:#e05a45;">${answered()} respondidas</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%;"></div></div>
        </div>`);

      // Card da questão
      const respondida = answers[current] !== undefined;
      const qCard = el("div", { class: "q-card animate-slide-in-right" });
      qCard.innerHTML = `
        <div class="flex" style="align-items:center;gap:.5rem;margin-bottom:.75rem;">
          <span class="q-type-pill" style="margin:0;">Múltipla Escolha</span>
          ${respondida ? '<span class="q-type-pill" style="margin:0;background:rgba(61,186,122,0.15);color:#3dba7a;">✓ Respondida</span>' : ""}
        </div>
        <p class="q-text">${q.question}</p>`;
      pad.appendChild(qCard);

      // Opções
      const opts = el("div", { class: "options" });
      q.options.forEach((opt, idx) => {
        const sel = answers[current] === idx;
        const btn = el("button", { class: "opt", attrs: { type: "button" } });
        if (sel) { btn.style.background = "rgba(224,90,69,0.15)"; btn.style.borderColor = "#e05a45"; }
        const letter = el("span", { class: "opt-letter", text: String.fromCharCode(65 + idx) });
        if (sel) letter.style.background = "#e05a45";
        btn.appendChild(letter);
        btn.appendChild(el("span", { class: "opt-text", text: opt }));
        if (sel) btn.appendChild(el("span", { class: "opt-mark", text: "●" }));
        btn.addEventListener("click", () => { answers[current] = idx; draw(); });
        opts.appendChild(btn);
      });
      pad.appendChild(opts);

      // Navegação
      const nav = el("div", { class: "nav-btns" });
      const prev = el("button", {
        class: `nav-btn ${current === 0 ? "disabled" : "active"}`,
        text: "← Anterior", attrs: { type: "button" },
      });
      prev.disabled = current === 0;
      prev.addEventListener("click", () => { if (current > 0) { current--; draw(); } });
      const nxt = el("button", {
        class: `nav-btn ${current === questions.length - 1 ? "disabled" : "active"}`,
        text: "Próxima →", attrs: { type: "button" },
      });
      nxt.disabled = current === questions.length - 1;
      nxt.addEventListener("click", () => { if (current < questions.length - 1) { current++; draw(); } });
      nav.append(prev, nxt);
      pad.appendChild(nav);

      // Finalizar (só quando todas respondidas)
      if (answered() === questions.length) {
        const fin = el("button", {
          class: "btn-finish animate-slide-in-right", html: "🏁 Finalizar Simulado",
          attrs: { type: "button" },
        });
        fin.addEventListener("click", drawResult);
        pad.appendChild(fin);
      }

      // Bolinhas numeradas
      const dots = el("div", { class: "num-dots" });
      questions.forEach((_, i) => {
        const done = answers[i] !== undefined;
        const d = el("button", { class: "num-dot", text: String(i + 1), attrs: { type: "button" } });
        d.style.background = done ? "rgba(224,90,69,0.2)" : i === current ? "#2e3248" : "#14151f";
        d.style.border = `1px solid ${i === current ? "#e05a45" : done ? "#e05a45" : "#2e3248"}`;
        d.style.color = i === current ? "#e05a45" : done ? "#f07060" : "#7a7e96";
        d.addEventListener("click", () => { current = i; draw(); });
        dots.appendChild(d);
      });
      pad.appendChild(dots);

      container.appendChild(pad);
    }

    function drawResult() {
      const score = questions.filter((_, i) => answers[i] === questions[i].correct).length;
      const total = questions.length;
      const pct = Math.round((score / total) * 100);
      const conceito = getConceito(pct);

      Storage.saveQuizResult({
        id: `simulado-${Date.now()}`, type: "simulado", score, total,
        date: new Date().toISOString(), user: userEmail,
        details: questions.map((q, i) => ({ questionId: q.id, correct: answers[i] === q.correct })),
      });

      DOM.clear(container);
      const pad = el("div", { class: "game-pad animate-slide-in-right" });

      // Card de pontuação
      pad.insertAdjacentHTML("beforeend", `
        <div class="sim-score-card">
          <div class="sim-conceito" style="background:${conceito.color}22;color:${conceito.color};border:2px solid ${conceito.color};">${conceito.label}</div>
          <h2 class="result-title">Simulado Concluído!</h2>
          <div class="sim-grid3">
            <div class="sim-mini"><p class="sim-mini-v" style="color:#3dba7a;">${score}</p><p class="sim-mini-l">Acertos</p></div>
            <div class="sim-mini"><p class="sim-mini-v" style="color:#e05a45;">${total - score}</p><p class="sim-mini-l">Erros</p></div>
            <div class="sim-mini"><p class="sim-mini-v" style="color:${conceito.color};">${pct}%</p><p class="sim-mini-l">Aproveit.</p></div>
          </div>
          <div class="progress-track" style="margin-bottom:.5rem;"><div class="progress-fill" style="width:${pct}%;background:${conceito.color};"></div></div>
          <p class="sim-status">${pct >= 60 ? "✅ Aprovado" : "📚 Precisa estudar mais"}</p>
        </div>`);

      // Ações
      const actions = el("div", { class: "sim-actions" });
      const copy = el("button", { class: "btn-half-sec", html: "📋 Copiar Resultado", attrs: { type: "button" } });
      copy.addEventListener("click", () => {
        const text = `📋 Saúde em Foco — Simulado\n✅ Resultado: ${score}/${total} (${pct}%)\n🎓 Conceito: ${conceito.label}\n📅 ${new Date().toLocaleDateString("pt-BR")}`;
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
        copy.innerHTML = "✓ Copiado!";
        setTimeout(() => (copy.innerHTML = "📋 Copiar Resultado"), 1500);
      });
      const back = el("button", { class: "btn-half-primary", text: "Voltar", attrs: { type: "button" } });
      back.addEventListener("click", onBack);
      actions.append(copy, back);
      pad.appendChild(actions);

      // Revisão de erros
      const wrong = questions
        .map((q, i) => ({ q, correct: answers[i] === q.correct, answerIdx: answers[i] }))
        .filter((it) => !it.correct);

      if (wrong.length) {
        pad.appendChild(el("h3", { class: "section-label", text: `Questões para revisar (${wrong.length})` }));
        const list = el("div", { style: "display:flex;flex-direction:column;gap:.75rem;" });
        wrong.forEach(({ q, answerIdx }) => {
          const card = el("div", { class: "review-card" });
          card.innerHTML = `
            <p class="review-q">${q.question}</p>
            ${answerIdx !== undefined ? `<p class="review-wrong">✗ Sua resposta: ${q.options[answerIdx]}</p>` : ""}
            <p class="review-right">✓ Correta: ${q.options[q.correct]}</p>
            <p class="review-explain">${q.explanation}</p>`;
          list.appendChild(card);
        });
        pad.appendChild(list);
      }

      container.appendChild(pad);
    }

    draw();
  }

  window.SimuladoScreen = { render };
})();
