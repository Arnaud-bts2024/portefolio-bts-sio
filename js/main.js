/**
 * main.js - Navigation dynamique & Gestion globale
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
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
                                <li><a href="documents/cv.pdf" target="_blank">Mon CV</a></li>
                                <li><a href="projets.html" target="_blank">Mes TP</a></li>
                                <li><a href="https://online.fliphtml5.com/fvfkdx/uksp/" target="_blank">Mes Certifications</a></li>
                                <li><a href="stages.html" target="_blank">Mes Stages</a></li>
                                <li><a href="documents/tableau-de-synthese.pdf" target="_blank">Tableau de Synthèse</a></li>
                            </ul>
                        </li>
                        <li><a href="projets.html">Projets</a></li>
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
