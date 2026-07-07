import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "../functions/api/plaiy";

const SECRET = "sk-ant-test-SECRET-value";

interface FakeKVStore {
  store: Map<string, string>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: unknown): Promise<void>;
}

function fakeKV(): FakeKVStore {
  const store = new Map<string, string>();
  return {
    store,
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value) {
      store.set(key, value);
    },
  };
}

function makeContext(body: unknown, env: Record<string, unknown> = {}) {
  const request = new Request("https://tarateaches.dev/api/plaiy", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "CF-Connecting-IP": "203.0.113.7",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return {
    request,
    env: { ANTHROPIC_API_KEY: SECRET, ...env },
  } as unknown as Parameters<typeof onRequestPost>[0];
}

function anthropicOk(text = "There once was a model named Claude…") {
  return new Response(
    JSON.stringify({ content: [{ type: "text", text }] }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/plaiy", () => {
  it("returns the generated text on the happy path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(anthropicOk("A limerick!"));
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(
      makeContext({ mode: "limerick", topic: "AI hallucinations" }),
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as { text: string };
    expect(data.text).toBe("A limerick!");
  });

  it("sends the API key only in headers, never in the body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(anthropicOk());
    vi.stubGlobal("fetch", fetchMock);

    await onRequestPost(makeContext({ mode: "limerick", topic: "embeddings" }));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe(SECRET);
    expect(String(init.body)).not.toContain(SECRET);
  });

  it("builds the request with the hard-coded system prompt and the topic", async () => {
    const fetchMock = vi.fn().mockResolvedValue(anthropicOk());
    vi.stubGlobal("fetch", fetchMock);

    await onRequestPost(
      makeContext({ mode: "absurd", topic: "context windows", register: "toddler" }),
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(init.body)) as {
      system: string;
      messages: { content: string }[];
    };
    expect(payload.system).toContain("Tara Manicsic");
    expect(payload.messages[0].content).toContain("context windows");
    expect(payload.messages[0].content).toContain("toddler");
  });

  it("rejects invalid JSON with a 400", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(makeContext("this is not json {{{"));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid mode with a 400 and never calls upstream", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(makeContext({ mode: "opera", topic: "RAG" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects oversized topics with a 400", async () => {
    const res = await onRequestPost(
      makeContext({ mode: "limerick", topic: "x".repeat(500) }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 500 when the server is missing its API key", async () => {
    const res = await onRequestPost(
      makeContext({ mode: "limerick", topic: "RAG" }, { ANTHROPIC_API_KEY: "" }),
    );
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).not.toContain(SECRET);
  });

  it("returns 502 on upstream failure without leaking upstream details", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: `key ${SECRET} invalid` } }), {
        status: 401,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(makeContext({ mode: "limerick", topic: "RAG" }));
    expect(res.status).toBe(502);
    const body = await res.text();
    expect(body).not.toContain(SECRET);
    expect(body).not.toContain("invalid");
  });

  it("returns 504 when the upstream call rejects (timeout/abort)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"));
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(makeContext({ mode: "limerick", topic: "RAG" }));
    expect(res.status).toBe(504);
  });

  it("rate limits after the hourly cap when KV is bound, storing no raw IPs", async () => {
    const fetchMock = vi.fn().mockResolvedValue(anthropicOk());
    vi.stubGlobal("fetch", fetchMock);
    const kv = fakeKV();

    let lastStatus = 0;
    for (let i = 0; i < 21; i++) {
      const res = await onRequestPost(
        makeContext(
          { mode: "limerick", topic: "RAG" },
          { PLAIY_KV: kv },
        ),
      );
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(20);
    // privacy: the visitor's IP must never appear in KV keys
    for (const key of kv.store.keys()) {
      expect(key).not.toContain("203.0.113.7");
    }
  });

  it("still works when no KV binding is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(anthropicOk());
    vi.stubGlobal("fetch", fetchMock);

    const res = await onRequestPost(makeContext({ mode: "rapbattle", topic: "RAG" }));
    expect(res.status).toBe(200);
  });
});
