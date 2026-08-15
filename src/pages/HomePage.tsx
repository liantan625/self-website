import { ArrowRight, FileText, Mail, UserRound } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { profile } from "../data/profile";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import profilePhoto from "./IMG_0250.JPG";

const socialLinks = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    iconClassName: "bg-sky-100 text-sky-600",
    action: "Write",
  },
  {
    label: "GitHub",
    value: "Profile",
    href: profile.github,
    icon: FaGithub,
    iconClassName: "bg-[#171515] text-white",
    action: "Visit",
  },
  {
    label: "LinkedIn",
    value: "Connect",
    href: profile.linkedin,
    icon: FaLinkedin,
    iconClassName: "bg-[#0A66C2] text-white",
    action: "Open",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Seo
        title="Tan Li An | Portfolio + Blog"
        description="Full-stack developer focused on backend and data engineering."
        path="/"
      />

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.95fr)] xl:grid-cols-[minmax(0,1.8fr)_minmax(24rem,0.9fr)]">
        <Card className="space-y-8 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_20rem] xl:grid-cols-[minmax(0,1.55fr)_22rem]">
            <div className="flex gap-3">
              <UserRound className="h-5 w-5" />
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-text-muted">About Me</p>
                  <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">Tan Li An</h1>
                  <h2 className="max-w-3xl text-xl font-medium leading-8 text-text sm:text-2xl">
                    Final-year Computer Science student at Universiti Malaya, currently interning at Infinity Data Tech
                    and aiming toward backend and data engineering work.
                  </h2>
                </div>

                <div className="max-w-3xl space-y-4 text-base leading-8 text-text-muted">
                  <p>
                    I like building software that stays understandable after the first demo: admin tooling, APIs,
                    product-facing React apps, and systems where the data model and the user experience actually line up.
                  </p>
                  <p>
                    Most of my interest is in backend-heavy product work, but I value being able to ship the whole thing
                    end to end when needed.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/projects">
                    <Button>
                      View Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="ghost">More About Me</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-text">Profile Photo</h2>
              <div className="overflow-hidden rounded-2xl border border-border bg-bg-subtle">
                <img
                  src={profilePhoto}
                  alt="Portrait of Tan Li An"
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:content-start">
          <Card className="space-y-4 p-6 lg:p-7">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">Contact</h2>
            </div>
            <div className="space-y-3 text-sm text-text-muted">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-bg-subtle"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${link.iconClassName}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="space-y-0.5">
                        <span className="block text-sm font-medium text-text">{link.label}</span>
                        <span className="block text-xs text-text-muted">{link.value}</span>
                      </span>
                    </span>
                    <span className="text-sm text-accent">{link.action}</span>
                  </a>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4 p-6 lg:p-7">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">Quick Links</h2>
            </div>
            <div className="space-y-3 text-sm text-text-muted">
              <p>Projects, writing, and background are still available through the main navigation.</p>
              <a href={profile.resume} className="inline-flex items-center text-accent hover:underline">
                Resume PDF
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
