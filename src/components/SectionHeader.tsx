import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-4 border-b border-border pb-6">
      <div className="flex gap-3">
        <div className="pt-1 text-xl">{icon}</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h1>
          {subtitle ? <p className="max-w-3xl text-base leading-7 text-text-muted">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}
