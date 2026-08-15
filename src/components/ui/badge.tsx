import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-border bg-bg-subtle px-2.5 py-1 font-mono text-xs text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
