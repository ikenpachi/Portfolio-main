import initAnimationScroll from './modules/animacao-scroll.js';
import initMenuMobile from './modules/menu-mobile.js';
import initMenuTransition from './modules/menu-transition.js';
import initScrollSuave from './modules/scroll-suave.js';
import initTyping from './modules/typing.js';
import initInteractiveCyberCanvas from './modules/interactive-cyber-canvas.js';
import initActiveNavigation from './modules/active-navigation.js';

// Start the globe independently: another enhancement must not blank the Hero.
let cyberCanvas = initInteractiveCyberCanvas();
for (const initialize of [initScrollSuave, initAnimationScroll, initTyping, initMenuTransition, initMenuMobile, initActiveNavigation]) {
  try { initialize(); }
  catch (error) { console.error(`Failed to initialize ${initialize.name}:`, error); }
}
window.addEventListener('pagehide', () => cyberCanvas?.destroy());
window.addEventListener('pageshow', event => {
  if (event.persisted) cyberCanvas = initInteractiveCyberCanvas();
});
