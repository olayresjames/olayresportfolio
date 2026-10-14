---
name: Frontend
description: Vite + React frontend workflow for this portfolio, covering routing, data, state, styling, forms, accessibility, performance, SEO, and verification
---

## Workflow

1. Map the request to the smallest affected route, component, hook, or asset before editing.
2. Read `package.json`, Vite config, router setup, and existing data/effect patterns first.
3. Keep changes scoped and composable; avoid introducing global patterns for local problems.
4. Preserve the project's existing conventions for imports, naming, styling, and state ownership.
5. Handle loading, empty, error, and reduced-motion states where the UI needs them.
6. Run the narrowest useful verification first, then lint/build before declaring done.
7. Report the change, relevant commands run, and any manual checks still needed.

## Project conventions

- Entry point: `src/main.jsx`; app shell/providers/router live in `src/App.jsx`.
- Route pages: `src/pages` or `src/routes`; reusable UI: `src/components`; hooks: `src/hooks`; data/lib: `src/data` or `src/lib`.
- Follow existing folder and naming patterns; do not reorganize unrelated files during a feature change.
- Keep CSS in the project's existing stylesheet/token system; avoid introducing a competing styling approach.

## Vite + React practices

### React patterns

- Keep components focused: render UI, delegate side effects to hooks, and lift state only when multiple consumers need it.
- Use `useState` for local UI state, `useReducer` for complex local state transitions, and context only for genuinely shared app-wide state.
- Fetch route data inside the route boundary or a dedicated data hook; do not fetch during render.
- Use `React.lazy` + `Suspense` for route-level code splitting; keep small components eager.
- Keep `key` semantics stable for lists; use item IDs, not array indexes, when order or membership can change.
- Avoid effect chains that duplicate server state; derive values during render when possible.

### State management

- Local UI state lives in the component unless another consumer needs it.
- Shared client state uses the smallest context/store boundary that fits; do not default to global stores for page-local concerns.
- Server/data state is owned by a consistent data-fetching pattern (loader/hook/query), not scattered ad hoc effects.

### Effects and lifecycle

- Treat `useEffect` for synchronization with external systems, subscriptions, and imperative APIs — not as a render workaround.
- Clean up listeners, subscriptions, requests, and animation frames.
- Debounce or throttle expensive work such as resize handlers, scroll handlers, search inputs, and drag updates.
- Prefer CSS transitions/animations for visual state changes; reserve JS animation for choreography or non-CSS properties.

### Routing

- Use `react-router-dom` route definitions for page boundaries and nested layouts.
- Wrap page content with `Suspense` plus a route-consistent loading fallback.
- Keep error boundaries at route boundaries so one page failure does not blank the app.
- Preserve scroll behavior and focus management when navigating between routes.
- Use route params/query for page state where appropriate; keep URLs shareable and meaningful.

### Data loading

- Fetch at route boundaries or in dedicated hooks; avoid fetching in child render paths unless necessary.
- Model data states explicitly: `loading`, `success`, `empty`, `error`.
- Cache/dedupe requests at the data layer; do not refetch the same data across components without a reason.
- Keep route/data dependencies in sync with React Router lifecycle.

### Forms and validation

- Use controlled inputs with clear accessible labels and fieldset/legend for groups.
- Show inline errors tied to inputs (`aria-describedby`) and summarize errors when helpful.
- Handle submission states: idle, submitting, success, error.
- Validate client-side for UX, but treat server/source-of-truth validation as authoritative.

### Styling and assets

- Follow the project's existing styling system first: CSS files, CSS modules, design tokens, or a component library.
- Use semantic class names and CSS custom properties for theme/dark mode rather than duplicating values.
- Keep mobile-first responsive styles; verify 320px, tablet, desktop, and wide layouts when the change is layout-sensitive.
- Optimize images: prefer modern formats, explicit dimensions, `srcset`/`sizes` for responsive images, lazy loading below the fold.
- Respect `prefers-reduced-motion` for nonessential animation and provide a visible static fallback.

### Icons

- Prefer `lucide-react` for icons when it is available in the project; check `package.json` first and ask before adding a new dependency.
- Avoid emojis in UI copy and controls; use Lucide icons or text labels instead for a consistent, accessible interface.
- Import icons individually (`import { ArrowRight } from 'lucide-react'`) rather than importing the whole library.
- Keep icons decorative by default (`aria-hidden="true"`) unless the icon alone conveys meaning; pair meaningful icons with visible text or an accessible name.
- Size icons consistently with the design system and inherit color via `currentColor` when appropriate.

### Design system / theming

- Use existing design tokens for color, spacing, typography, radius, and elevation.
- Support light/dark themes through CSS variables and the project's theme mechanism.
- Keep motion consistent: duration, easing, and entrance/exit patterns should follow existing conventions.
- Do not introduce one-off colors, spacing, or typography scales without extending the token system.

## Accessibility

- Use semantic HTML (`header`, `main`, `nav`, `button`, `dialog`, form labels) before custom ARIA roles.
- Ensure keyboard operability for menus, modals, tabs, and custom widgets.
- Keep focus visible and manage focus for route changes and dynamic content updates.
- Provide accessible names, contrast, text alternatives, and live-region announcements where appropriate.
- Test custom interactions with keyboard-only flows and screen-reader-relevant markup; do not rely on ARIA to fix non-semantic structure.

## Performance

- Avoid unnecessary re-renders with stable props, memoized expensive values/components only when measured, and narrowed context boundaries.
- Bundle-split route-level code and heavy libraries.
- Watch for large dependencies, duplicated requests, layout thrashing, and excessive DOM depth.
- Use Vite build warnings and bundle analysis when diagnosing size issues.
- Keep initial page payload small; lazy-load below-the-fold assets and heavy UI.

## SEO and metadata

- Give each route a meaningful document title and meta description where applicable.
- Maintain Open Graph/Twitter metadata for shareable pages.
- Use semantic headings and meaningful link text.
- Keep canonical URLs and route metadata consistent with the site structure.

## Verification

Run the narrowest relevant check first:

```sh
npm run lint
npm run build
```

If tests exist, run focused tests before the full suite:

```sh
npm test -- path/to/file
```

For UI changes, add or update tests for behavior and accessibility-critical interactions. Use browser/manual QA for visual, responsive, keyboard, and motion cases.

### Manual QA checklist

- [ ] Mobile, tablet, desktop, and wide layouts
- [ ] Keyboard focus order and visible focus
- [ ] Loading, empty, and error states
- [ ] Reduced-motion behavior
- [ ] Touch targets and interactive spacing
- [ ] Browser check for primary target browsers
- [ ] No console errors or React warnings

## Deliverables

When implementing UI:

- Component markup and behavior.
- Route/layout integration where relevant.
- Scoped styling or design-token usage.
- Loading/empty/error states.
- Accessibility and reduced-motion notes.
- Focused verification commands run.
- A short manual QA checklist for responsive, keyboard, and browser checks.
