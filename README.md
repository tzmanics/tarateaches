# tarateaches.dev

Tara Manicsic's personal, professional portfolio — built to position for
Head of Content & Curriculum (Education) roles. Editorial design (mint field,
vermilion type, DM Serif Display) and data-forward case studies.

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
