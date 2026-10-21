export default function initMenuMobile() {
    const menuButton = document.querySelector("[data-menu='button']");
    const menuList = document.querySelector("[data-menu='list']");

    if (!menuButton || !menuList) return;
    menuButton.closest('nav').classList.add('menu-ready');
    menuButton.addEventListener('click', openMenu);
    function closeMenu() {
        menuList.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
    }
    menuList.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuList.classList.contains('active')) { closeMenu(); menuButton.focus(); }
    });
    document.addEventListener('click', event => {
        if (!menuButton.closest('nav').contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

    function openMenu() {
        menuList.classList.toggle('active')
        menuButton.classList.toggle('active')
        const expanded = menuList.classList.contains('active');
        menuButton.setAttribute('aria-expanded', String(expanded));
        menuButton.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
    }

}
