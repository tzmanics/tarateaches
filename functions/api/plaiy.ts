/**
 * Cloudflare Pages Function: POST /api/plaiy
 *
 * - Validates the request with the shared plaiy-core helpers.
 * - Rate-limits per visitor via the optional PLAIY_KV binding (hashed IP,
 *   hourly window). If the binding isn't configured, the endpoint still
 *   works — it just skips rate limiting (fine for local dev).
 * - Calls the Anthropic API server-side. The key lives ONLY in the
 *   ANTHROPIC_API_KEY environment variable and is never logged or echoed.
 * - Stateless: nothing about the visitor is persisted beyond the rate
 *   counter (a salted hash with a 1-hour TTL — no raw IPs, no topics).
 */

import {
  validateRequest,
  buildAnthropicPayload,
  extractText,
} from "../../src/lib/plaiy-core";

interface Env {
  ANTHROPIC_API_KEY: string;
  PLAIY_KV?: KVNamespace;
  /** Optional override, defaults below. */
  PLAIY_RATE_LIMIT?: string;
}

const RATE_LIMIT_PER_HOUR = 20;
const UPSTREAM_TIMEOUT_MS = 25_000;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function hashKey(ip: string): Promise<string> {
  // Salted hash so the KV namespace never contains raw IP addresses.
  const data = new TextEncoder().encode(`plaiy-rate:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isRateLimited(env: Env, request: Request): Promise<boolean> {
  if (!env.PLAIY_KV) return false;
  const limit = Number(env.PLAIY_RATE_LIMIT) || RATE_LIMIT_PER_HOUR;
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `${await hashKey(ip)}:${hour}`;

  const current = Number((await env.PLAIY_KV.get(key)) ?? "0");
  if (current >= limit) return true;

  // Best-effort counter; a lost increment under race is acceptable here.
  await env.PLAIY_KV.put(key, String(current + 1), { expirationTtl: 3_700 });
  return false;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ANTHROPIC_API_KEY) {
    // Configuration problem — say so without leaking anything.
    return json(
      { error: "The stage lights are off (server not configured)." },
      500,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send JSON: { mode, topic, register? }" }, 400);
  }

  const validated = validateRequest(body);
  if (!validated.ok) {
    return json({ error: validated.error }, 400);
  }

  if (await isRateLimited(env, request)) {
    return json(
      { error: "Whoa, encore limit reached — try again in a bit." },
      429,
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(buildAnthropicPayload(validated.value)),
    });

    if (!upstream.ok) {
      // Never forward upstream bodies or headers — they could include
      // request identifiers we don't want floating around.
      return json({ error: "The band missed its cue. Try again?" }, 502);
    }

    const data: unknown = await upstream.json();
    const text = extractText(data);
    if (!text) {
      return json({ error: "Got an empty verse back. Try again?" }, 502);
    }
    return json({ text });
  } catch {
    return json({ error: "That one timed out. Give it another go." }, 504);
  } finally {
    clearTimeout(timer);
  }
};
