/**
 * livret-projet.js — Livret du projet (livret-projet.html)
 *
 * Les pages du livret sont écrites en HTML dans livret-projet.html, dans <div id="lv-source">.
 * Ce script s'occupe de tout le reste, automatiquement :
 *   - numérotation des pages, sommaire, cartes « chapitres » sous le livre
 *   - coloration des blocs de code
 *   - effet « livre qu'on feuillette » (bibliothèque StPageFlip), plein écran, clavier
 *   - téléchargement en PDF (impression du navigateur)
 *   - vérification qu'aucun texte ne dépasse de sa page (messages dans la console F12)
 *
 * Ajouter, supprimer ou déplacer une page = modifier uniquement livret-projet.html.
 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const source = $("#lv-source");
  const GROUP_COLORS = ["c-blue", "c-green", "c-violet", "c-orange", "c-cyan"];

  /* =====================================================
     1. Préparation des pages
     ===================================================== */
  // Page blanche si le nombre de pages est impair (la 4e de couverture doit être une page de droite)
  let sheets = [...source.querySelectorAll(":scope > .lv-sheet")];
  if (sheets.length % 2 === 1) {
    const blank = document.createElement("section");
    blank.className = "lv-sheet lv-blank";
    blank.dataset.title = "Page blanche";
    blank.innerHTML = '<div class="lv-body">Page laissée blanche</div>';
    source.insertBefore(blank, sheets[sheets.length - 1]);
    sheets = [...source.querySelectorAll(":scope > .lv-sheet")];
  }
  const TOTAL = sheets.length;
  const titleOf = el => el.dataset.title || "Page";

  // Numéros de page
  sheets.forEach((s, i) => s.querySelectorAll(".lv-num").forEach(n => { n.textContent = i + 1; }));

  // Blocs de code : retire l'indentation commune puis colore (commentaires « ! » et premier mot)
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  source.querySelectorAll("pre.lv-code").forEach(pre => {
    const lines = pre.textContent.replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    pre.innerHTML = lines.map(l => {
      const t = esc(l.slice(indent));
      if (/^\s*!/.test(t)) return `<span class="c">${t}</span>`;
      return t.replace(/^(\s*)([A-Za-z][\w-]*)/, '$1<span class="k">$2</span>');
    }).join("\n");
  });

  /* =====================================================
     2. Sommaire (page « Sommaire ») + cartes « chapitres »
     ===================================================== */
  const entries = sheets
    .map((s, i) => ({ el: s, page: i + 1 }))
    .filter(e => e.el.dataset.toc);

  const groups = [];
  entries.forEach(e => {
    const g = e.el.dataset.group || "Chapitres";
    let grp = groups.find(x => x.name === g);
    if (!grp) { grp = { name: g, items: [] }; groups.push(grp); }
    grp.items.push(e);
  });

  const tocEl = $("#lv-toc");
  if (tocEl) {
    let n = 0;
    tocEl.innerHTML = groups.map((g, gi) => `
      <div class="lv-toc-group ${GROUP_COLORS[gi % GROUP_COLORS.length]}">
        <h3>${esc(g.name)}</h3>
        ${g.items.map(e => `
          <div class="lv-toc-row"><span class="n">${String(++n).padStart(2, "0")}</span><span class="t">${esc(e.el.dataset.toc)}</span><span class="p">p. ${e.page}</span></div>`).join("")}
      </div>`).join("");
    const sub = $("#lv-toc-sub");
    if (sub) sub.textContent = `${entries.length} chapitres · ${TOTAL} pages` + (sub.dataset.tail !== undefined ? sub.dataset.tail : " · du besoin de l'entreprise aux tests de panne");   // fin de phrase : attribut data-tail de la page, sinon texte par défaut
  }

  const cards = entries.filter(e => e.el.dataset.desc);
  const grid = $("#cert-grid");
  grid.innerHTML = cards.map(e => {
    const d = e.el.dataset;
    const tags = (d.tags || "").split(",").map(t => t.trim()).filter(Boolean);
    return `
      <article class="cert-card" data-cat="${esc(d.group || "")}">
        <div class="cert-top">
          <div class="cert-icon" aria-hidden="true">${d.icon || "📄"}</div>
          <span class="cert-badge">Page ${e.page}</span>
        </div>
        <div>
          <div class="cert-org cert-mono">${esc(d.group || "")}</div>
          <h3>${esc(d.toc || d.title)}</h3>
        </div>
        <p>${esc(d.desc)}</p>
        <div class="cert-tags">${tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="cert-foot">
          <span class="cert-mono">${e.page} / ${TOTAL}</span>
          <button class="cert-btn" type="button" data-page="${e.page}">Voir dans le livre</button>
        </div>
      </article>`;
  }).join("");

  /* =====================================================
     3. Effet terminal + chiffres clés
     ===================================================== */
  const typedEl = $("#cert-typed"), cmd = typedEl.dataset.cmd || "$ show infrastructure --all";   // texte du terminal : attribut data-cmd de la page, sinon texte par défaut
  if (reduce) typedEl.textContent = cmd;
  else { let i = 0; (function t() { typedEl.textContent = cmd.slice(0, ++i); if (i < cmd.length) setTimeout(t, 65); })(); }

  document.querySelectorAll(".cert-stat b").forEach(el => {
    const end = el.dataset.n === "auto" ? TOTAL : +el.dataset.n;
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now();
    (function f(t) { const p = Math.min((t - t0) / 1100, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  });

  /* =====================================================
     4. Le livre
     ===================================================== */
  const MINW = 240;                          // largeur mini d'une page (bascule en mode une page)
  const wrap = $("#cert-bookwrap"), stage = $("#cert-stage");
  const indEl = $("#cert-ind"), prevBtn = $("#cert-prev"), nextBtn = $("#cert-next"), fullBtn = $("#cert-full");
  let forcePortrait = false, api = null, pf = null;

  function isLandscape() {
    return !!(pf && pf.getOrientation && pf.getOrientation() === "landscape");
  }
  // Réduit les pages 750 x 1000 à la taille réelle de la vitrine
  function applyScale() {
    const w = stage.clientWidth || parseFloat(stage.style.width) || 600;
    const pageW = (isLandscape() || (!pf && !forcePortrait && w > 2 * MINW + 60)) ? w / 2 : w;
    stage.style.setProperty("--k", (pageW / 750).toFixed(4));
  }

  function layout() {
    const fs = !!document.fullscreenElement;
    const availW = fs ? innerWidth - 40 : wrap.clientWidth - 32;
    const maxH = fs ? innerHeight - 110 : Math.max(480, innerHeight - 190);
    const portrait = forcePortrait || availW < 2 * MINW;
    let w, h;
    if (portrait) { w = Math.min(availW, maxH * 0.75, 640); h = w * 4 / 3; }
    else { w = Math.min(availW, maxH * 1.5, 1260); h = w / 1.5; }
    stage.style.width = Math.round(w) + "px";
    stage.style.height = Math.round(h) + "px";
    applyScale();
  }

  function label(i) {
    if (i <= 0) return "Couverture";
    if (i >= TOTAL - 1) return "Quatrième de couverture";
    if (!isLandscape()) return `Page ${i + 1} / ${TOTAL}`;
    const left = i % 2 === 1 ? i : i - 1;
    return `Pages ${left + 1}–${left + 2} / ${TOTAL}`;
  }
  function refresh(i) {
    indEl.textContent = label(i);
    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= TOTAL - 1;
    applyScale();
  }

  function buildPages() {
    stage.innerHTML = "";
    return sheets.map((s, k) => {
      const d = document.createElement("div");
      d.className = "page";
      d.setAttribute("aria-label", titleOf(s));
      if (k === 0 || k === TOTAL - 1) d.setAttribute("data-density", "hard");
      const inner = document.createElement("div");
      inner.className = "lv-scale";
      inner.appendChild(s.cloneNode(true));
      d.appendChild(inner);
      stage.appendChild(d);
      return d;
    });
  }

  function initFlip() {
    layout();
    const pages = buildPages();
    pf = new St.PageFlip(stage, {
      width: 600, height: 800, size: "stretch",
      minWidth: MINW, maxWidth: 720, minHeight: 320, maxHeight: 960,
      showCover: true, usePortrait: true, mobileScrollSupport: false,
      maxShadowOpacity: 0.45, flippingTime: reduce ? 1 : 850, drawShadow: true, startPage: 0
    });
    (pf.loadFromHTML || pf.loadFromHtml).call(pf, pages);
    pf.on("flip", e => refresh(e.data));
    pf.on("changeOrientation", () => refresh(pf.getCurrentPageIndex()));
    api = {
      next: () => pf.flipNext(), prev: () => pf.flipPrev(),
      go: i => pf.flip(i), cur: () => pf.getCurrentPageIndex(),
      update: () => { try { pf.update && pf.update(); } catch (e) {} applyScale(); }
    };
    refresh(0);
  }

  /* Visionneuse de secours si la bibliothèque n'est pas disponible */
  function initFallback() {
    forcePortrait = true; layout();
    stage.innerHTML = ""; let idx = 0;
    const holder = document.createElement("div");
    holder.className = "page";
    holder.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;border-radius:6px";
    const inner = document.createElement("div");
    inner.className = "lv-scale";
    holder.appendChild(inner); stage.appendChild(holder);
    const show = i => {
      idx = Math.max(0, Math.min(TOTAL - 1, i));
      inner.innerHTML = ""; inner.appendChild(sheets[idx].cloneNode(true));
      refresh(idx);
    };
    api = { next: () => show(idx + 1), prev: () => show(idx - 1), go: i => show(i), cur: () => idx, update: applyScale };
    stage.addEventListener("click", e => { const r = stage.getBoundingClientRect(); (e.clientX - r.left > r.width / 2) ? api.next() : api.prev(); });
    show(0);
  }

  /* enregistré avant la bibliothèque : la taille du livre est mise à jour avant son propre recalcul */
  addEventListener("resize", () => { layout(); api && api.update(); });
  if (window.St && St.PageFlip) { try { initFlip(); } catch (e) { console.warn(e); initFallback(); } }
  else initFallback();
  prevBtn.addEventListener("click", () => api.prev());
  nextBtn.addEventListener("click", () => api.next());

  /* Clavier (uniquement quand le livre est visible) */
  let bookVisible = false;
  new IntersectionObserver(en => { bookVisible = en[0].isIntersecting; }, { threshold: .25 }).observe(wrap);
  addEventListener("keydown", e => {
    if (!bookVisible || /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") api.next();
    else if (e.key === "ArrowLeft") api.prev();
  });

  /* Plein écran */
  if (wrap.requestFullscreen) {
    fullBtn.hidden = false;
    fullBtn.addEventListener("click", () => document.fullscreenElement ? document.exitFullscreen() : wrap.requestFullscreen());
    document.addEventListener("fullscreenchange", () => {
      fullBtn.textContent = document.fullscreenElement ? "Quitter le plein écran" : "Plein écran";
      setTimeout(() => { layout(); api.update(); dispatchEvent(new Event("resize")); }, 60);
    });
  }

  /* PDF : fenêtre d'impression du navigateur (une page du livret par feuille) */
  $("#lv-pdf").addEventListener("click", () => window.print());

  /* =====================================================
     5. Cartes « chapitres » : ouvrir à la bonne page
     ===================================================== */
  grid.addEventListener("pointermove", e => {
    const card = e.target.closest(".cert-card"); if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-page]"); if (!b) return;
    wrap.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setTimeout(() => api.go(+b.dataset.page - 1), reduce ? 0 : 450);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".cert-card").forEach(el => io.observe(el));

  /* =====================================================
     6. Contrôle qualité : un texte qui dépasse de sa page est signalé dans la console (F12)
     ===================================================== */
  function checkOverflow() {
    sheets.forEach((s, i) => {
      const body = s.querySelector(".lv-body");
      if (!body) return;
      const over = body.scrollHeight - body.clientHeight;
      const wide = [...s.querySelectorAll("pre.lv-code, .lv-table")].some(el => el.scrollWidth > el.clientWidth + 1);
      if (over > 1) console.warn(`[Livret] Page ${i + 1} « ${titleOf(s)} » : le contenu dépasse de ${over}px. Raccourcis un texte ou coupe la page en deux.`);
      if (wide) console.warn(`[Livret] Page ${i + 1} « ${titleOf(s)} » : une ligne de code ou un tableau est trop large.`);
    });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(checkOverflow, 300));

  /* =====================================================
     7. Fond animé : réseau de nœuds
     ===================================================== */
  const cv = $("#cert-canvas"), ctx = cv.getContext("2d");
  let W, H, pts = [];
  function size() {
    const r = cv.parentElement.getBoundingClientRect();
    W = cv.width = r.width; H = cv.height = Math.min(r.height, 1600);
    const n = Math.min(Math.floor(W / 14), 90);
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fillStyle = "rgba(120,190,255,.8)"; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(61,155,255,${.28 * (1 - d / 130)})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw();
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) draw(); }, 200); });
})();