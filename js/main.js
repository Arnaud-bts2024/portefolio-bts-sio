document.addEventListener("DOMContentLoaded", function () {
    // Charge la barre de navigation depuis navbar.html
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;

            // Ajoute automatiquement la classe "active" sur l'onglet correspondant à la page actuelle
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            const navLinks = document.querySelectorAll(".main-nav a");

            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentPage) {
                    link.classList.add("active");
                }
            });
        })
        .catch(error => console.error("Erreur lors du chargement de la navbar :", error));
});
