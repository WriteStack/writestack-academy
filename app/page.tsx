"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { EpisodeContent } from "@/components/episode-content";
import { useProgress } from "@/hooks/use-progress";
import { navigationSections } from "@/lib/data";
import {
  WELCOME_EPISODE_SLUG,
  buildAcademyPath,
  episodeSlugFromVideoName,
  findSubcategoryNameByEpisodeSlug,
} from "@/lib/academy-url";

const HomeContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sectionIdFromUrl = searchParams.get("section");
  const episodeSlugFromUrl = searchParams.get("episode");

  const defaultSectionId = navigationSections[0]?.id ?? "how-to-use-writestack";

  const activeSection =
    sectionIdFromUrl &&
    navigationSections.some((s) => s.id === sectionIdFromUrl)
      ? sectionIdFromUrl
      : defaultSectionId;

  const activeSectionData = navigationSections.find(
    (s) => s.id === activeSection
  )!;

  const episodeSlug =
    episodeSlugFromUrl?.trim() || WELCOME_EPISODE_SLUG;

  const activeSubcategory: string | null =
    episodeSlug === WELCOME_EPISODE_SLUG
      ? null
      : findSubcategoryNameByEpisodeSlug(activeSectionData, episodeSlug);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set([defaultSectionId])
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const sidebarExpandedSections = useMemo(() => {
    const next = new Set(expandedSections);
    next.add(activeSection);
    return next;
  }, [expandedSections, activeSection]);

  const {
    isWatched,
    markAsWatched,
    toggleWatched,
    getCompletionStats,
  } = useProgress();

  const handleSectionToggle = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionClick = (sectionId: string) => {
    const section = navigationSections.find((s) => s.id === sectionId);
    if (section?.subcategories && section.subcategories.length > 0) {
      if (!expandedSections.has(sectionId)) {
        handleSectionToggle(sectionId);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleSubcategoryClick = () => {
    setIsMobileMenuOpen(false);
  };

  const getNextSubcategory = (): {
    sectionId: string;
    subcategory: string;
  } | null => {
    if (!activeSubcategory || !activeSectionData?.subcategories) return null;

    const currentIndex = activeSectionData.subcategories.findIndex(
      (sub) => sub.name === activeSubcategory
    );

    if (
      currentIndex === -1 ||
      currentIndex === activeSectionData.subcategories.length - 1
    ) {
      return null;
    }

    const nextSub = activeSectionData.subcategories[currentIndex + 1];
    return {
      sectionId: activeSection,
      subcategory: nextSub.name,
    };
  };

  const handleNextVideo = () => {
    const next = getNextSubcategory();
    if (next) {
      router.push(
        buildAcademyPath(
          next.sectionId,
          episodeSlugFromVideoName(next.subcategory)
        ),
        { scroll: false }
      );
    }
  };

  const handleFirstSubcategoryClick = () => {
    if (!activeSectionData?.subcategories?.length) return;
    const first = activeSectionData.subcategories[0];
    router.push(
      buildAcademyPath(activeSection, episodeSlugFromVideoName(first.name)),
      { scroll: false }
    );
  };

  const handleAutoMarkWatched = useCallback(
    (videoId: string) => {
      markAsWatched(videoId);
    },
    [markAsWatched]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar */}
      <Sidebar
        navigationSections={navigationSections}
        expandedSections={sidebarExpandedSections}
        activeSection={activeSection}
        activeSubcategory={activeSubcategory}
        isMobileMenuOpen={isMobileMenuOpen}
        isWatched={isWatched}
        getCompletionStats={getCompletionStats}
        onSectionToggle={handleSectionToggle}
        onSectionClick={handleSectionClick}
        onSubcategoryClick={handleSubcategoryClick}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 p-8 overflow-y-auto">
        {/* Mobile Burger Menu Button */}
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-30 bg-background border border-border"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Episode Content */}
        {activeSectionData && (
          <EpisodeContent
            section={activeSectionData}
            activeSubcategory={activeSubcategory}
            isWatched={isWatched}
            onToggleWatched={toggleWatched}
            onAutoMarkWatched={handleAutoMarkWatched}
            onNextVideo={handleNextVideo}
            onFirstSubcategoryClick={handleFirstSubcategoryClick}
            hasNextVideo={!!getNextSubcategory()}
          />
        )}
      </main>
    </div>
  );
};

const HomeFallback = () => (
  <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
    Loading…
  </div>
);

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
