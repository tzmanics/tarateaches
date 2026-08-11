import { describe, expect, it } from "vitest";
import {
  sortByDateDesc,
  visiblePosts,
  postHref,
  defaultMeta,
} from "../src/lib/content";

const posts = [
  { title: "old", date: new Date("2024-01-01") },
  { title: "new", date: new Date("2026-06-01") },
  { title: "middle", date: new Date("2025-06-01"), draft: true },
];

describe("sortByDateDesc", () => {
  it("sorts newest first without mutating input", () => {
    const copy = [...posts];
    const sorted = sortByDateDesc(posts);
    expect(sorted.map((p) => p.title)).toEqual(["new", "middle", "old"]);
    expect(posts).toEqual(copy);
  });
});

describe("visiblePosts", () => {
  it("hides drafts in production", () => {
    expect(visiblePosts(posts, false).map((p) => p.title)).toEqual([
      "old",
      "new",
    ]);
  });
  it("shows drafts in dev", () => {
    expect(visiblePosts(posts, true)).toHaveLength(3);
  });
});

describe("postHref", () => {
  it("prefers external URLs", () => {
    expect(
      postHref(
        {
          title: "x",
          date: new Date(),
          externalUrl: "https://example.com/post",
        },
        "x",
      ),
    ).toBe("https://example.com/post");
  });
  it("falls back to the local writing route", () => {
    expect(postHref({ title: "x", date: new Date() }, "my-post")).toBe(
      "/writing/my-post/",
    );
  });
});

describe("defaultMeta", () => {
  it("labels external posts", () => {
    expect(
      defaultMeta({
        title: "x",
        date: new Date(),
        externalUrl: "https://e.com",
      }),
    ).toBe("External ↗");
  });
  it("uses the first tag when present", () => {
    expect(
      defaultMeta({ title: "x", date: new Date(), tags: ["Curriculum"] }),
    ).toBe("New · Curriculum");
  });
  it("falls back to New", () => {
    expect(defaultMeta({ title: "x", date: new Date(), tags: [] })).toBe("New");
  });
});
