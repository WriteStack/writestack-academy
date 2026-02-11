"use client";

import {
  GraduationCap,
  Search,
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavigationSection } from "@/lib/types";
import { getAllVideoIds } from "@/lib/data";

type SidebarProps = {
  navigationSections: NavigationSection[];
  expandedSections: Set<string>;
  activeSection: string;
  activeSubcategory: string | null;
  isMobileMenuOpen: boolean;
  isWatched: (videoId: string) => boolean;
  getCompletionStats: (videoIds: string[]) => {
    completed: number;
    total: number;
  };
  onSectionToggle: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  onSubcategoryClick: (sectionId: string, subcategory: string) => void;
  onMobileMenuClose: () => void;
};

const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

export const Sidebar = ({
  navigationSections,
  expandedSections,
  activeSection,
  activeSubcategory,
  isMobileMenuOpen,
  isWatched,
  getCompletionStats,
  onSectionToggle,
  onSectionClick,
  onSubcategoryClick,
  onMobileMenuClose,
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 md:w-80 border-r border-border bg-background p-6 flex flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo */}
      <button
        onClick={() => {
          onSectionClick("how-to-use-writestack");
          onMobileMenuClose();
        }}
        onKeyDown={(e) =>
          handleKeyDown(e, () => {
            onSectionClick("how-to-use-writestack");
            onMobileMenuClose();
          })
        }
        className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-1 -ml-1"
        tabIndex={0}
        aria-label="WriteStack Academy - Go to welcome video"
      >
        <GraduationCap className="h-6 w-6 text-primary" />
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary">WriteStack</span>
          <span className="text-sm font-normal text-primary/70">Academy</span>
        </div>
      </button>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for anything"
          className="pl-9 bg-muted/50"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto">
        {navigationSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          const isActive = activeSection === section.id;
          const hasSubcategories =
            section.subcategories && section.subcategories.length > 0;

          const allVideoIds = getAllVideoIds(section);
          const stats = getCompletionStats(allVideoIds);

          return (
            <div key={section.id} className="space-y-1 cursor-pointer">
              {/* Section Header */}
              <Button
                onClick={() => {
                  if (hasSubcategories) {
                    onSectionToggle(section.id);
                  }
                  onSectionClick(section.id);
                }}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    if (hasSubcategories) {
                      onSectionToggle(section.id);
                    }
                    onSectionClick(section.id);
                  })
                }
                variant={isActive && !activeSubcategory ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto min-h-9 py-2 whitespace-normal text-left",
                  isActive &&
                    !activeSubcategory &&
                    "bg-accent text-accent-foreground"
                )}
                tabIndex={0}
                aria-label={section.title}
                aria-expanded={hasSubcategories ? isExpanded : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 min-w-0 text-left wrap-break-word">
                  {section.title}
                </span>
                {hasSubcategories && (
                  <>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                  </>
                )}
              </Button>

              {/* Progress Bar + Stats */}
              {hasSubcategories && isExpanded && (
                <div className="ml-8 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {stats.completed}/{stats.total} completed
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                      style={{
                        width:
                          stats.total > 0
                            ? `${(stats.completed / stats.total) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Subcategories (episodes) */}
              {hasSubcategories && isExpanded && (
                <div className="ml-8 space-y-1">
                  {/* Welcome video entry */}
                  {section.welcomeVideoId && (
                    <Button
                      onClick={() => {
                        onSectionClick(section.id);
                        onMobileMenuClose();
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => {
                          onSectionClick(section.id);
                          onMobileMenuClose();
                        })
                      }
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-2 h-auto min-h-9 py-2 whitespace-normal text-left",
                        isActive && !activeSubcategory
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                      tabIndex={0}
                      aria-label="Welcome to WriteStack Academy"
                    >
                      {isWatched(section.welcomeVideoId) ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0" />
                      )}
                      <span className="text-left min-w-0 wrap-break-word">
                        Welcome
                      </span>
                    </Button>
                  )}

                  {section.subcategories?.map((subcategory) => {
                    const isSubActive =
                      activeSection === section.id &&
                      activeSubcategory === subcategory.name;
                    const watched = isWatched(subcategory.videoId);

                    return (
                      <Button
                        key={subcategory.name}
                        onClick={() =>
                          onSubcategoryClick(section.id, subcategory.name)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, () =>
                            onSubcategoryClick(section.id, subcategory.name)
                          )
                        }
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-2 h-auto min-h-9 py-2 whitespace-normal text-left",
                          isSubActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                        tabIndex={0}
                        aria-label={subcategory.name}
                      >
                        {watched ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0" />
                        )}
                        <span className="text-left min-w-0 wrap-break-word">
                          {subcategory.name}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      {/* <div className="border-t border-border my-6" /> */}

      {/* Footer */}
      {/* <div className="mt-auto">
        <Button
          onClick={() => {}}
          onKeyDown={(e) => handleKeyDown(e, () => {})}
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground w-full justify-start"
          tabIndex={0}
          aria-label="New to WriteStack?"
        >
          New to WriteStack?
        </Button>
      </div> */}
    </aside>
  );
};
