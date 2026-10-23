# v28 verification

Completed:
- JavaScript syntax checks for the first-party scripts.
- Eight focused mocked playback scenarios: successful autoplay and pause/resume; blocked mobile playback; desktop one-click retry; reduced motion; scroll/tab visibility; stalled startup timeout; cancellation when leaving the opening; unexpected browser pause.
- MP4 encoding completed with H.264 Main Level 4.0, yuv420p, 24fps, no audio, and metadata before media data for progressive startup.
- Static checks for referenced assets, duplicate CSS selectors within each media scope, and side-gap calculations.
- Local HTTP server returned 200 for the new page.

Limitations:
- The preview browser could not attach during this update, so the new visual result has not received a fresh browser screenshot review. The earlier v27 browser review does not count as verification of v28.
- Mocked playback tests validate the control/fallback logic, not iPhone hardware or Safari's media policy. Test the hosted preview on an actual iPhone before replacing your main homepage.
- The original fixed-canvas tablet/text scaling is preserved; this update applies the requested pink side-fill treatment, not a broader responsive redesign.

Suggested visual checks: 1920×842 and 1440×500 (pink outside video); 1440×810 (no side gaps); 393×852 and 320×568 (no pink side panels); top of page, mid-intro scroll, first project transition, and desktop contact outro.
