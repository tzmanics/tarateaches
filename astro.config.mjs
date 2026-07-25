// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// Static output + Cloudflare Pages Functions (the /functions directory).
// No adapter needed: the site is fully prerendered and the /plaiy API is a
// Pages Function, which Cloudflare picks up automatically at deploy time.
export default defineConfig({
  site: "https://tarateaches.dev",
  output: "static",
  adapter: cloudflare(),
});