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
npm run lint:css
npm run typecheck
npm run test
npm run build
npm run preview
```

Pull requests to `main` run JavaScript and CSS linting, data type checks, tests, and a production build in GitHub Actions.

The type check currently covers the shared portfolio and case-study data modules. Page-wide JavaScript typing can be added incrementally.

## Image assets

WebP versions are generated from their PNG, JPG, and GIF sources with:

```bash
npm run optimize:images
```

Keep the source files and generated WebP files together so browsers without WebP support can use the originals.

Shared portfolio content lives in `src/data/siteData.js`; full case-study content lives in `src/data/caseStudyData.js`. Static images, certificates, and the current resume are served from `public/resources`.

The case-study pages are available at:

- `/point-nemo-case-study.html`
- `/legend-of-cee-case-study.html`
- `/pnp-idtms-case-study.html`
- `/agapai-case-study.html`
- `/foliofy-case-study.html`
