"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Gift, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { usePromotion } from "@/hooks/usePromotion";
import useLocalStorage from "@/hooks/useLocalStorage";

type WidgetState =
  | "loading"
  | "hidden"
  | "no-data-can-claim"
  | "has-data-in-progress"
  | "has-data-ready-to-claim"
  | "claiming"
  | "claimed";

export const SidebarPromotionWidget = () => {
  const { allVideosComplete, totalVideos, completedVideos, freeTrialDays } =
    usePromotion();
  const searchParams = useSearchParams();
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");
  const [promotionClaimed, setPromotionClaimed] = useLocalStorage<boolean>(
    "writestack-academy-promotion-claimed",
    false
  );
  const [claimError, setClaimError] = useState("");

  const userId = searchParams.get("userId");

  const checkCanClaim = useCallback(async () => {
    if (!userId) {
      // No cookie data - check if they could be eligible via a generic check
      // We can't call can-claim without userId, so show the CTA to /promotion
      setWidgetState("no-data-can-claim");
      return;
    }

    try {
      const { data } = await axios.post<{ canClaim: boolean }>(
        `/api/academy/can-claim-promotion`,
        {
          userId,
        }
      );

      if (!data.canClaim) {
        setWidgetState("hidden");
        return;
      }

      // canClaim is true — determine if they have progress data
      if (allVideosComplete) {
        setWidgetState("has-data-ready-to-claim");
      } else {
        setWidgetState("has-data-in-progress");
      }
    } catch (error) {
      console.error("Error checking can claim:", error);
      setWidgetState("hidden");
    }
  }, [allVideosComplete, userId]);

  useEffect(() => {
    checkCanClaim();
  }, [checkCanClaim]);

  // Update state when all videos become complete
  useEffect(() => {
    
    if (widgetState === "has-data-in-progress" && allVideosComplete) {
      setWidgetState("has-data-ready-to-claim");
    }
  }, [allVideosComplete, widgetState]);

  const handleClaim = async () => {
    if (!userId || promotionClaimed) return;

    setWidgetState("claiming");
    setClaimError("");

    try {
      const res = await axios.post<{ success: boolean; error?: string }>(
        `/api/academy/claim-promotion`,
        { userId }
      );

      if (!res.data.success) {
        setClaimError(res.data.error || "Failed to claim promotion");
        setWidgetState("has-data-ready-to-claim");
        return;
      }

      // Clear cookies and localStorage
      setPromotionClaimed(true);
      setWidgetState("claimed");

      // Fire confetti
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#10b981"],
      });
    } catch {
      setClaimError("Something went wrong. Please try again.");
      setWidgetState("has-data-ready-to-claim");
    }
  };

  // Case 2: No cookie data, but promotion exists — show prominent CTA to /promotion
  if (widgetState === "no-data-can-claim") {
    return (
      <div className="border-t border-border pt-4 mt-4">
        <Button
          asChild
          className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md animate-in fade-in duration-500"
          size="sm"
        >
          <Link
            href="/promotion"
            className="gap-2 flex flex-row items-center justify-center shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Get 3 Days Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  // Case 1: Has data, in progress — show remaining count
  if (widgetState === "has-data-in-progress") {
    const remaining = totalVideos - completedVideos;
    return (
      <div className="border-t border-border pt-4 mt-4">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              Free Trial Offer
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Watch{" "}
            <span className="font-medium text-foreground">
              {remaining} more video{remaining !== 1 ? "s" : ""}
            </span>{" "}
            to claim {freeTrialDays} days free.
          </p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(completedVideos / totalVideos) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Case 1: Has data, all complete — show claim button or loading
  if (widgetState === "has-data-ready-to-claim" || widgetState === "claiming") {
    const isClaiming = widgetState === "claiming";

    return (
      <div className="border-t border-border pt-4 mt-4">
        <div
          className={cn(
            "rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3",
            isClaiming && "opacity-90"
          )}
        >
          {isClaiming ? (
            <div className="flex flex-col items-center justify-center gap-3 py-2">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">
                Claiming your gift...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground">
                  All Videos Complete!
                </span>
              </div>
              {claimError && (
                <p className="text-xs text-destructive mb-2">{claimError}</p>
              )}
              <Button
                onClick={handleClaim}
                size="sm"
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Gift className="h-4 w-4" />
                Claim {freeTrialDays} Days Free
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Claimed state
  if (widgetState === "claimed" || promotionClaimed) {
    return (
      <div className="border-t border-border pt-4 mt-4">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Promotion claimed!
          </p>
        </div>
      </div>
    );
  }

  return null;
};
