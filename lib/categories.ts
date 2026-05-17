export const CATEGORY_SLUGS = ["travel", "expat-life", "dutch-culture", "where-to-stay"] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  travel: "Travel",
  "expat-life": "Expat Life",
  "dutch-culture": "Dutch Culture",
  "where-to-stay": "Where to Stay"
};

export function categoryLabel(slug: string) {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ");
}
