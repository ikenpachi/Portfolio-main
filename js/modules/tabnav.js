export default function initTabNav() {
  const tabMenu = document.querySelectorAll("[data-tab='menu'] li");
  const tabContent = document.querySelectorAll("[data-tab='content'] section");

  if (tabMenu.length && tabContent.length) {
    tabContent[0].parentElement.classList.add('tabs-ready');
    tabMenu[0].parentElement.setAttribute('role', 'tablist');
    tabMenu[0].parentElement.setAttribute('aria-label', 'Trajetória profissional');
    tabMenu[0].parentElement.setAttribute('aria-orientation', 'vertical');
    tabMenu.forEach((tab, index) => {
      tab.id = `experience-tab-${index}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `experience-panel-${index}`);
      tabContent[index].id = `experience-panel-${index}`;
      tabContent[index].setAttribute('role', 'tabpanel');
      tabContent[index].setAttribute('aria-labelledby', tab.id);
      tabContent[index].tabIndex = 0;
    });

    function activeTab(index) {
      tabContent.forEach((content) => {
        content.classList.remove("active");
      });
      const direction = tabContent[index].dataset.anime;
      tabContent[index].classList.add("active", direction);

      tabMenu.forEach((content) => {
        content.classList.remove("active");
      });
      tabMenu[index].classList.add("active");
      tabMenu.forEach((tab, tabIndex) => {
        tab.setAttribute('aria-selected', String(tabIndex === index));
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
    }

    tabMenu.forEach((item, index) => {
      item.addEventListener("click", () => {
        activeTab(index);
      });
      item.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabMenu.length;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabMenu.length) % tabMenu.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabMenu.length - 1;
        else if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault(); activeTab(next); tabMenu[next].focus();
      });
    });
    activeTab(0);
  }
}
