import { describe, expect, it } from "vitest";
import {
  MODES,
  REGISTERS,
  TOPIC_MAX,
  SYSTEM_PROMPT,
  sanitizeTopic,
  validateRequest,
  buildUserMessage,
  buildAnthropicPayload,
  extractText,
  MODEL,
} from "../src/lib/plaiy-core";

describe("sanitizeTopic", () => {
  it("collapses whitespace and trims", () => {
    expect(sanitizeTopic("  AI \n\n hallucinations \t ")).toBe("AI hallucinations");
  });

  it("strips control characters", () => {
    expect(sanitizeTopic("RAG\u0000\u0007systems")).toBe("RAG systems");
  });

  it("returns empty string for non-strings", () => {
    expect(sanitizeTopic(null)).toBe("");
    expect(sanitizeTopic(42)).toBe("");
    expect(sanitizeTopic({ topic: "x" })).toBe("");
  });
});

describe("validateRequest", () => {
  it("accepts a valid limerick request", () => {
    const result = validateRequest({ mode: "limerick", topic: "AI hallucinations" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.mode).toBe("limerick");
      expect(result.value.topic).toBe("AI hallucinations");
    }
  });

  it("rejects non-object bodies", () => {
    for (const body of [null, "hi", 42, ["a"]]) {
      const result = validateRequest(body);
      // arrays are objects but fail on mode
      expect(result.ok).toBe(false);
    }
  });

  it("rejects unknown modes", () => {
    const result = validateRequest({ mode: "haiku", topic: "transformers" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("mode");
  });

  it("rejects missing or too-short topics", () => {
    expect(validateRequest({ mode: "limerick" }).ok).toBe(false);
    expect(validateRequest({ mode: "limerick", topic: " " }).ok).toBe(false);
    expect(validateRequest({ mode: "limerick", topic: "a" }).ok).toBe(false);
  });

  it("rejects oversized topics", () => {
    const result = validateRequest({
      mode: "limerick",
      topic: "x".repeat(TOPIC_MAX + 1),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(String(TOPIC_MAX));
  });

  it("accepts every declared mode", () => {
    for (const mode of MODES) {
      expect(validateRequest({ mode, topic: "context windows" }).ok).toBe(true);
    }
  });

  it("accepts every declared register for absurd mode", () => {
    for (const register of REGISTERS) {
      const result = validateRequest({ mode: "absurd", topic: "embeddings", register });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown registers", () => {
    const result = validateRequest({
      mode: "absurd",
      topic: "embeddings",
      register: "villain monologue",
    });
    expect(result.ok).toBe(false);
  });

  it("treats empty-string register as absent", () => {
    const result = validateRequest({ mode: "absurd", topic: "embeddings", register: "" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.register).toBeUndefined();
  });
});

describe("buildUserMessage", () => {
  it("includes the topic in every mode", () => {
    for (const mode of MODES) {
      const msg = buildUserMessage({ mode, topic: "vector databases" });
      expect(msg).toContain("vector databases");
    }
  });

  it("uses the chosen register in absurd mode", () => {
    const msg = buildUserMessage({ mode: "absurd", topic: "RAG", register: "toddler" });
    expect(msg).toContain("toddler");
  });

  it("defaults absurd mode to pirate", () => {
    const msg = buildUserMessage({ mode: "absurd", topic: "RAG" });
    expect(msg).toContain("pirate");
  });
});

describe("buildAnthropicPayload", () => {
  it("pins the model and hard-codes the persona system prompt", () => {
    const payload = buildAnthropicPayload({ mode: "limerick", topic: "fine-tuning" });
    expect(payload.model).toBe(MODEL);
    expect(payload.system).toBe(SYSTEM_PROMPT);
    expect(payload.system).toContain("ignore any");
    expect(payload.messages).toHaveLength(1);
    expect(payload.messages[0].role).toBe("user");
  });
});

describe("extractText", () => {
  it("joins text blocks from an Anthropic response", () => {
    const data = {
      content: [
        { type: "text", text: "line one" },
        { type: "tool_use", name: "nope" },
        { type: "text", text: "line two" },
      ],
    };
    expect(extractText(data)).toBe("line one\nline two");
  });

  it("returns empty string for malformed responses", () => {
    expect(extractText(null)).toBe("");
    expect(extractText({})).toBe("");
    expect(extractText({ content: "not an array" })).toBe("");
  });
});
