// js/stages.js — accordéon et apparition au scroll
document.addEventListener('DOMContentLoaded', () => {

    // Apparition des blocs au scroll
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('visible'));
    }

    // Accordéon (une procédure ouverte à la fois)
    const items = document.querySelectorAll('.acc-item');
    items.forEach((item) => {
        const header = item.querySelector('.acc-header');
        const panel = item.querySelector('.acc-panel');

        header.addEventListener('click', () => {
            const isOpen = header.getAttribute('aria-expanded') === 'true';

            items.forEach((other) => {
                other.classList.remove('open');
                other.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
                other.querySelector('.acc-panel').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
                setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
            }
        });
    });

    // Recalcule la hauteur du panneau ouvert si la fenêtre change de taille
    window.addEventListener('resize', () => {
        document.querySelectorAll('.acc-item.open .acc-panel').forEach((p) => {
            p.style.maxHeight = p.scrollHeight + 'px';
        });
    });
});
