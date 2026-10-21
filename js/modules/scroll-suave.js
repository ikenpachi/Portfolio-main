export default function initScrollSuave() {
    const linksInternos = document.querySelectorAll("[data-menu='suave'] a[href^='#']");

    function scrollToSection(event) {
        event.preventDefault();
        const href = event.currentTarget.getAttribute("href");
        const section = document.querySelector(href);
        if (!section) return;
        // Some browsers reject History API writes on file:// previews.
        try { history.replaceState(null, '', href); } catch (error) {}
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
        section.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
        });
    }
    
    linksInternos.forEach((link) => {
        link.addEventListener('click', scrollToSection)
    })
}
