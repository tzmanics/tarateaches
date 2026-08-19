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

  it("homepage renders hero, callout, and all three sections", () => {
    const html = page("index.html");
    expect(html).toContain("Tara Manicsic");
    expect(html).toContain("turning technical complexity into something");
    expect(html).toContain('id="building"');
    expect(html).toContain('id="writing"');
    expect(html).toContain('id="speaking"');
  });

  it("a case study page renders", () => {
    const html = page("work/jamstack-explorers/index.html");
    expect(html).toContain("JAMstack Explorers");
    expect(html).toContain("Case study");
  });

  it("a writing post page renders", () => {
    const html = page("writing/ai-literacy-trust-problem/index.html");
    expect(html).toContain("human agency");
  });

  it("the writing section links out to the Netlify blog posts", () => {
    const html = page("writing/index.html");
    expect(html).toContain("https://www.netlify.com/blog/");
    expect(html).toContain("Netlify Blog");
  });

  it("drafted posts stay out of the production build", () => {
    expect(
      existsSync(join(dist, "writing/processes-for-the-process-averse")),
    ).toBe(false);
  });

  it("no page ever contains an API key or env leakage", () => {
    for (const p of [
      "index.html",
      "writing/index.html",
      "work/jamstack-explorers/index.html",
    ]) {
      const html = page(p);
      expect(html).not.toContain("sk-ant-");
      expect(html).not.toContain("ANTHROPIC_API_KEY");
    }
  });
});
