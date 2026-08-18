/**
 * Cloudflare Worker entry: serves the prerendered site from Workers Assets.
 * The site is fully static, so every request is handed straight to ASSETS.
 */
interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
