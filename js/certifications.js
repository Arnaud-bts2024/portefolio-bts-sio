(() => {
  const CERTS = [
    {
      page: 5, cat: "Réseaux", icon: "🌐",
      title: "Premiers pas avec Cisco Packet Tracer",
      org: "Cisco Networking Academy", orgKey: "Cisco", date: "29 décembre 2025",
      desc: "Prise en main du simulateur réseau de Cisco : construire une topologie, configurer les équipements et tester les échanges.",
      tags: ["Simulation réseau", "Topologies", "Configuration"]
    },
    {
      page: 6, cat: "Réseaux", icon: "🌐",
      title: "CCNA : Présentation des réseaux",
      org: "Cisco Networking Academy · ERP André Maginot", orgKey: "Cisco", date: "27 mai 2026",
      desc: "Modèles OSI et TCP/IP, adressage IPv4/IPv6, Ethernet, configuration de base des commutateurs et des routeurs.",
      tags: ["OSI / TCP-IP", "Adressage IP", "Ethernet"]
    },
    {
      page: 7, cat: "Réseaux", icon: "🔀",
      title: "CCNA : Switching, Routing and Wireless Essentials",
      org: "Cisco Networking Academy · ERP André Maginot", orgKey: "Cisco", date: "4 février 2026",
      desc: "VLAN, STP, EtherChannel, routage inter-VLAN, redondance de passerelle (HSRP), sécurité du LAN et du Wi-Fi.",
      tags: ["VLAN", "STP", "HSRP", "Inter-VLAN"]
    },
    {
      page: 8, cat: "Réseaux", icon: "🛰️",
      title: "CCNA : Enterprise Networking, Security and Automation",
      org: "Cisco Networking Academy · ERP André Maginot", orgKey: "Cisco", date: "13 mai 2026",
      desc: "OSPF, listes de contrôle d'accès, NAT, VPN, qualité de service, supervision, dépannage et automatisation.",
      tags: ["OSPF", "ACL", "NAT", "VPN"]
    },
    {
      page: 9, cat: "Cybersécurité", icon: "🛡️",
      title: "Principes de cybersécurité",
      org: "Cisco Networking Academy · ERP André Maginot", orgKey: "Cisco", date: "6 mai 2026",
      desc: "Menaces, vulnérabilités et attaques, principes de protection des systèmes, des réseaux et des données.",
      tags: ["Menaces", "Vulnérabilités", "Protection"]
    },
    {
      page: 10, cat: "Cybersécurité", icon: "🔒",
      title: "Getting Started with Cybersecurity",
      org: "IBM SkillsBuild", orgKey: "IBM", date: "10 juillet 2025",
      desc: "Première approche de la cybersécurité : vocabulaire, enjeux et grands domaines de la sécurité de l'information.",
      tags: ["Initiation", "Sécurité de l'information"]
    },
    {
      page: 11, cat: "Cybersécurité", icon: "🔐",
      title: "Cybersecurity Fundamentals",
      org: "IBM SkillsBuild", orgKey: "IBM", date: "15 juillet 2025",
      desc: "Principes de défense, types de menaces et bonnes pratiques à l'usage des organisations.",
      tags: ["Défense", "Menaces", "Bonnes pratiques"]
    },
    {
      page: 12, cat: "Cybersécurité", icon: "🎓",
      title: "SecNumacadémie – MOOC de l'ANSSI",
      org: "ANSSI", orgKey: "ANSSI", date: "26 mai 2025",
      desc: "Formation officielle de l'ANSSI à l'hygiène informatique, validée par quatre évaluations (84 % à 88 %).",
      tags: ["Authentification", "Internet", "Poste de travail"]
    },
    {
      page: 13, cat: "Numérique & données", icon: "📋",
      title: "CNIL – Travail et données personnelles",
      org: "Commission nationale de l'informatique et des libertés", orgKey: "CNIL", date: "15 octobre 2025",
      desc: "Protection des données personnelles dans le cadre du travail : droits des personnes et obligations de l'organisation.",
      tags: ["RGPD", "Données personnelles"]
    },
    {
      page: 14, cat: "Numérique & données", icon: "🧩",
      title: "Certification Pix",
      org: "Pix · ESRP EPNAK Roubaix", orgKey: "Pix", date: "6 février 2026",
      desc: "Compétences numériques certifiées : niveau global Indépendant 2, 424 pix.",
      tags: ["Compétences numériques", "Sécurité", "Collaboration"]
    },
    {
      page: 15, cat: "Numérique & données", icon: "🤖",
      title: "Artificial Intelligence Fundamentals",
      org: "IBM SkillsBuild", orgKey: "IBM", date: "4 août 2025",
      desc: "Notions fondamentales de l'intelligence artificielle, de ses principaux usages et de ses enjeux.",
      tags: ["Intelligence artificielle", "Usages"]
    }
  ];

  const PAGE_ALTS = [
    "Couverture du livret de certifications",
    "Sommaire",
    "Lien avec le référentiel BTS SIO SISR",
    "Chronologie",
    ...CERTS.map(c => "Attestation : " + c.title),
    "Quatrième de couverture"
  ];

  const TOTAL = PAGE_ALTS.length;
  const IMG = n => `images/livret/page-${String(n).padStart(2, "0")}.jpg`;
  const ZOOM_STEPS = [1, 1.35, 1.65, 2, 2.5];

  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Statistiques ---------- */
  const stats = [
    [CERTS.length, "Attestations"],
    [new Set(CERTS.map(c => c.orgKey)).size, "Organismes"],
    [new Set(CERTS.map(c => c.cat)).size, "Domaines"],
    [TOTAL, "Pages à consulter"]
  ];

  $("#cert-stats").innerHTML = stats
    .map(([n, l]) => `<div class="cert-stat"><b data-n="${n}">0</b><span>${l}</span></div>`)
    .join("");

  document.querySelectorAll(".cert-stat b").forEach(el => {
    const end = +el.dataset.n;
    if (reduce) {
      el.textContent = end;
      return;
    }
    const t0 = performance.now();
    (function f(t) {
      const p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  });

  /* ---------- Livret & zoom via boutons Zoom + / Zoom - uniquement ---------- */
  const MINW = 240;
  const wrap = $("#cert-bookwrap");
  const stage = $("#cert-stage");
  const indEl = $("#cert-ind");
  const prevBtn = $("#cert-prev");
  const nextBtn = $("#cert-next");
  const zoomInBtn = $("#cert-zoom-in");
  const zoomOutBtn = $("#cert-zoom-out");
  const zoomIndEl = $("#cert-zoom-ind");

  let forcePortrait = false;
  let api = null;
  let pf = null;

  let zoomIndex = 0; // 0 = 100% au démarrage
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragOriginX = 0;
  let dragOriginY = 0;

  function clampPan() {
    const scale = ZOOM_STEPS[zoomIndex];
    if (scale <= 1) {
      panX = 0;
      panY = 0;
      return;
    }
    const maxX = Math.max(0, (stage.offsetWidth * (scale - 1)) / 2);
    const maxY = Math.max(0, (stage.offsetHeight * (scale - 1)) / 2);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
  }

  function applyBookZoom(nextIndex) {
    zoomIndex = Math.max(0, Math.min(ZOOM_STEPS.length - 1, nextIndex));
    const scale = ZOOM_STEPS[zoomIndex];

    if (scale === 1) {
      panX = 0;
      panY = 0;
      stage.style.transform = "";
      stage.classList.remove("is-zoomed", "is-dragging");
    } else {
      clampPan();
      stage.style.transform = `translate(${Math.round(panX)}px, ${Math.round(panY)}px) scale(${scale})`;
      stage.classList.add("is-zoomed");
    }

    zoomIndEl.textContent = `${Math.round(scale * 100)}%`;
    zoomOutBtn.disabled = zoomIndex === 0;
    zoomInBtn.disabled = zoomIndex === ZOOM_STEPS.length - 1;
  }

  function layout() {
    const availW = wrap.clientWidth - 32;
    const maxH = Math.max(480, innerHeight - 210);
    const portrait = forcePortrait || availW < 2 * MINW;
    let w, h;
    if (portrait) {
      w = Math.min(availW, maxH * 0.75, 640);
      h = w * 4 / 3;
    } else {
      w = Math.min(availW, maxH * 1.5, 1260);
      h = w / 1.5;
    }
    stage.style.width = Math.round(w) + "px";
    stage.style.height = Math.round(h) + "px";
  }

  function label(i) {
    if (i <= 0) return "Couverture";
    if (i >= TOTAL - 1) return "Quatrième de couverture";
    const landscape = pf && pf.getOrientation && pf.getOrientation() === "landscape";
    if (!landscape) return `Page ${i + 1} / ${TOTAL}`;
    const left = i % 2 === 1 ? i : i - 1;
    return `Pages ${left + 1}–${left + 2} / ${TOTAL}`;
  }

  function refresh(i) {
    indEl.textContent = label(i);
    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= TOTAL - 1;
  }

  function buildPages() {
    stage.innerHTML = "";
    return PAGE_ALTS.map((alt, k) => {
      const d = document.createElement("div");
      d.className = "page";
      if (k === 0 || k === TOTAL - 1) d.setAttribute("data-density", "hard");
      const im = new Image();
      im.src = IMG(k + 1);
      im.alt = alt;
      im.draggable = false;
      im.decoding = "async";
      d.appendChild(im);
      stage.appendChild(d);
      return d;
    });
  }

  function initFlip() {
    layout();
    const pages = buildPages();
    pf = new St.PageFlip(stage, {
      width: 600,
      height: 800,
      size: "stretch",
      minWidth: MINW,
      maxWidth: 720,
      minHeight: 320,
      maxHeight: 960,
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.45,
      flippingTime: reduce ? 1 : 850,
      drawShadow: true,
      startPage: 0
    });
    (pf.loadFromHTML || pf.loadFromHtml).call(pf, pages);
    pf.on("flip", e => refresh(e.data));
    pf.on("changeOrientation", () => refresh(pf.getCurrentPageIndex()));
    api = {
      next: () => pf.flipNext(),
      prev: () => pf.flipPrev(),
      go: i => pf.flip(i),
      cur: () => pf.getCurrentPageIndex(),
      update: () => { try { pf.update && pf.update(); } catch (e) {} }
    };
    refresh(0);
    applyBookZoom(0);
  }

  function initFallback() {
    forcePortrait = true;
    layout();
    stage.innerHTML = "";
    let idx = 0;
    const im = new Image();
    im.style.cssText = "width:100%;height:100%;display:block;border-radius:6px;background:#fff";
    stage.appendChild(im);
    const show = i => {
      idx = Math.max(0, Math.min(TOTAL - 1, i));
      im.src = IMG(idx + 1);
      im.alt = PAGE_ALTS[idx];
      refresh(idx);
    };
    api = {
      next: () => show(idx + 1),
      prev: () => show(idx - 1),
      go: i => show(i),
      cur: () => idx,
      update: () => {}
    };
    show(0);
    applyBookZoom(0);
  }

  addEventListener("resize", () => {
    layout();
    clampPan();
    api && api.update();
  });

  if (window.St && St.PageFlip) {
    try { initFlip(); } catch (e) { console.warn(e); initFallback(); }
  } else {
    initFallback();
  }

  zoomInBtn.addEventListener("click", () => {
    applyBookZoom(zoomIndex + 1);
  });

  zoomOutBtn.addEventListener("click", () => {
    applyBookZoom(zoomIndex - 1);
  });

  // Glisser-déplacer uniquement quand un zoom est actif
  stage.addEventListener("mousedown", e => {
    if (ZOOM_STEPS[zoomIndex] <= 1) return;
    isDragging = true;
    dragOriginX = e.clientX - panX;
    dragOriginY = e.clientY - panY;
    stage.classList.add("is-dragging");
  });

  addEventListener("mousemove", e => {
    if (!isDragging) return;
    panX = e.clientX - dragOriginX;
    panY = e.clientY - dragOriginY;
    clampPan();
    stage.style.transform = `translate(${Math.round(panX)}px, ${Math.round(panY)}px) scale(${ZOOM_STEPS[zoomIndex]})`;
  });

  addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove("is-dragging");
  });

  prevBtn.addEventListener("click", () => {
    applyBookZoom(0);
    api.prev();
  });

  nextBtn.addEventListener("click", () => {
    applyBookZoom(0);
    api.next();
  });

  let bookVisible = false;
  new IntersectionObserver(en => {
    bookVisible = en[0].isIntersecting;
  }, { threshold: .25 }).observe(wrap);

  addEventListener("keydown", e => {
    if (!bookVisible || /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") {
      applyBookZoom(0);
      api.next();
    } else if (e.key === "ArrowLeft") {
      applyBookZoom(0);
      api.prev();
    } else if (e.key === "Escape" && zoomIndex > 0) {
      applyBookZoom(0);
    }
  });

  /* ---------- Filtres + cartes ---------- */
  const cats = ["Tout", ...new Set(CERTS.map(c => c.cat))];
  const filters = $("#cert-filters");
  const grid = $("#cert-grid");

  filters.innerHTML = cats
    .map((c, i) => `<button class="cert-chip${i === 0 ? " active" : ""}" data-cat="${c}" type="button">${c}</button>`)
    .join("");

  grid.innerHTML = CERTS.map(c => `
    <article class="cert-card" data-cat="${c.cat}" data-page="${c.page}">
      <div class="cert-top">
        <div class="cert-icon" aria-hidden="true">${c.icon}</div>
        <span class="cert-badge">✔ Obtenue</span>
      </div>
      <div>
        <div class="cert-org cert-mono">${c.org}</div>
        <h3>${c.title}</h3>
      </div>
      <p>${c.desc}</p>
      <div class="cert-tags">${c.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <div class="cert-foot">
        <span class="cert-mono">${c.date}</span>
        <button class="cert-btn" type="button" data-page="${c.page}">Voir dans le livret</button>
      </div>
    </article>`).join("");

  grid.addEventListener("pointermove", e => {
    const card = e.target.closest(".cert-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  grid.addEventListener("click", e => {
    const card = e.target.closest(".cert-card");
    if (!card) return;
    const pageNum = +(card.dataset.page || e.target.closest("[data-page]")?.dataset.page);
    if (!pageNum) return;

    applyBookZoom(0);
    wrap.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setTimeout(() => {
      api.go(pageNum - 1);
    }, reduce ? 0 : 350);
  });

  filters.addEventListener("click", e => {
    const b = e.target.closest(".cert-chip");
    if (!b) return;
    filters.querySelectorAll(".cert-chip").forEach(x => x.classList.toggle("active", x === b));
    grid.querySelectorAll(".cert-card").forEach(card => {
      const show = b.dataset.cat === "Tout" || card.dataset.cat === b.dataset.cat;
      card.classList.toggle("hide", !show);
      if (show) card.classList.add("in");
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll(".cert-card").forEach(el => io.observe(el));

  /* ---------- Fond animé : réseau de nœuds ---------- */
  const cv = $("#cert-canvas");
  const ctx = cv.getContext("2d");
  let W, H, pts = [];

  function size() {
    const r = cv.parentElement.getBoundingClientRect();
    W = cv.width = r.width;
    H = cv.height = Math.min(r.height, 1600);
    const n = Math.min(Math.floor(W / 14), 90);
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      if (!reduce) {
        p.x += p.vx;
        p.y += p.vy;
      }
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, 7);
      ctx.fillStyle = "rgba(120,190,255,.8)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(61,155,255,${.28 * (1 - d / 130)})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  size();
  draw();

  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      size();
      if (reduce) draw();
    }, 200);
  });
})();
