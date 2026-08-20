/**
 * Global Audio Manager
 * Handles persistent BGM playback (30% vol) and UI click SFX (80% vol).
 */
(function () {
  // Config
  const BGM_PATH = 'assets/bg.mp3';
  const CLICK_PATH = 'assets/click.mp3';
  const BGM_VOLUME = 0.1;   // 10% Volume
  const CLICK_VOLUME = 0.4; // 40% Volume

  // 1. Initialize Background Music
  const bgm = new Audio(BGM_PATH);
  bgm.loop = true;
  bgm.volume = BGM_VOLUME;

  // Restore playback timestamp across page transitions
  const savedTime = parseFloat(sessionStorage.getItem('bgm_currentTime'));
  if (!isNaN(savedTime) && savedTime > 0) {
    bgm.currentTime = savedTime;
  }

  // Attempt Autoplay
  function startBGM() {
    bgm.play().then(() => {
      // Remove interaction listener once playing successfully
      window.removeEventListener('pointerdown', startBGM);
      window.removeEventListener('keydown', startBGM);
    }).catch(() => {
      // Autoplay blocked by browser policy; wait for first user interaction
      window.addEventListener('pointerdown', startBGM, { once: true });
      window.addEventListener('keydown', startBGM, { once: true });
    });
  }

  // Preserve playback position before changing pages
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('bgm_currentTime', bgm.currentTime.toString());
  });

  // Start BGM on script execution
  startBGM();

  // 2. Initialize Click Sound Effect (SFX)
  const clickSfx = new Audio(CLICK_PATH);
  clickSfx.volume = CLICK_VOLUME;

  function playClickSound() {
    clickSfx.currentTime = 0; // Reset sound to start for fast repeated clicks
    clickSfx.play().catch(() => {});
  }

  // Event Delegation: Trigger SFX on any button, link, or interactive UI element
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a, .menu-btn, [role="button"]');
    if (target) {
      playClickSound();
    }
  }, true);
})();
