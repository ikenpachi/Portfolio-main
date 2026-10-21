(function () {
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var saved;
  try { saved = localStorage.getItem('corrosivo-theme'); } catch (error) {}
  if (saved !== 'light' && saved !== 'dark') saved = undefined;
  function apply(theme) {
    root.dataset.theme = theme;
    var button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      button.textContent = theme === 'dark' ? '◐ CLARO' : '◑ ESCURO';
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#09121C' : '#EAF4F5';
  }
  apply(saved === 'light' || saved === 'dark' ? saved : system.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', function () {
    apply(root.dataset.theme);
    document.querySelector('[data-theme-toggle]').hidden = false;
    document.querySelector('[data-theme-toggle]').addEventListener('click', function () {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(saved);
      try { localStorage.setItem('corrosivo-theme', saved); } catch (error) {}
    });
  });
  function followSystem(event) { if (!saved) apply(event.matches ? 'dark' : 'light'); }
  if (system.addEventListener) system.addEventListener('change', followSystem);
  else system.addListener(followSystem);
})();
