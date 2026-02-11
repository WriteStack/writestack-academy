"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoomPlayer } from "@/components/loom-player";
import { CtaBox } from "@/components/cta-box";
import { EndOfVideoCta } from "@/components/end-of-video-cta";
import type { NavigationSection } from "@/lib/types";
import { cn } from "@/lib/utils";

type EpisodeContentProps = {
  section: NavigationSection;
  activeSubcategory: string | null;
  isWatched: (videoId: string) => boolean;
  onToggleWatched: (videoId: string) => void;
  onAutoMarkWatched: (videoId: string) => void;
  onNextVideo: () => void;
  onFirstSubcategoryClick: () => void;
  hasNextVideo: boolean;
};

export const EpisodeContent = ({
  section,
  activeSubcategory,
  isWatched,
  onToggleWatched,
  onAutoMarkWatched,
  onNextVideo,
  onFirstSubcategoryClick,
  hasNextVideo,
}: EpisodeContentProps) => {
  const Icon = section.icon;

  // Determine the current video ID and title
  const isWelcomeVideo = !activeSubcategory;
  const currentVideoId = isWelcomeVideo
    ? section.welcomeVideoId ?? ""
    : section.subcategories?.find((sub) => sub.name === activeSubcategory)
        ?.videoId ?? "";
  const currentTitle = isWelcomeVideo
    ? "Welcome to WriteStack Academy"
    : activeSubcategory ?? "";

  const watched = isWatched(currentVideoId);
  const hasFirstSubcategory =
    section.subcategories && section.subcategories.length > 0;

  const currentCta = section.subcategories?.find(
    (sub) => sub.name === activeSubcategory
  )?.cta;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Icon className="h-6 w-6 text-foreground" />
          <h2 className="text-2xl font-bold text-foreground">
            {isWelcomeVideo ? "WriteStack Academy" : activeSubcategory}
          </h2>
        </div>

        {/* Loom Video Player */}
        <div className="flex justify-center mb-6">
          <LoomPlayer
            videoId={currentVideoId}
            title={currentTitle}
            onProgressReached90={onAutoMarkWatched}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-end gap-2">
          {/* Mark as Watched Toggle */}
          {currentVideoId && (
            <Button
              onClick={() => onToggleWatched(currentVideoId)}
              variant={watched ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2 transition-colors",
                watched &&
                  "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              )}
              aria-label={watched ? "Mark as unwatched" : "Mark as watched"}
            >
              <CheckCircle2 className="h-4 w-4" />
              {watched ? "Watched" : "Mark as Watched"}
            </Button>
          )}

          {/* Next Video Button */}
          {isWelcomeVideo && hasFirstSubcategory && (
            <Button onClick={onFirstSubcategoryClick} className="gap-2 py-1">
              Next Episode
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {!isWelcomeVideo && hasNextVideo && (
            <Button onClick={onNextVideo} className="gap-2">
              Next Episode
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* End of Video CTA */}
        <EndOfVideoCta category={activeSubcategory ?? section.title} />
      </CardContent>
    </Card>
  );
};
