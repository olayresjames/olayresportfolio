# Olayres Portfolio

Rafhael James Olayres' portfolio, built with Vite and React.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run lint
npm run test
npm run build
npm run preview
```

Pull requests to `main` run lint, tests, and a production build in GitHub Actions.

## Image assets

WebP versions are generated from their PNG, JPG, and GIF sources with:

```bash
npm run optimize:images
```

Keep the source files and generated WebP files together so browsers without WebP support can use the originals.

Portfolio content lives in `src/data/siteData.js`. Static images, certificates, and the resume are served from `public/resources`.

The existing case-study URLs are preserved:

- `/agapai-case-study.html`
- `/foliofy-case-study.html`
