# Website Demo Collection

Three complete, responsive concept websites with a shared showcase.

Live collection: https://wasanmsngg-wq.github.io/demo-web-project/

- [Morrow Café](https://wasanmsngg-wq.github.io/demo-web-project/demos/cafe/) — café menu, story, hours, and local photography.
- [Northline Studio](https://wasanmsngg-wq.github.io/demo-web-project/demos/corporate/) — business services, project detail dialogs, and a validated demo inquiry form.
- [Alex / Studio](https://wasanmsngg-wq.github.io/demo-web-project/demos/portfolio/) — creative portfolio with project detail dialogs.

All businesses, people, project examples, addresses, and results are fictional. The inquiry form confirms locally and never submits or stores visitor details. There is no booking, payment, analytics, or backend service.

## Local development

Requires Node.js 22 or newer. The site and build have no runtime dependencies.

```sh
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:8000. Rebuild after changing source files.

## Browser verification

With Google Chrome installed, run `npm test` while the preview server is running. Playwright checks the collection and all three demos at 375, 768, and 1440 pixels, including horizontal overflow, missing assets, navigation state, project dialogs, and inquiry validation. Full-page screenshots are saved in `test-results/`.

For hosted verification: set `DEMO_BASE_URL` to the collection URL before running the same command. Browser tests use generated example input only.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the site and deploys only `dist/` after pushes to `main`. In repository Settings → Pages, the source must be **GitHub Actions**. The workflow follows the [official GitHub Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Relative asset paths support hosting under the repository subdirectory. If renaming the repository, update the collection URLs in this document and the return link in `404.html`.

## Assets and project notes

Café photographs are hosted locally; original image references and license details are in `assets/images/CREDITS.md`. Graphics on the showcase, business, and portfolio pages are HTML/CSS.

Existing freelance planning documents and promotional thumbnails are kept locally. They are excluded from the website build and initial public repository. The browser screenshots in `test-results/` are actual captures of the completed demos.
