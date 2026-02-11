import { BookOpen } from "lucide-react";
import type { NavigationSection } from "@/lib/types";

export const navigationSections: NavigationSection[] = [
  {
    id: "how-to-use-writestack",
    title: "How to Use WriteStack",
    icon: BookOpen,
    welcomeVideoId: "88ab5f2c64984f65817386e5f8a555f8",
    subcategories: [
      { name: "Enhance Notes Generation", videoId: "7107a24668a4420bb279121640bbee47" },
      { name: "Master Activity Center", videoId: "e07702a006104b5eaeb61b8194d7ee60" },
      { name: "Organize WriteStack Notes", videoId: "98d27b6d1bac4878a24970bfbfffce75" },
      { name: "Use WriteStack Analytics", videoId: "3a8ef8a9f6d84c7a84166f74f286772b" },
      { name: "Generate Personalized Notes", videoId: "41e975405c544f779e60602ab9e6f27d" },
      { name: "Build First Queue", videoId: "80f02316aa604d6da04d920a8f05451e" },
    ],
  },
];

/** Collects all videoIds from a section (including the welcome video). */
export const getAllVideoIds = (section: NavigationSection): string[] => {
  const ids: string[] = [];
  if (section.welcomeVideoId) {
    ids.push(section.welcomeVideoId);
  }
  section.subcategories?.forEach((sub) => ids.push(sub.videoId));
  return ids;
};
