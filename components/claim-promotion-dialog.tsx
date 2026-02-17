"use client";

import { useState } from "react";
import { Gift, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ClaimPromotionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  freeTrialDays: number;
  onClaimSuccess: () => void;
};

export const ClaimPromotionDialog = ({
  open,
  onOpenChange,
  userId,
  freeTrialDays,
  onClaimSuccess,
}: ClaimPromotionDialogProps) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async () => {
    setIsClaiming(true);
    setError("");

    try {
      const res = await fetch("/api/academy/claim-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to claim promotion");
        return;
      }

      setClaimed(true);
      onClaimSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (claimed) {
      onOpenChange(false);
    } else {
      onOpenChange(next);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={!isClaiming}
        className="sm:max-w-md animate-in zoom-in-95 fade-in duration-200"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Claim Your Reward
          </DialogTitle>
          <DialogDescription>
            You&apos;ve completed all videos! Claim your {freeTrialDays} days
            free trial.
          </DialogDescription>
        </DialogHeader>

        {claimed ? (
          <div className="flex flex-col items-center gap-4 py-4 animate-in zoom-in-95 fade-in duration-300">
            <div className="rounded-full bg-emerald-500/20 p-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Promotion Claimed!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your {freeTrialDays} days free trial has been added to your
                WriteStack account.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            {error && (
              <p className="text-sm text-destructive animate-in fade-in">
                {error}
              </p>
            )}
            <Button
              onClick={handleClaim}
              disabled={isClaiming}
              size="lg"
              className="gap-2 w-full"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" />
                  Claim Promotion ({freeTrialDays} days)
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
