/**
 * Small, pure helpers for the Writing section.
 * Kept framework-free so they are trivially unit-testable.
 */

export interface PostLike {
  title: string;
  date: Date;
  draft?: boolean;
  externalUrl?: string;
}

/** Newest first. Does not mutate the input. */
export function sortByDateDesc<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Drafts are hidden in production builds but visible in dev. */
export function visiblePosts<T extends PostLike>(posts: T[], isDev: boolean): T[] {
  return isDev ? posts : posts.filter((p) => !p.draft);
}

/** Where a post's card should link: its own page, or out to an external home. */
export function postHref(post: PostLike & { id?: string }, slug: string): string {
  return post.externalUrl ?? `/writing/${slug}/`;
}

/** "New · Curriculum"-style label if none provided in frontmatter. */
export function defaultMeta(post: PostLike & { tags?: string[] }): string {
  if (post.externalUrl) return "External ↗";
  const tag = post.tags?.[0];
  return tag ? `New · ${tag}` : "New";
}
