(() => {
  // Modifica aquí los nombres, descripciones y colores de cada resultado.
  const outcomes = [
    { title: "20% DE DESCUENTO", detail: "En todos los lentes", color: "#ff7518", text: "#100d16", icon: "👓", theme: "discount", kicker: "¡QUÉ BUENA SUERTE!", message: "Una oportunidad para mirar diferente." },
    { title: "50% DE DESCUENTO", detail: "En todas las monturas", color: "#8f55c7", text: "#fff3de", icon: "🕶️", theme: "jackpot", kicker: "¡RESULTADO EXTRAORDINARIO!", message: "El estilo también puede dar miedo… ¡del bueno!" },
    { title: "SORPRESA", detail: "Consulta el beneficio en tienda", color: "#c7f464", text: "#100d16", icon: "🎁", theme: "surprise", kicker: "¡UNA SORPRESA TE ESPERA!", message: "La curiosidad es parte de la magia de Halloween." },
    { title: "INTENTA DE NUEVO", detail: "Puedes volver a girar", color: "#fff3de", text: "#100d16", icon: "🦇", theme: "spooky", kicker: "¡BUUU… CASI!", message: "Los fantasmas dicen que puedes probar otra vez." },
    { title: "RECLAMA KIT", detail: "Pregunta por el kit promocional", color: "#5ec8b7", text: "#100d16", icon: "🎃", theme: "gift", kicker: "¡UN DETALLE ESPECIAL!", message: "Pregunta en tienda por la disponibilidad del kit." },
    { title: "¡SIGUE PARTICIPANDO!", detail: "Consulta las condiciones en tienda", color: "#da77a8", text: "#100d16", icon: "✨", theme: "magic", kicker: "¡LA MAGIA CONTINÚA!", message: "Cada giro trae una nueva sorpresa." }
  ];
  const $ = (id) => document.getElementById(id);
  const promoTab = $("promosTab"), wheelTab = $("wheelTab");
  const promotions = $("promotions"), wheelSection = $("wheelSection");
  const canvas = $("wheelCanvas"), ctx = canvas.getContext("2d");
  const spinButton = $("spinButton"), resetButton = $("resetButton");
  const resultTitle = $("resultTitle"), resultDetail = $("resultDetail");
  const resultModal = $("resultModal"), modalCard = $("resultModalCard");
  const modalResultTitle = $("modalResultTitle"), modalResultDetail = $("modalResultDetail");
  const modalResultIcon = $("modalResultIcon"), modalKicker = $("modalKicker");
  const modalDecor = $("modalDecor"), modalEffects = $("modalEffects");
  const closeModalButton = $("closeResultModal"), modalDoneButton = $("modalDoneButton");
  const spinAgainButton = $("spinAgainButton");
  let previousFocus = null, effectTimers = [];
  let angle = 0, spinning = false, frame = null;

  function drawWheel(rotation = angle) {
    const size = canvas.width, center = size / 2, radius = size / 2 - 12;
    const slice = Math.PI * 2 / outcomes.length;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);
    outcomes.forEach((item, i) => {
      const start = -Math.PI / 2 + i * slice;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#100d16";
      ctx.stroke();

      const mid = start + slice / 2;
      ctx.save();
      ctx.rotate(mid);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = item.text;
      ctx.font = "900 25px system-ui, sans-serif";
      const words = item.title.split(" ");
      const lines = [];
      let line = "";
      words.forEach(word => {
        const candidate = line ? line + " " + word : word;
        if (ctx.measureText(candidate).width > 175 && line) {
          lines.push(line); line = word;
        } else line = candidate;
      });
      if (line) lines.push(line);
      const base = -((lines.length - 1) * 15);
      lines.forEach((part, lineIndex) => {
        ctx.fillText(part, radius * .64, base + lineIndex * 30, 190);
      });
      ctx.restore();
    });
    ctx.restore();
    // Anillo exterior
    ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 8; ctx.strokeStyle = "#fff3de"; ctx.stroke();
  }

  function showSection(which) {
    const showWheel = which === "wheel";
    promotions.classList.toggle("hidden", showWheel);
    wheelSection.classList.toggle("hidden", !showWheel);
    promoTab.classList.toggle("active", !showWheel);
    wheelTab.classList.toggle("active", showWheel);
    promoTab.setAttribute("aria-selected", String(!showWheel));
    wheelTab.setAttribute("aria-selected", String(showWheel));
    if (showWheel) drawWheel();
  }
  promoTab.addEventListener("click", () => showSection("promos"));
  wheelTab.addEventListener("click", () => showSection("wheel"));
  $("goWheel").addEventListener("click", () => { showSection("wheel"); wheelTab.focus(); });

  function clearModalEffects() {
    effectTimers.forEach(clearTimeout);
    effectTimers = [];
    modalEffects.replaceChildren();
  }

  function launchModalEffects(theme) {
    clearModalEffects();
    const symbols = theme === "spooky" ? ["🦇", "👻", "🕸️", "💜"] :
      theme === "gift" ? ["🎁", "🎃", "✨", "🧡"] :
      theme === "surprise" ? ["⭐", "✨", "🎁", "🌟"] :
      theme === "jackpot" ? ["🎉", "✨", "🕶️", "🟣"] :
      theme === "discount" ? ["🎉", "🧡", "👓", "✨"] : ["✨", "🎃", "⭐", "🦇"];
    const count = theme === "spooky" ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "effect-particle" + (theme === "spooky" ? " spooky-particle" : "");
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--drift", `${Math.round(Math.random() * 180 - 90)}px`);
      particle.style.setProperty("--duration", `${2.1 + Math.random() * 2.2}s`);
      particle.style.animationDelay = `${Math.random() * .65}s`;
      modalEffects.appendChild(particle);
      effectTimers.push(setTimeout(() => particle.remove(), 5200));
    }
  }

  function openResultModal(item) {
    previousFocus = document.activeElement;
    modalCard.dataset.theme = item.theme || "magic";
    modalResultIcon.textContent = item.icon || "🎃";
    modalKicker.textContent = item.kicker || "¡LA RULETA HA HABLADO!";
    modalResultTitle.textContent = item.title;
    modalResultDetail.textContent = `${item.detail}. ${item.message || ""}`.trim();
    modalResultTitle.style.color = item.color;
    modalDecor.textContent = item.theme === "spooky" ? "🦇　👻　🕸️" :
      item.theme === "gift" ? "✦　🎁　✦" :
      item.theme === "jackpot" ? "✨　🎉　✨" :
      item.theme === "discount" ? "🧡　✦　🧡" : "✦　🎃　✦";
    resultModal.classList.add("is-open");
    resultModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    launchModalEffects(item.theme);
    closeModalButton.focus();
  }

  function closeResultModal() {
    resultModal.classList.remove("is-open");
    resultModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    clearModalEffects();
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  closeModalButton.addEventListener("click", closeResultModal);
  modalDoneButton.addEventListener("click", closeResultModal);
  resultModal.addEventListener("click", (event) => {
    if (event.target.dataset.closeModal === "true") closeResultModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && resultModal.classList.contains("is-open")) closeResultModal();
  });
  spinAgainButton.addEventListener("click", () => {
    closeResultModal();
    spinButton.focus();
    spinButton.click();
  });

  function finishSpin(index) {
    document.body.classList.remove("wheel-spinning");
    spinning = false;
    spinButton.disabled = false;
    spinButton.textContent = "🎡 GIRAR RULETA";
    resultTitle.textContent = outcomes[index].title;
    resultDetail.textContent = outcomes[index].detail;
    $("result").classList.remove("result-flash");
    void $("result").offsetWidth;
    $("result").classList.add("result-flash");
    openResultModal(outcomes[index]);
  }

  spinButton.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    document.body.classList.add("wheel-spinning");
    spinButton.disabled = true;
    spinButton.textContent = "GIRANDO…";
    resultTitle.textContent = "La suerte está girando…";
    resultDetail.textContent = "Espera a que la ruleta se detenga.";
    const chosen = Math.floor(Math.random() * outcomes.length);
    const slice = Math.PI * 2 / outcomes.length;
    // El puntero está arriba. Orienta el centro del sector escogido hacia las 12.
    const desired = ((Math.PI * 2 - (chosen + .5) * slice) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const current = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const delta = (desired - current + Math.PI * 2) % (Math.PI * 2);
    const startAngle = angle;
    const targetAngle = angle + Math.PI * 2 * 5 + delta;
    const duration = 4400;
    const startTime = performance.now();
    cancelAnimationFrame(frame);
    function animate(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      // Ease-out cúbico: gira rápido y desacelera suavemente.
      const eased = 1 - Math.pow(1 - progress, 3);
      angle = startAngle + (targetAngle - startAngle) * eased;
      drawWheel(angle);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else { angle = targetAngle % (Math.PI * 2); drawWheel(angle); finishSpin(chosen); }
    }
    frame = requestAnimationFrame(animate);
  });

  resetButton.addEventListener("click", () => {
    if (spinning) return;
    cancelAnimationFrame(frame);
    angle = 0;
    drawWheel();
    resultTitle.textContent = "¿Listo para girar?";
    resultDetail.textContent = "Pulsa el botón para comenzar.";
  });

  drawWheel();
})();
