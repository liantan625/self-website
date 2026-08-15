import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "secondary" | "ghost";
};

export function Button({ children, className, variant = "secondary" }: ButtonProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
        variant === "secondary"
          ? "border-border bg-bg-subtle text-text hover:text-accent"
          : "border-border text-text hover:bg-bg-subtle hover:text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
