'use strict';

// The opening loop is independent of the scroll-controlled intro video.
// Autoplay is an attempt, never an assumption: blocked phones keep the poster.
window.createIdleLoop = ({ video, button, reduced, isMobile, onChange }) => {
  let userPaused = false;
  let blocked = false;
  let hasPlayed = false;
  let pending = false;
  let attempt = 0;
  let timer;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const eligible = () => scrollY < 2 && !reduced.matches && !document.hidden;
  const syncControl = () => {
    const playing = !video.paused && !blocked;
    button.textContent = playing ? 'Pause animation' : 'Play animation';
    button.setAttribute('aria-label', button.textContent + ' on opening');
    button.hidden = reduced.matches || (isMobile() && (blocked || !hasPlayed));
  };
  const cancelPending = () => {
    clearTimeout(timer);
    if (pending) attempt++;
    pending = false;
  };
  const usePoster = () => {
    cancelPending();
    blocked = true;
    video.pause();
    video.classList.add('failed');
    syncControl();
    onChange();
  };

  function update() {
    syncControl();
    if (!eligible() || userPaused) {
      cancelPending();
      video.pause();
      return;
    }
    if (blocked || pending || !video.paused) return;

    pending = true;
    const currentAttempt = ++attempt;
    // A slow/stalled load must not leave a misleading mobile control behind.
    timer = setTimeout(() => {
      if (currentAttempt === attempt && eligible()) usePoster();
    }, 10000);

    video.play().then(() => {
      if (currentAttempt !== attempt) return;
      clearTimeout(timer);
      pending = false;
      syncControl();
    }).catch(error => {
      if (currentAttempt !== attempt) return;
      clearTimeout(timer);
      pending = false;
      // Scrolling away or hiding the tab can interrupt an in-flight play().
      if (error.name === 'AbortError' && !eligible()) return;
      usePoster();
    });
  }

  video.addEventListener('playing', () => {
    if (!eligible() || userPaused) {
      video.pause();
      return;
    }
    clearTimeout(timer);
    pending = false;
    blocked = false;
    hasPlayed = true;
    video.classList.remove('failed');
    syncControl();
    onChange();
  });
  video.addEventListener('pause', () => {
    // An unexpected browser pause at the opening uses the same static fallback.
    if (eligible() && !userPaused && !pending && !blocked) {
      usePoster();
      return;
    }
    syncControl();
  });
  video.addEventListener('error', usePoster);
  video.addEventListener('canplay', update);
  button.addEventListener('click', () => {
    if (!video.paused && !blocked) {
      userPaused = true;
    } else {
      userPaused = false;
      blocked = false;
      video.classList.remove('failed');
    }
    update();
    onChange();
  });

  // Native autoplay may already have started before this deferred script runs.
  hasPlayed = !video.paused && video.readyState >= 2;
  if (reduced.matches) video.autoplay = false;
  syncControl();
  return { update, get isStatic() { return blocked || reduced.matches; } };
};
