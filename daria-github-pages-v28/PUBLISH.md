# Publish to GitHub Pages

You can use the existing repository or a new one. For a first iPhone check, a preview subfolder in the existing repository is convenient and leaves the current homepage available.

## Option A — preview inside the current portfolio repository

1. Open the branch/folder currently used to publish your `portfolio` repository (check Settings → Pages). If Pages uses a GitHub Actions workflow, place the files inside the directory that workflow actually deploys.
2. Create a folder named `preview-v28` inside that publishing source.
3. Upload the CONTENTS of `daria-github-pages-v28` into `preview-v28`, including `index.html`, all JS/CSS, `assets/`, and `vendor/`.
4. Commit and wait for the Pages deployment to finish. Leave the existing Pages publishing source unchanged.
5. Visit `https://webdesignwithdaria.github.io/portfolio/preview-v28/`.

The existing homepage remains at `https://webdesignwithdaria.github.io/portfolio/`.
Do not select `preview-v28` as a branch publishing source: GitHub's branch settings support `/` or `/docs`; the preview is a normal subfolder of the existing published site.

## Option B — replace the current homepage

Upload this folder's CONTENTS into the current Pages publishing source, replacing the matching files and adding `idle-loop.js` and `assets/idle-v28.mp4`. Keep `assets/` and `vendor/` as folders. Do not nest the entire v28 folder unless you want a subfolder URL. The homepage URL remains the same.

## Option C — new repository

1. Create a repository such as `portfolio-v28` (public is simplest for GitHub Pages).
2. Upload this folder's CONTENTS to the repository root, with `index.html` directly at the root.
3. Include the empty `.nojekyll` file. Finder may hide it; press Command+Shift+. to show hidden files.
4. Open Settings → Pages → Build and deployment → Deploy from a branch.
5. Select your branch, usually `main`, and `/(root)`, then Save.
6. After deployment, visit `https://webdesignwithdaria.github.io/portfolio-v28/`.

If uploading from the browser, upload the unzipped files, not the ZIP itself. The ZIP is only a convenient way to store/transfer the folder.

## First device check

On an iPhone, open the new URL at the top of the page. With ordinary playback settings, check that the loop moves and Pause/Play works. With playback blocked or Reduce Motion enabled, expect a still image and no mobile animation control. Scroll through the opening transition and projects as before.

Browser settings can prevent autoplay; the static fallback is intentional. Actual iPhone playback has not been verified on a physical device during this update.

Official GitHub documentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
