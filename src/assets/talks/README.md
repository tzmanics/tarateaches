# Talk preview images

One image per entry in `src/data/talks.json`. The `image` field is just the
file name; it is resolved through `import.meta.glob` in `src/pages/index.astro`
so the files still go through `astro:assets`.

- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.avif`, `.webp` — the name in
  `talks.json` must match the file exactly, extension included.
- A missing file is not a build error: the card just renders without a preview.

See `docs/image-previews.md` for the full authoring guide.
