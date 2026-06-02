import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuickAction } from "../data/quick-actions";

type QuickActionCardProps = Omit<QuickAction, "text"> & {
  href: string;
};

export function QuickActionCard({ title, description, gradient, href }: QuickActionCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-3">
      {/* visual placeholder with gradient background */}
      <div
        className={cn(
          "relative h-31 w-41 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ring-2 ring-inset ring-white/30",
          gradient
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-12 rounded-full bg-white/30" />
          <div className="absolute inset-2 rounded-lg ring-2 ring-inset ring-white/20" />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <Button variant="outline" size="xs" asChild className="w-fit">
          <Link href={href} aria-label={`${title} — Try it out`}>
            Try it out
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
