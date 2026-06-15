/* =========================================================================
   joguinho.js — Cartões "Verdade ou Mito" com sequência (streak) e confete
   render(container, { userEmail, onBack })
   ========================================================================= */

(function () {
  const { el, shuffle } = DOM;

  function render(container, { userEmail, onBack }) {
    const questions = shuffle(AppData.QUESTIONS.filter((q) => q.type === "tf")).slice(0, 10);
    let current = 0;
    let cardState = "idle"; // idle | correct | wrong
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    const details = [];
    let advanceTimer = null;

    function draw() {
      const q = questions[current];
      DOM.clear(container);
      const pad = el("div", { class: "game-pad" });

      // Cabeçalho com streak e placar
      const head = el("div", { class: "jog-head" });
      head.innerHTML = `
        <div class="flex" style="align-items:center;gap:.5rem;">
          <span class="jog-counter">${current + 1}/${questions.length} cards</span>
        </div>
        <div class="jog-right">
          <span class="jog-streak-slot"></span>
          <span class="jog-score">${score} ✓</span>
        </div>`;
      const streakSlot = head.querySelector(".jog-streak-slot");
      if (streak > 0) streakSlot.innerHTML = `<span class="jog-streak">🔥 ×${streak}</span>`;
      pad.appendChild(head);

      // Flip card
      const flipWrap = el("div", { class: "flip-wrap" });
      const inner = el("div", { class: "flip-inner" });

      const front = el("div", { class: "flip-face flip-front" });
      front.innerHTML = `
        <span class="flip-pill">Verdadeiro ou Falso?</span>
        <p class="flip-q">${q.question}</p>`;

      const back = el("div", { class: "flip-face flip-back" });
      inner.append(front, back);
      flipWrap.appendChild(inner);
      pad.appendChild(flipWrap);

      // Botões de resposta
      const btns = el("div", { class: "answer-btns" });
      const btnTrue = el("button", { class: "ans-btn ans-true", html: "👍 VERDADE", attrs: { type: "button" } });
      const btnFalse = el("button", { class: "ans-btn ans-false", html: "👎 MITO", attrs: { type: "button" } });
      btnTrue.addEventListener("click", () => answer(true));
      btnFalse.addEventListener("click", () => answer(false));
      btns.append(btnTrue, btnFalse);
      pad.appendChild(btns);

      // Bolinhas de progresso
      const dots = el("div", { class: "dots" });
      questions.forEach((_, i) => {
        let bg = "#2e3248";
        if (i < current) bg = details[i]?.correct ? "#3dba7a" : "#e05a45";
        else if (i === current) bg = "#f0ece4";
        dots.appendChild(el("div", { class: "dot", style: `background:${bg};` }));
      });
      pad.appendChild(dots);

      container.appendChild(pad);

      function answer(userSaysTrue) {
        if (cardState !== "idle") return;
        const correctIsTrue = q.correct === 0; // índice 0 = "Verdadeiro"
        const correct = userSaysTrue === correctIsTrue;
        cardState = correct ? "correct" : "wrong";
        details.push({ questionId: q.id, correct });

        // Vira o card
        inner.classList.add("flipped");
        front.classList.add(cardState);
        back.classList.add(cardState);
        if (!correct) inner.classList.add("animate-shake");
        back.innerHTML = `
          <div class="flip-mark">${correct ? "✓" : "✗"}</div>
          <p class="flip-answer ${cardState}">${q.options[q.correct]}</p>
          <p class="flip-explain">${q.explanation}</p>`;

        btnTrue.disabled = true; btnFalse.disabled = true;

        if (correct) {
          score++;
          streak++;
          if (streak > maxStreak) maxStreak = streak;
          Anim.fireConfetti(2000);
          if (streak >= 5) {
            streakSlot.innerHTML = `<span class="jog-streak-big animate-slide-in-right">🔥 ${streak} em sequência!</span>`;
          }
          head.querySelector(".jog-score").textContent = `${score} ✓`;
        } else {
          streak = 0;
        }

        advanceTimer = setTimeout(() => {
          if (current + 1 >= questions.length) return drawResult();
          current++;
          cardState = "idle";
          draw();
        }, 2000);
      }
    }

    function drawResult() {
      const total = questions.length;
      const pct = Math.round((score / total) * 100);
      Storage.saveQuizResult({
        id: `joguinho-${Date.now()}`, type: "joguinho", score, total,
        date: new Date().toISOString(), user: userEmail, details,
      });

      const emoji = pct >= 80 ? "🔥" : pct >= 60 ? "🎯" : "💪";
      const msg = pct >= 80 ? "Você arrasou!" : pct >= 60 ? "Muito bom!" : "Continue praticando!";

      DOM.clear(container);
      const wrap = el("div", { class: "result-wrap animate-slide-in-right" });
      wrap.innerHTML = `
        <div class="result-card">
          <div class="result-emoji">${emoji}</div>
          <h2 class="result-title">Joguinho Concluído!</h2>
          <p class="result-msg">${msg}</p>
          <div class="result-grid2">
            <div class="result-mini">
              <p class="result-mini-v" style="color:#e05a45;">${score}/${total}</p>
              <p class="result-mini-l">Acertos</p>
            </div>
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
        render(container, { userEmail, onBack }));
      wrap.querySelector('[data-act="back"]').addEventListener("click", onBack);
      container.appendChild(wrap);
    }

    draw();
  }

  window.JoguinhoScreen = { render };
})();
