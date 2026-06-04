import { BookOpen } from "lucide-react";
import type { NavigationSection } from "@/lib/types";

export const navigationSections: NavigationSection[] = [
  {
    id: "how-to-use-writestack",
    title: "How to Use WriteStack",
    icon: BookOpen,
    welcomeVideoId: "777210bf4a974f77b34ad873fb76b786",
    subcategories: [
      {
        name: "My Notes",
        videoId: "ca8bf956f36d4e11af87a1d005a84a7a",
        cta: "My Notes section complete guide.",
        minPlan: "all",
      },
      {
        name: "WriteStack Settings",
        videoId: "a44a9ced151449ad81bf970ce0abd2f0",
        cta: "Configure your WriteStack settings.",
        minPlan: "all",
      },
      {
        name: "Deep Statistics",
        videoId: "af55483033bd480bb5eb59bbb0f99905",
        cta: "Deep Statistics complete guide.",
        minPlan: "standard",
      },
      // {
      //   name: "Build First Queue",
      //   videoId: "80f02316aa604d6da04d920a8f05451e",
      //   cta: "Build your first queue. Get started with WriteStack today.",
      //   minPlan: "all",
      // },
      {
        name: "WriteStack Follows",
        videoId: "fc0604501a3948119a4c5e119cd96e50",
        cta: "Follow your favorite creators on WriteStack.",
        minPlan: "all",
      },
      // {
      //   name: "Generate Personalized Notes",
      //   videoId: "41e975405c544f779e60602ab9e6f27d",
      //   cta: "Personalize at scale. Try WriteStack personalized notes.",
      //   minPlan: "all",
      // },
      {
        name: "Enhance Notes Generation",
        videoId: "7107a24668a4420bb279121640bbee47",
        cta: "Create better notes with AI. Try WriteStack notes enhancement today.",
        minPlan: "all",
      },

      {
        name: "Organize WriteStack Notes",
        videoId: "98d27b6d1bac4878a24970bfbfffce75",
        cta: "Keep your notes organized. Start organizing with WriteStack.",
        minPlan: "all",
      },
      {
        name: "How to Use WriteStack Analytics",
        videoId: "3a8ef8a9f6d84c7a84166f74f286772b",
        cta: "Data-driven growth. Check out WriteStack Analytics.",
        minPlan: "standard",
      },
      {
        name: "Master The Activity Center",
        videoId: "e07702a006104b5eaeb61b8194d7ee60",
        cta: "Take control of your activity. Explore WriteStack Activity Center.",
        minPlan: "standard",
      },
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

/** Total number of videos across all sections. */
export const getTotalVideoCount = (): number => {
  return navigationSections.reduce(
    (acc, section) => acc + getAllVideoIds(section).length,
    0,
  );
};
