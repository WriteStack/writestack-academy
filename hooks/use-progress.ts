"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "writestack-academy-progress";

type EpisodeProgress = {
  watched: boolean;
  watchedAt: string | null;
};

type CourseProgress = Record<string, EpisodeProgress>;

type CompletionStats = {
  completed: number;
  total: number;
};

const loadProgress = (): CourseProgress => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as CourseProgress;
  } catch {
    return {};
  }
};

const saveProgress = (progress: CourseProgress): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage might be full or unavailable
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<CourseProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  const markAsWatched = useCallback((videoId: string) => {
    setProgress((prev) => {
      const updated: CourseProgress = {
        ...prev,
        [videoId]: {
          watched: true,
          watchedAt: new Date().toISOString(),
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markAsUnwatched = useCallback((videoId: string) => {
    setProgress((prev) => {
      const updated: CourseProgress = {
        ...prev,
        [videoId]: {
          watched: false,
          watchedAt: null,
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const toggleWatched = useCallback((videoId: string) => {
    setProgress((prev) => {
      const current = prev[videoId];
      const isCurrentlyWatched = current?.watched ?? false;
      const updated: CourseProgress = {
        ...prev,
        [videoId]: {
          watched: !isCurrentlyWatched,
          watchedAt: !isCurrentlyWatched ? new Date().toISOString() : null,
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const isWatched = useCallback(
    (videoId: string): boolean => {
      return progress[videoId]?.watched ?? false;
    },
    [progress]
  );

  const getCompletionStats = useCallback(
    (videoIds: string[]): CompletionStats => {
      const completed = videoIds.filter(
        (id) => progress[id]?.watched
      ).length;
      return { completed, total: videoIds.length };
    },
    [progress]
  );

  return {
    progress,
    isLoaded,
    markAsWatched,
    markAsUnwatched,
    toggleWatched,
    isWatched,
    getCompletionStats,
  };
};
