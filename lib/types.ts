import type { BookOpen } from "lucide-react";

export type Subcategory = {
  name: string;
  videoId: string;
  cta: string;
  minPlan?: "all" | "standard" | "premium";
};

export type NavigationSection = {
  id: string;
  title: string;
  icon: typeof BookOpen;
  welcomeVideoId?: string;
  subcategories?: Subcategory[];
};
