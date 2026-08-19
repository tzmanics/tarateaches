# Image previews

One optional image per case study. Writing posts and talks have no images —
their cards are text only, and talks link straight out to the video or repo.

Treatment is the **bleed wash**: the photo washes into the slab colour behind a
scrim that carries the type, no hover motion, wash kept on mobile.

## Authoring

Files live in `src/content/case-studies/images/`, referenced relative to the
markdown file:

```yaml
image: ./images/jamstack-explorers.png
imagePosition: "82% 50%" # optional focal point, any CSS object-position
uiShot: true # optional, for text-heavy screenshots
```

`imagePosition` defaults to `50% 45%`. `uiShot` dims, greyscales, blurs, and
scales the image so UI copy inside it stops reading as body text.

**A missing file fails the build.** The collection uses Astro's `image()`
helper, which validates the path at build time — add the frontmatter and the
image in the same commit.

## Status

Landed: JAMstack Explorers, `jamstack-explorers.png` at focus `82% 50%`.

Still needed, five case studies: `template-team.png` (focus `72% 40%`),
`women-who-code.jpg` on `community-cincinnati.md` (focus `50% 42%`),
`bespoke-ai.png` (wants `uiShot: true`), `witchai.png` (focus `60% 18%`),
`rhythm.png` (focus `74% 22%`).

Higher-resolution JAMstack Explorers alternates exist if the blog header crops
badly: `jamstack.webp` (2290x1188) and `jamstackexplorers.avif` (2868x1192).

## Checks before merge

- Slabs without an image render exactly as they did before.
- Contrast: the scrim carries legibility, not the photo. If a photo is very
  light, lower the `--wash` transparency rather than dimming type.
- 899px and 760px: photos stack behind text, nothing clipped.
- `npm test` and `npm run check`.
