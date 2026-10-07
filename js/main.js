document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <header class="site-header">
            <nav class="nav-container main-nav">
                <ul>
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="bts-sio.html">BTS-SIO</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-trigger">Mon parcours ▾</a>
                        <ul class="submenu">
                            <li><a href="cv.html">Mon CV</a></li>
                            <li><a href="tp.html">Mes TP</a></li>
                            <li><a href="certifications.html">Mes Certifications</a></li>
                            <li><a href="stages.html">Mes Stages</a></li>
                            <li><a href="synthese.html">Tableau de Synthèse</a></li>
                        </ul>
                    </li>
                    <li><a href="projets.html">Projets</a></li>
                    <li><a href="veille.html">Veille</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </nav>
        </header>
    `;

    // Active le lien correspondant à la page actuelle
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = navbarContainer.querySelectorAll('a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdown-trigger').classList.add('active');
            }
        }
    });
});
