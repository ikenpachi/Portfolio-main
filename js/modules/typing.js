export default function initTyping() {
    const name = document.querySelector('.principal__sentence');
    if (!name || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Keep the complete name available to assistive technology and without JS.
    name.classList.add('name-reveal');
}
