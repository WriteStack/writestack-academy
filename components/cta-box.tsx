"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CtaBoxProps = {
  text: string;
  actionLabel?: string;
  href?: string;
};

export const CtaBox = ({
  text,
  actionLabel = "Try WriteStack Free",
  href = "https://writestack.com",
}: CtaBoxProps) => {
  return (
    <div className="rounded-xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/5 p-4 md:p-5">
      <p className="text-sm md:text-base text-foreground/90 mb-3 md:mb-4 leading-relaxed">
        {text}
      </p>
      <Button
        asChild
        size="sm"
        className="gap-2 font-medium"
        aria-label={actionLabel}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};
