import { useProgress } from "@/hooks/use-progress";
import { getTotalVideoCount } from "@/lib/data";
import { useMemo } from "react";

export const usePromotion = () => {
  const { progress } = useProgress();

  const totalVideos = getTotalVideoCount();
  const completedVideos = useMemo(() => {
    return Object.values(progress).filter((video) => video.watched).length;
  }, [progress]);

  const allVideosComplete = useMemo(() => {
    return true;
  }, []);

  const freeTrialDays = useMemo(() => {
    return 3;
  }, []);

  return { allVideosComplete, totalVideos, completedVideos, freeTrialDays };
};
