/**
 * constellation.js - Fond « constellation » discret pour la page d'accueil
 * Points qui dérivent lentement, reliés par des lignes fines quand ils
 * sont proches. Le curseur attire doucement quelques lignes.
 */
(function () {
    const canvas = document.getElementById("constellation");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Réglages : modifie ces valeurs pour ajuster l'ambiance
    const COLOR = "56, 189, 248";   // même bleu que --primary
    const DENSITY = 11000;          // plus grand = moins de points
    const MAX_POINTS = 110;
    const LINK_DISTANCE = 140;      // distance max d'une ligne entre 2 points
    const MOUSE_DISTANCE = 170;
    const SPEED = 0.18;             // vitesse de dérive (zen = lent)

    let width, height, points = [];
    const mouse = { x: null, y: null };
    let rafId = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(MAX_POINTS, Math.round((width * height) / DENSITY));
        points = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * SPEED * 2,
            vy: (Math.random() - 0.5) * SPEED * 2,
            r: Math.random() * 1.2 + 0.6,
            phase: Math.random() * Math.PI * 2   // scintillement doux
        }));
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);

        for (const p of points) {
            if (!reduceMotion) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;
            }
            const twinkle = 0.55 + 0.35 * Math.sin(time / 1800 + p.phase);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR}, ${twinkle})`;
            ctx.shadowColor = `rgba(${COLOR}, 0.8)`;
            ctx.shadowBlur = 6;
            ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Lignes entre points proches
        ctx.lineWidth = 0.7;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < LINK_DISTANCE) {
                    ctx.strokeStyle = `rgba(${COLOR}, ${(1 - dist / LINK_DISTANCE) * 0.35})`;
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
            // Lignes vers le curseur
            if (mouse.x !== null) {
                const mx = points[i].x - mouse.x;
                const my = points[i].y - mouse.y;
                const md = Math.hypot(mx, my);
                if (md < MOUSE_DISTANCE) {
                    ctx.strokeStyle = `rgba(${COLOR}, ${(1 - md / MOUSE_DISTANCE) * 0.5})`;
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        if (!reduceMotion) rafId = requestAnimationFrame(draw);
    }

    function start() {
        if (rafId === null) rafId = requestAnimationFrame(draw);
    }

    function stop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    // Pause quand l'onglet n'est pas visible (économie de batterie)
    document.addEventListener("visibilitychange", () => {
        if (reduceMotion) return;
        document.hidden ? stop() : start();
    });

    resize();
    if (reduceMotion) draw(0); else start();
})();
