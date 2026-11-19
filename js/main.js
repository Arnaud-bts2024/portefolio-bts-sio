/**
 * main.js - Navigation dynamique & Gestion globale
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initLeaveConfirm();
});

/**
 * Génère et injecte la barre de navigation principale
 */
function initNavbar() {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <header class="site-header">
            <div class="nav-container">
                <nav class="main-nav">
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="bts-sio.html">BTS-SIO</a></li>
                        <li class="dropdown">
                            <a href="parcours.html">Mon parcours</a>
                            <ul class="submenu">
                                <li><a href="cv.html">Mon CV</a></li>
                                <li><a href="tp.html">Mes TP</a></li>
                                <li><a href="certifications.html">Mes Certifications</a></li>
                                <li><a href="stages.html">Mes Stages</a></li>
                                <li><a href="images/tbl_de_synthèse/tableau.png" target="_blank">Tableau de Synthèse</a></li>
                            </ul>
                        </li>
                        <li><a href="projets.html">Projet</a></li>
                        <li><a href="veille.html">Veille</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    `;

    // Met en surbrillance la page courante dans le menu
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navbarContainer.querySelectorAll(".main-nav > ul > li > a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

/**
 * Fenêtre « Êtes-vous sûr de vouloir quitter ce site ? » (liens externes uniquement)
 */
function initLeaveConfirm() {
    // Style de la fenêtre
    const style = document.createElement("style");
    style.textContent = `
        .leave-overlay {
            position: fixed; inset: 0; z-index: 99999;
            display: none; align-items: center; justify-content: center;
            background: rgba(2, 6, 20, .7); backdrop-filter: blur(4px);
        }
        .leave-overlay.open { display: flex; }
        .leave-box {
            width: min(92vw, 420px); padding: 28px; border-radius: 18px;
            background: #0b1534; border: 1px solid rgba(90, 150, 255, .3);
            color: #e8eefc; font-family: 'Space Grotesk', system-ui, sans-serif;
            text-align: center; box-shadow: 0 30px 80px rgba(0, 20, 80, .6);
        }
        .leave-box h2 { margin: 0 0 8px; font-size: 1.3rem; }
        .leave-box p { margin: 0 0 22px; color: #9fb2d8; font-size: .95rem; word-break: break-all; }
        .leave-actions { display: flex; gap: 12px; justify-content: center; }
        .leave-actions button, .leave-actions a {
            padding: 10px 26px; border-radius: 999px; font: inherit; font-weight: 700;
            cursor: pointer; text-decoration: none; border: 1px solid rgba(90, 150, 255, .3);
        }
        .leave-yes { background: linear-gradient(100deg, #3d9bff, #00e0ff); color: #04122e; border-color: transparent !important; }
        .leave-no { background: transparent; color: #e8eefc; }
    `;
    document.head.appendChild(style);

    // Fenêtre
    const overlay = document.createElement("div");
    overlay.className = "leave-overlay";
    overlay.innerHTML = `
        <div class="leave-box" role="dialog" aria-modal="true" aria-labelledby="leave-title">
            <h2 id="leave-title">Êtes-vous sûr de vouloir quitter ce site ?</h2>
            <p id="leave-url"></p>
            <div class="leave-actions">
                <a class="leave-yes" id="leave-yes" target="_blank" rel="noopener noreferrer">Oui</a>
                <button class="leave-no" id="leave-no" type="button">Non</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const yes = overlay.querySelector("#leave-yes");
    const no = overlay.querySelector("#leave-no");
    const urlText = overlay.querySelector("#leave-url");
    const close = () =>
