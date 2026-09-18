/* ==========================================================================
   ANIMATIONS DISCRÈTES ET ACCESSIBILITÉ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Vérification des préférences utilisateur concernant les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Animation au survol des cartes
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
            });
        });

        // Intersection Observer pour faire apparaître les sections au défilement
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Ajout de .contact-form-section pour animer aussi le formulaire
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .page-header, .contact-form-section');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            observer.observe(el);
        });
    }
});
