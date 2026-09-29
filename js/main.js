/**
 * main.js - Navigation dynamique & Animations d'interface
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initCardAnimations();
});

/**
 * Génère et injecte la barre de navigation principale
 */
function initNavbar() {
    const navbarContainer = document.getElementById("navbar-container");

    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
