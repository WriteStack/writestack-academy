"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import slugify from "slugify";

const getSlugifiedCategory = (category: string) => {
  return slugify(category, { lower: true, strict: true });
};
export const EndOfVideoCta = ({ category }: { category: string }) => {
  return (
    <div className="mt-8 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-background p-6 md:p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        Ready to grow your Substack?
      </h3>
      <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
        Join thousands of creators using WriteStack to turn readers into
        subscribers.
      </p>
      <Button
        asChild
        size="lg"
        className="gap-2 font-medium shadow-lg"
        aria-label="Try WriteStack free"
      >
        <Link
          href={`https://writestack.com?utm_source=writestack-academy&utm_medium=video&utm_campaign=writestack-academy&utm_content=${getSlugifiedCategory(category)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full"
        >
          Try WriteStack Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};
