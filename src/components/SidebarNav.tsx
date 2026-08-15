import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
];

type SidebarNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ mobile = false, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Primary" className={cn("space-y-1", mobile && "py-1")}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
              isActive ? "bg-bg-subtle text-accent" : "text-text-muted hover:bg-bg-subtle hover:text-text",
            ].join(" ")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
