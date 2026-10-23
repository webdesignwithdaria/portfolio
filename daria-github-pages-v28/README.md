# Daria portfolio — v28

A complete static website, ready for GitHub Pages. No npm install or build is needed.

## Changes

- Pink side panels (`#ffe6ee`) fill only the empty space beside the desktop opening and closing video canvases. They have zero width when the canvas fills the screen and do not appear in the mobile layout. The video crop, scroll sequence, text sizes, and project layout are preserved.
- The opening loop now uses native muted inline autoplay and an H.264 Main Level 4.0, 1080p/24fps MP4 with no audio and fast-start metadata. The old file declared Level 5.0. The new clip is approximately 329 KiB rather than 556 KiB.
- Playback controls follow actual playback. When mobile autoplay is blocked, fails, or does not start within 10 seconds, the opening uses its still image and hides Play/Pause. There are no repeated background playback retries. Reduced Motion also uses the still image and hides the control.
- When playback works, Play/Pause remains available. Its text is black at 30% opacity, including on iPhone. The control itself has full opacity, avoiding compounded transparency.
- CSS is expanded into readable component rules and consolidated desktop/mobile sections. Superseded declarations and repeated identical media-query blocks are removed.
- The scroll-controlled intro and outro clips are unchanged.

## Files

- `index.html`: page structure and versioned script/style links.
- `style.css`: visual styles. `--pink` controls the side-panel color.
- `app.js`: existing scroll composition and project behavior.
- `idle-loop.js`: opening-loop playback, controls, and static fallback.
- `text-motion.js`: existing text animation.
- `projects-data.js`: editable project copy and links; keep this developer-controlled because it includes HTML.
- `assets/`, `vendor/`: all required local media, fonts, and GSAP.
- `PUBLISH.md`: hosting instructions for a new repository or the current repository.
- `TESTING.md`: checks completed and remaining device verification.

All asset paths are relative, so the same files work at a repository root or in a preview subfolder. Keep the directory structure intact. The original v27 folder has not been edited.

## Local preview

From this folder, run `python3 -m http.server 8000` and visit `http://localhost:8000/`. GitHub hosting does not need Python.
