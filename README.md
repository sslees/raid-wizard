# RAID Wizard

Compare RAID configurations side by side: usable capacity, cost, drive failure behavior, and expansion options.

## Development

```bash
npm install
npm run dev
```

Open the local dev server URL shown in the terminal.

## Tests

```bash
npm test
```

## Production build (GitHub Pages)

```bash
npm run build
```

This writes the static site to `docs/` with `base: /raid/` for project-page hosting.

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages setup

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/docs`**.
5. Save. The site will be available at `https://<username>.github.io/raid/`.

The build copies `public/.nojekyll` into `docs/` so Jekyll does not process the output.

## Project structure

```
src/
├── calculator/     # Pure RAID math and guidance (unit tested)
├── components/     # UI components
├── hooks/          # React state
└── format.ts       # Shared display formatters
docs/               # Production build output (committed for GitHub Pages)
```
