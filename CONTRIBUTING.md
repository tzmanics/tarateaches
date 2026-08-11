# Contributing

Yes, it's a personal site. Conventions still make future-you's life easier.

## Branches

- `main` is production — every merge deploys.
- Work on branches named `type/short-description`:
  - `feat/plaiy-streaming`
  - `fix/hero-scrim-mobile`
  - `content/new-post-eval-design`
  - `chore/bump-astro`

Open a PR even for solo work: Cloudflare Pages gives every PR a preview URL,
which is the whole point.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), kept human:

```
feat: add streaming to /plaiy
fix: keep hero name from wrapping on ultrawide
content: draft post on assessment design
chore: bump astro to 7.x
```

Present tense, under ~70 characters, body only when the _why_ isn't obvious.

## Before you push

```bash
npm test          # build + full suite must pass
npm run check     # astro check (types in .astro files)
```

## Code style

- **CSS:** design tokens only — if a color or spacing value isn't a custom
  property in `src/styles/global.css`, it doesn't ship. Layer order is
  `tokens, base, components, layout`; page-specific styles stay scoped inside
  their `.astro` file.
- **TypeScript:** strict mode is on. Pure logic (anything worth testing) goes
  in `src/lib/`, not inline in pages or functions.
- **Formatting:** no Prettier config committed yet — if you add one, add it in
  its own `chore:` commit and format the whole repo in that same commit.
- **Dependencies:** this site's superpower is being boring. New runtime
  dependencies need a very good reason.

## Content

- New posts: add a `.md` file to `src/content/writing/` matching the schema in
  `src/content.config.ts` (build fails loudly if it doesn't — that's Zod
  doing its job).
- Set `draft: true` to keep a post out of production builds while it's
  cooking (drafts still render in `npm run dev`).

## Secrets

There is exactly one: `ANTHROPIC_API_KEY`. It lives in the Cloudflare
dashboard and in your git-ignored `.dev.vars`. If a real key ever lands in a
commit, rotate it immediately — deleting the commit is not enough.
