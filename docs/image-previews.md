# Image previews

One designated image per case study, per writing post, per talk. Authored in
frontmatter (or `talks.json`); the components do the rest. Treatment is the
approved **bleed wash** — full-colour photo washed into the slab colour, no
hover motion, wash kept on mobile.

## Where the files go

| Kind         | Directory                          | Referenced as                         |
| ------------ | ---------------------------------- | ------------------------------------- |
| Case study   | `src/content/case-studies/images/` | `image: ./images/name.png`            |
| Writing post | `src/content/writing/images/`      | `image: ./images/name.png`            |
| Talk         | `src/assets/talks/`                | `"image": "name.jpg"` in `talks.json` |

**Case studies and posts fail the build if the file is missing.** The content
collections use Astro's `image()` helper, which validates the path at build
time — add the frontmatter and the file in the same commit. Talks are the
exception: they resolve through `import.meta.glob`, so a missing file just
means that card renders without a preview.

## Frontmatter

```yaml
image: ./images/jamstack-explorers.png
imagePosition: "82% 50%" # optional focal point, any CSS object-position
uiShot: true # optional; case studies only, for text-heavy screenshots
```

`imagePosition` defaults to `50% 45%` on slabs and `50% 55%` in grid cells.
`uiShot` dims, greyscales, blurs, and scales the image so the UI copy inside it
stops reading as body text.

## Assets: what's in, what's missing

**Landed:**

| Card                                       | File                                      | Source                         |
| ------------------------------------------ | ----------------------------------------- | ------------------------------ |
| JAMstack Explorers (red)                   | `jamstack-explorers.png`, focus `82% 50%` | Netlify blog header, 1440x589  |
| The Economic Case for Generative AI (talk) | `talks-generative-ai.jpeg`                | Compose session card, 1280x720 |

**Still needed** — paste the frontmatter into the named file **at the same time**
as you add the image, or the build breaks:

| Card                                               | File                        | Frontmatter to add                                                                        |
| -------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| Template Team (ink)                                | `template-team.png`         | `image: ./images/template-team.png`<br>`imagePosition: "72% 40%"`                         |
| Women Who Code (paper) — `community-cincinnati.md` | `women-who-code.jpg`        | `image: ./images/women-who-code.jpg`<br>`imagePosition: "50% 42%"`                        |
| Bespoke AI (paper)                                 | `bespoke-ai.png`            | `image: ./images/bespoke-ai.png`<br>`uiShot: true`                                        |
| witchai.dev (red)                                  | `witchai.png`               | `image: ./images/witchai.png`<br>`imagePosition: "60% 18%"`                               |
| Rhythm (ink)                                       | `rhythm.png`                | `image: ./images/rhythm.png`<br>`imagePosition: "74% 22%"`                                |
| Netlify + Astro post                               | `writing-netlify-hugo.jpeg` | Unassigned — the available shot is Netlify + **Hugo**, 480x360, and no post is about Hugo |

Talk filenames are already listed in `src/data/talks.json`; drop matching files
into `src/assets/talks/` and they light up one at a time. Six of the seven talks
still have no image.

Higher-resolution JAMstack Explorers alternates exist if the blog header crops
badly: `jamstack.webp` (2290x1188) and `jamstackexplorers.avif` (2868x1192) are
the same astronaut on the light platform background; there is also a dark
"Your Missions" grid shot that would want `uiShot: true`.

## Checks before merge

- Cards without an image render exactly as they did before.
- Contrast on every slab: the scrim carries legibility, not the photo. If a
  photo is very light, lower the `--wash` transparency rather than dimming type.
- 899px and 760px: photos stack under/behind text, nothing clipped.
- `npm test` and `npm run check`.
