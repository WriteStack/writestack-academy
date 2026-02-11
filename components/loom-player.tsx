"use client";

import { useEffect, useRef, useCallback } from "react";
import { Play } from "lucide-react";

type LoomPlayerProps = {
  videoId: string;
  title: string;
  onProgressReached90?: (videoId: string) => void;
};

const LOOM_CONTEXT = "player.js";
const AUTO_MARK_THRESHOLD = 0.9;

export const LoomPlayer = ({
  videoId,
  title,
  onProgressReached90,
}: LoomPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasTriggered90Ref = useRef(false);

  // Reset the 90% trigger when videoId changes
  useEffect(() => {
    hasTriggered90Ref.current = false;
  }, [videoId]);

  const subscribeToEvents = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const events = ["timeupdate", "ended"];
    events.forEach((event) => {
      iframe.contentWindow?.postMessage(
        { method: "addEventListener", value: event, context: LOOM_CONTEXT },
        "*"
      );
    });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.context !== LOOM_CONTEXT) return;

      const { event: eventName, data } = event.data;

      if (eventName === "ready") {
        subscribeToEvents();
        return;
      }

      if (eventName === "timeupdate" && data) {
        const { seconds, duration } = data as {
          seconds: number;
          duration: number;
        };

        if (
          duration > 0 &&
          seconds / duration >= AUTO_MARK_THRESHOLD &&
          !hasTriggered90Ref.current
        ) {
          hasTriggered90Ref.current = true;
          onProgressReached90?.(videoId);
        }
      }

      if (eventName === "ended" && !hasTriggered90Ref.current) {
        hasTriggered90Ref.current = true;
        onProgressReached90?.(videoId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [videoId, onProgressReached90, subscribeToEvents]);

  if (!videoId) {
    return (
      <div className="relative w-full max-w-3xl bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: "1 / 0.6486161251504213" }}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Video ID not set. Add video ID to display Loom embed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-3xl bg-muted rounded-lg overflow-hidden"
      style={{ aspectRatio: "1 / 0.6486161251504213" }}
    >
      <iframe
        ref={iframeRef}
        src={`https://www.loom.com/embed/${videoId}`}
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
        frameBorder="0"
        title={title}
        onLoad={subscribeToEvents}
      />
    </div>
  );
};
