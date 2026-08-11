/**
 * Rendering smoke tests against the built site.
 * Run `npm run build` first; these tests read from dist/.
 * They fail loudly if dist/ is missing so CI can't silently skip them.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dist = join(process.cwd(), "dist");

function page(path: string): string {
  return readFileSync(join(dist, path), "utf-8");
}

describe("built site", () => {
  it("has a build to test (run `npm run build` first)", () => {
    expect(
      existsSync(dist),
      "dist/ not found — run `npm run build` before `npm test`",
    ).toBe(true);
  });

  it("homepage renders hero, callout, and all four sections", () => {
    const html = page("index.html");
    expect(html).toContain("Tara Manicsic");
    expect(html).toContain("education that sticks and teams that ship");
    expect(html).toContain('id="work"');
    expect(html).toContain('id="writing"');
    expect(html).toContain('id="speaking"');
    expect(html).toContain('id="approach"');
  });

  it("a case study page renders", () => {
    const html = page("work/jamstack-explorers/index.html");
    expect(html).toContain("JAMstack Explorers");
    expect(html).toContain("Case study");
  });

  it("a writing post page renders", () => {
    const html = page("writing/ai-literacy-trust-problem/index.html");
    expect(html).toContain("trust problem");
  });

  it("the plaiy page renders its form and modes", () => {
    const html = page("plaiy/index.html");
    expect(html).toContain('id="plaiy-form"');
    expect(html).toContain("limerick");
    expect(html).toContain("rapbattle");
    expect(html).toContain("absurd");
  });

  it("no page ever contains an API key or env leakage", () => {
    for (const p of [
      "index.html",
      "plaiy/index.html",
      "work/jamstack-explorers/index.html",
    ]) {
      const html = page(p);
      expect(html).not.toContain("sk-ant-");
      expect(html).not.toContain("ANTHROPIC_API_KEY");
    }
  });
});
