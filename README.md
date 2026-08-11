# tarateaches.dev

Tara Manicsic's personal, professional portfolio — built to position for
Head of Content & Curriculum (Education) roles. Editorial design (mint field,
vermilion type, DM Serif Display), data-forward case studies, and one
deliberately fun Claude-powered feature at [`/plaiy`](#the-plaiy-feature).

**Stack:** [Astro](https://astro.build) (static output, zero JS by default) ·
vanilla CSS with custom properties, nesting, and `@layer` · Astro Content
Collections (Content Layer API, Zod-validated) · Cloudflare Pages +
Pages Functions · [Vitest](https://vitest.dev).

No Tailwind. No Vercel. On purpose.

## Local development

```bash
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

To run the `/plaiy` function locally you need Wrangler (Cloudflare's CLI),
which serves the static build _plus_ the Pages Functions:

```bash
cp .env.example .dev.vars       # then put a real key in .dev.vars (git-ignored)
npm run build
npx wrangler pages dev dist     # site + /api/plaiy at localhost:8788
```

> `.dev.vars` is Wrangler's local env file. Never commit it, never put a real
> key in `.env.example`.

## Tests

```bash
npm test           # builds the site, then runs the full Vitest suite
npm run test:unit  # unit tests only (skips the built-site smoke tests)
```

Coverage: `/plaiy` request validation, prompt construction, error handling and
secret hygiene; content utility helpers; rendering smoke tests for the
homepage, a case study, a writing post, and the `/plaiy` form.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git** and pick the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Environment variables (**Settings → Environment variables**):
   - `ANTHROPIC_API_KEY` — your Anthropic API key. **Set it as a secret in the
     dashboard (or `npx wrangler pages secret put ANTHROPIC_API_KEY`). Never
     commit a real value to this repo — not in `.env`, not in code, nowhere.**
5. (Recommended) Rate limiting for `/plaiy`: create a KV namespace
   (**Workers & Pages → KV → Create**) and bind it to the Pages project as
   `PLAIY_KV` (**Settings → Functions → KV namespace bindings**). Without the
   binding the endpoint still works, just without rate limiting.
6. Custom domain: **Custom domains → Set up** `tarateaches.dev` (DNS lives at
   Porkbun — add the CNAME Cloudflare gives you, or move the zone to
   Cloudflare for the smoothest setup).

Every push to `main` deploys production; every PR gets a preview URL
automatically.

### Analytics

Cloudflare Web Analytics is free and cookieless. Create a site under
**Analytics → Web Analytics**, copy the beacon token, and paste it into the
commented-out `<script>` in `src/layouts/Base.astro`.

## The `/plaiy` feature

`/plaiy` (play + AI) is a live-talk-energy demo: pick a mode — **limerick**,
**rap battle**, or **absurd explainer** — pick a topic, and Claude performs it
on the spot.

Architecture:

- The page is static Astro; a small vanilla `<script>` is the only client-side
  JS on the site.
- It POSTs to `/api/plaiy`, a **Cloudflare Pages Function**
  (`functions/api/plaiy.ts`) that validates input, applies KV-backed rate
  limiting (20/hour per hashed visitor), and calls Anthropic's
  `/v1/messages` server-side with `claude-haiku-4-5`.
- The persona/system prompt is hard-coded server-side; the visitor controls
  only a length-limited, sanitized topic string.
- Nothing about visitors is persisted. The rate counter stores a salted hash
  with a one-hour TTL — no raw IPs, no topics, no logs.
- v1 responds with plain JSON (no streaming); streaming is a planned
  fast-follow.

Shared, pure logic lives in `src/lib/plaiy-core.ts` so the function and the
tests exercise the exact same code.

## Project structure

```
├── functions/api/plaiy.ts    # Cloudflare Pages Function (the /plaiy API)
├── public/                   # static assets (hero photo, favicon, resume PDF)
├── src/
│   ├── components/           # Nav, Footer
│   ├── content/              # Content Collections (writing/, case-studies/)
│   ├── content.config.ts     # collection schemas (Zod)
│   ├── data/talks.json       # speaking section data
│   ├── layouts/Base.astro
│   ├── lib/                  # pure, tested helpers (content, plaiy-core)
│   ├── pages/                # index, plaiy, writing/, work/
│   └── styles/global.css     # the design system (tokens via @layer)
└── tests/                    # Vitest suites
```

## Content notes

- Blog posts in `src/content/writing/` marked with `<!-- DRAFT -->` comments
  are AI-drafted starting points — **edit them into your own words before
  sharing the site.** Same for the case study bodies in
  `src/content/case-studies/`.
- `public/resume-tara-manicsic.pdf` contains `[add dates]` placeholders —
  replace it with a finished version.
- Speaking entries live in `src/data/talks.json`; a couple of titles are
  listed generically pending confirmation.
