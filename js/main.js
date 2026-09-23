document.addEventListener("DOMContentLoaded", function () {
    const navbarHTML = `
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
                            <li><a href="projets.html">Mes TP</a></li>
                            <li><a href="bts-sio.html">Mes Certifications</a></li>
                            <li><a href="stages.html">Mes Stages</a></li>
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

    const navContainer = document.getElementById("navbar-container");
    if (navContainer) {
        navContainer.innerHTML = navbarHTML;
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
