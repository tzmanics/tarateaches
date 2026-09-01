# tarateaches.dev

Tara Manicsic's personal, professional portfolio, built to position for
Head of Content & Curriculum (Education) roles. Monochrome editorial design
with a single neon accent, and data-forward case studies.

**Stack:** [Astro](https://astro.build) (static output, zero JS by default) ·
vanilla CSS with custom properties, nesting, and `@layer` · Astro Content
Collections (Content Layer API, Zod-validated) · Cloudflare Workers with
static assets · [Vitest](https://vitest.dev).

No Tailwind. No Vercel. On purpose.

## Local development

```bash
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

## Tests

```bash
npm test           # builds the site, then runs the full Vitest suite
npm run test:unit  # unit tests only (skips the built-site smoke tests)
```

Coverage: content utility helpers (sorting, draft filtering, external-post
links); rendering smoke tests for the homepage, a case study, a writing post,
and secret hygiene in the built output.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git** and pick the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Custom domain: **Custom domains → Set up** `tarateaches.dev` (DNS lives at
   Porkbun — add the CNAME Cloudflare gives you, or move the zone to
   Cloudflare for the smoothest setup).

Every push to `main` deploys production; every PR gets a preview URL
automatically.

### Analytics

Cloudflare Web Analytics is free and cookieless. Create a site under
**Analytics → Web Analytics**, copy the beacon token, and paste it into the
commented-out `<script>` in `src/layouts/Base.astro`.

## Project structure

```
├── public/                   # static assets (hero photo, favicon, resume PDF)
├── src/
│   ├── components/           # Nav, Footer
│   ├── content/              # Content Collections (writing/, case-studies/)
│   ├── content.config.ts     # collection schemas (Zod)
│   ├── data/talks.json       # speaking section data
│   ├── layouts/Base.astro
│   ├── lib/                  # pure, tested helpers (content, posts)
│   ├── pages/                # index, writing/, work/
│   └── styles/global.css     # the design system (tokens via @layer)
├── worker/index.ts           # Cloudflare Worker: serves the built assets
└── tests/                    # Vitest suites
```

## Style guide

Monochrome with one accent. Every colour routes through a token in
`@layer tokens`. No component declares a raw hex.

### Tokens

| Token           | Value     | Role                                         |
| --------------- | --------- | -------------------------------------------- |
| `--mint`        | `#ececeb` | Page ground                                  |
| `--paper`       | `#f5f5f4` | Light panel, and text on dark grounds        |
| `--ink`         | `#141414` | Body text, deep ground, hairlines            |
| `--surface-mid` | `#3a3a39` | Second dark ground, separates adjacent slabs |
| `--muted`       | `#6a6a68` | Eyebrows, meta, captions                     |
| `--neon`        | `#00ffaa` | Hover and focus only. Never a resting state. |

`--red` and `--red-deep` both resolve to `--ink`. The names are historical: the
system already routed through them, so the move to monochrome changed values,
not call sites. Treat them as aliases and prefer `--ink` in new code.
`--askew` is unused; delete it if you touch the token block.

Post pages carry a parallel set (`--greige`, `--noir`, `--noir-body`,
`--noir-soft`) scoped to `body.post-page`.

### Type

| Token            | Face             | Use                                          |
| ---------------- | ---------------- | -------------------------------------------- |
| `--font-display` | DM Serif Display | Section headings, slab titles, `.display`    |
| `--font-didone`  | Playfair Display | Post titles and post `h2`, wide-tracked caps |
| `--font-body`    | Archivo          | Body copy, UI, all tracked labels            |

- Uppercase display type tracks from `0.06em` (post `h2`) to `0.16em` (post
  titles). When centring, add a matching `text-indent` so the trailing
  letter-space does not pull the optical centre left.
- Tracked labels (`.eyebrow`, `.meta`, bylines) are Archivo 600/700,
  `0.6rem` to `0.72rem`, `0.16em` to `0.3em` tracking.
- Body copy is `0.94rem` at `1.85`, justified with `hyphens: auto` in post
  columns, left-aligned below `760px` where justification breaks down.

### Layers

Order is declared once at the top of `global.css`:
`@layer tokens, base, components, layout`.

| Layer        | Holds                                                      |
| ------------ | ---------------------------------------------------------- |
| `tokens`     | Custom properties only                                     |
| `base`       | Element defaults, `:focus-visible`, reduced-motion         |
| `components` | Reusable classes (`.pill`, `.hair-grid`, `.slab`, `.duo`)  |
| `layout`     | Page shells (`.nav`, `.section`, `.prose`, `.site-footer`) |

Page-specific rules belong in that page's scoped `<style>`, not `global.css`.
One exception: anything targeting markdown output (`.prose *`) must be global,
because Astro scoping does not reach rendered content.

### Space and measure

`--space-1` `0.5rem`, `--space-2` `1rem`, `--space-3` `2rem`,
`--space-4` `3.5rem`, `--space-5` `6rem`. No arbitrary spacing values.

Breakpoints in use: `760px` (mobile), `899px` (case study grids), `1100px`
(three-column posts). Do not add a fourth without cause.

Post body columns are 3 above `1100px`, 2 above `761px`, 1 below. `h2` carries
`column-span: all` so the article reads as blocks between headings. Column
spacing uses `margin-bottom`, never `margin-top`, so column heads stay flush.

### Interaction

One rule governs this section: **hue never carries state.** The site has a
single chromatic value, and red-green colour vision deficiency affects roughly
1 in 12 men. Every state change must survive as luminance or shape.

| Surface                | Ground | Hover                                          |
| ---------------------- | ------ | ---------------------------------------------- |
| Grid card titles       | Light  | Neon swipe grows `0` to `100%` behind ink text |
| Case study slab titles | Dark   | Neon underline at `0.07em`, title colour held  |
| Post prose links       | Light  | Neon swipe behind text, underline darkens      |
| Footer links           | Dark   | Neon text, underline to `3px`                  |

Focus is a doubled ring: `3px` neon outline plus a `6px` `--ink` box-shadow.
Neon vanishes on light grounds and ink vanishes on dark, so one half always
has contrast.

### Contrast budget

AA minimums: `4.5:1` body text, `3:1` large text and graphical indicators.
Current measurements:

| Pair                         | Ratio   |
| ---------------------------- | ------- |
| `--ink` on `--mint`          | 15.58:1 |
| `--muted` on `--mint`        | 4.59:1  |
| `--noir-body` on `--greige`  | 10.44:1 |
| `--paper` on `--ink`         | 16.89:1 |
| `--paper` on `--surface-mid` | 10.44:1 |
| `--ink` on `--neon`          | 13.93:1 |
| `--neon` on `--ink`          | 13.93:1 |
| `--neon` on `--surface-mid`  | 8.61:1  |

`--muted` at `4.59:1` is the tightest pair in the system. Do not lighten it.

### Adding to the system

1. Reuse a token. If none fits, question whether the component is actually new.
2. A new colour needs a contrast check against every ground it can land on,
   plus protanopia, deuteranopia, and tritanopia simulation if it signals state.
3. Never let colour be the only cue. Pair it with weight, underline, size, or
   position.
4. Leave `prefers-reduced-motion` alone. `global.css` already zeroes
   transitions and animations globally.
5. Run `npm run build` before pushing. Lightning CSS surfaces syntax errors the
   editor misses.

## Content notes

- Posts in `src/content/writing/` with `draft: true` are AI-drafted starting
  points, hidden in production and visible in `npm run dev`. **Edit them into
  your own words, then drop the flag to publish.** Same for the case study
  bodies in `src/content/case-studies/`, which are live and still carry
  `<!-- DRAFT -->` comments.
- `ai-literacy-trust-problem.md` is published but still an outline with
  placeholder headings. Finish it or set `draft: true`.
- The Netlify posts are external links (`externalUrl` in frontmatter); their
  cards link straight out to the Netlify blog.
- `public/resume-tara-manicsic.pdf` contains `[add dates]` placeholders —
  replace it with a finished version.
- Speaking entries live in `src/data/talks.json`; a couple of titles are
  listed generically pending confirmation.
