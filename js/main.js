/**
 * main.js - Gestion de la navigation dynamique et de l'interactivité
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

    // Structure HTML de la navigation
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
                                <li><a href="documents/cv.pdf" target="_blank" rel="noopener noreferrer">Mon CV</a></li>
                                <li><a href="projets.html">Mes TP</a></li>
                                <li><a href="https://online.fliphtml5.com/fvfkdx/uksp/" target="_blank" rel="noopener noreferrer">Mes Certifications</a></li>
                                <li><a href="stages.html">Mes Stages</a></li>
                                <li><a href="documents/tableau-de-synthese.pdf" target="_blank" rel="noopener noreferrer">Tableau de Synthèse</a></li>
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

    setActiveNavLink(navbarContainer);
}

/**
 * Détermine et applique la classe "active" sur le lien correspondant à la page courante
 * @param {HTMLElement} container - Le conteneur de la navigation
 */
function setActiveNavLink(container) {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = container.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        // Ajoute la classe active si le lien correspond à la page actuelle
        if (href === currentPath) {
            link.classList.add("active");

            // Si le lien est dans le sous-menu déroulant, met aussi en valeur le lien parent
            const parentDropdown = link.closest(".dropdown");
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector("> a");
                if (parentLink) {
                    parentLink.classList.add("active");
                }
            }
        }
    });
}
