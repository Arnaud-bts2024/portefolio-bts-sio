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
 * Confirmation « Êtes-vous sûr de vouloir quitter ce site ? »
 * - Les liens vers d'autres sites s'ouvrent directement (nouvel onglet), sans message.
 * - Le message ne s'affiche que si l'on quitte réellement le portfolio
 *   (fermeture de l'onglet/de la fenêtre, saisie d'une autre adresse, retour vers un autre site...).
 * - Naviguer entre les pages du portfolio ne déclenche pas le message.
 */
function initLeaveConfirm() {
    let internalNavigation = false;

    // Navigation interne (menu, boutons...) : pas de message
    document.addEventListener("click", e => {
        const a = e.target.closest("a[href]");
        if (!a) return;
        let url;
        try { url = new URL(a.href, location.href); } catch { return; }
        if (url.origin !== location.origin) return;        // lien externe : géré à part
        if (a.target === "_blank" || a.hasAttribute("download")) return;
        internalNavigation = true;
        // Si la navigation est annulée (ex. Ctrl+clic), on réarme la confirmation
        setTimeout(() => { internalNavigation = false; }, 1500);
    });

    // Quitter le portfolio par inattention : demande de confirmation
    window.addEventListener("beforeunload", e => {
        if (internalNavigation) return;
        e.preventDefault();
        e.returnValue = "";   // requis par certains navigateurs pour afficher la fenêtre
    });
}
