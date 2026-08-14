/**
 * Cloudflare Worker entry: serves the prerendered site from Workers Assets
 * and routes POST /api/plaiy to the same handler the Pages Function exports,
 * so the API logic (and its tests) live in exactly one place.
 */
import { onRequestPost } from "../functions/api/plaiy";

interface Env {
  ANTHROPIC_API_KEY: string;
  PLAIY_KV?: KVNamespace;
  PLAIY_RATE_LIMIT?: string;
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/plaiy" && request.method === "POST") {
      // The handler only reads `request` and `env` from the Pages context.
      return onRequestPost({ request, env } as unknown as Parameters<
        typeof onRequestPost
      >[0]);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
