/**
 * Astro-side glue for the Writing collection. The pure, unit-tested pieces
 * live in ./content — this just wires them to astro:content.
 */
import { getCollection } from "astro:content";
import { sortByDateDesc, visiblePosts } from "./content";

/** Writing posts ready for listing: newest first, drafts only in dev. */
export async function getWritingPosts() {
  const all = await getCollection("writing");
  return sortByDateDesc(
    visiblePosts(
      all.map((p) => ({ ...p.data, id: p.id })),
      import.meta.env.DEV,
    ),
  );
}
