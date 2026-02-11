"use client";

import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { EpisodeContent } from "@/components/episode-content";
import { useProgress } from "@/hooks/use-progress";
import { navigationSections } from "@/lib/data";

export default function Home() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["how-to-use-writestack"])
  );
  const [activeSection, setActiveSection] = useState<string>("how-to-use-writestack");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    setActiveSection(sectionId);
    setActiveSubcategory(null);
    const section = navigationSections.find((s) => s.id === sectionId);
    if (section?.subcategories && section.subcategories.length > 0) {
      if (!expandedSections.has(sectionId)) {
        handleSectionToggle(sectionId);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleSubcategoryClick = (sectionId: string, subcategory: string) => {
    setActiveSection(sectionId);
    setActiveSubcategory(subcategory);
    setIsMobileMenuOpen(false);
  };

  const activeSectionData = navigationSections.find((s) => s.id === activeSection);

  const getNextSubcategory = (): { sectionId: string; subcategory: string } | null => {
    if (!activeSubcategory || !activeSectionData?.subcategories) return null;

    const currentIndex = activeSectionData.subcategories.findIndex(
      (sub) => sub.name === activeSubcategory
    );

    if (currentIndex === -1 || currentIndex === activeSectionData.subcategories.length - 1) {
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
      handleSubcategoryClick(next.sectionId, next.subcategory);
    }
  };

  const handleFirstSubcategoryClick = () => {
    if (!activeSectionData?.subcategories?.length) return;
    handleSubcategoryClick(activeSection, activeSectionData.subcategories[0].name);
  };

  const handleAutoMarkWatched = useCallback(
    (videoId: string) => {
      markAsWatched(videoId);
    },
    [markAsWatched]
  );

  return (
    <div className="flex min-h-screen bg-background relative">
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
        expandedSections={expandedSections}
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
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
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
}
