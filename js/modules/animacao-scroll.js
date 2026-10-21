export default function initAnimationScroll() {
    const sections = document.querySelectorAll("[data-anime='js-scroll']");
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animation');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    sections.forEach(section => { section.classList.add('reveal-pending'); observer.observe(section); });
}
