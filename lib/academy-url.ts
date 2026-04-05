import slugify from "slugify";
import type { NavigationSection } from "@/lib/types";

export const WELCOME_EPISODE_SLUG = "welcome";

export const episodeSlugFromVideoName = (name: string): string =>
  slugify(name, { lower: true, strict: true });

export const buildAcademyPath = (
  sectionId: string,
  episodeSlug: string
): string => {
  const params = new URLSearchParams({ section: sectionId, episode: episodeSlug });
  return `/?${params.toString()}`;
};

export const findSubcategoryNameByEpisodeSlug = (
  section: NavigationSection,
  episodeSlug: string
): string | null => {
  const match = section.subcategories?.find(
    (sub) => episodeSlugFromVideoName(sub.name) === episodeSlug
  );
  return match?.name ?? null;
};
