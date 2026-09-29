/**
 * main.js - Navigation dynamique & Animations d'interface
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initCardAnimations();
});

// Racine du site :
//  - "/" si ton site est sur https://TON-PSEUDO.github.io/
//  - "/NOM-DU-REPO/" si c'est un site de projet (https://TON-PSEUDO.github.io/NOM-DU-REPO/)
const BASE = "/";

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
                        <li><a href="${BASE}index.html">Accueil</a></li>
                        <li class="dropdown">
                            <a href="${BASE}bts-sio.html">BTS-SIO</a>
                            <ul class="submenu">
                                <li><a href="${BASE}sisr.html">Option SISR</a></li>
                                <li><a href="${BASE}slam.html">Option SLAM</a></li>
                            </ul>
                        </li>
                        <li><a href="${BASE}parcours.html">Mon parcours</a></li>
                        <li><a href="${BASE}projets.html">Projets</a></li>
                        <li><a href="${BASE}veille.html">Veille</a></li>
                        <li><a href="${BASE}contact.html">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    `;

    // Met en surbrillance la page courante
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navbarContainer.querySelectorAll(".main-nav a").forEach(link => {
        if (link.getAttribute("href").split("/").pop() === currentPage) {
            link.classList.add("active");
        }
    });
}

/**
 * Fait apparaître les cartes au scroll
 */
function initCardAnimations() {
    const cards = document.querySelectorAll(".sio-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
}
