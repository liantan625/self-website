import { type ReactNode, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";
import { navItems, SidebarNav } from "./SidebarNav";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-semibold text-text">
            {profile.name}
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-bg-subtle text-accent" : "text-text-muted hover:bg-bg-subtle hover:text-text",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-md border border-border p-2 text-text-muted md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {mobileOpen ? (
          <div id="mobile-nav" className="border-t border-border px-4 py-3 md:hidden">
            <div className="mx-auto max-w-content">
              <SidebarNav mobile onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}
      </header>

      <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-content">{children}</div>
      </main>

      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-content flex-col gap-2 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>Built with React, TypeScript, and Markdown.</div>
          <div className="flex gap-4">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
              LinkedIn
            </a>
            <a href={profile.resume} className="hover:text-accent">
              Resume
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
