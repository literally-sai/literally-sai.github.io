"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

function ProfileCard() {
  return (
    <div className="w-28 sm:w-32 bg-white border-2 border-black rounded-2xl p-2 shadow-brutal shrink-0 transform -rotate-1 select-none">
      <div className="w-full aspect-square border-2 border-black rounded-xl overflow-hidden bg-profile-lite">
        <img
          src={site.avatar}
          alt={`${site.name} profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center pt-2 pb-0.5 text-black font-black text-sm sm:text-base tracking-tight select-text">
        {site.name}
      </div>
    </div>
  );
}

function SpeechBubble() {
  return (
    <div className="relative bg-terminal dark:text-foreground text-black px-4 py-3.5 rounded-2xl max-w-[280px] sm:max-w-xs shadow-sm border border-black/5 dark:border-white/5">
      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-terminal" />
      <p className="text-xs sm:text-sm font-semibold leading-relaxed">
        I write low-level{" "}
        <span className="text-blue font-bold tracking-tight">code</span> and
        build things that{" "}
        <span className="text-[#1e1e2e] dark:text-pink line-through opacity-80 font-extrabold">
          sometimes
        </span>{" "}
        work.
      </p>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-2.5 pl-1">
      {site.socials.map(({ platform, href }) => {
        const isExternal = platform !== "email";
        return (
          <a
            key={platform}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={platform}
            className="w-9 h-9 bg-card-bg border-2 border-black rounded-xl flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            <img
              src={`/socials/${platform}.svg`}
              alt={platform}
              className="w-5 h-5 dark:invert"
            />
          </a>
        );
      })}
    </div>
  );
}

function MainNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="flex gap-8 border-b-2 border-gray-200 dark:border-zinc-800 mb-8 font-bold text-sm tracking-wide">
      {site.nav.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 pb-3 transition-all relative ${
              active
                ? "text-pink opacity-100"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {tab.label}
            {active && (
              <div className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-pink rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function ProfileHeader() {
  return (
    <header className="max-w-[1200px] mx-auto pt-8 px-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
        <div className="flex flex-row items-start gap-4 sm:gap-5 w-full md:w-auto justify-start">
          <ProfileCard />
          <div className="flex flex-col gap-3 items-start justify-start pt-12">
            <SpeechBubble />
            <SocialLinks />
          </div>
        </div>
      </div>
      <MainNav />
    </header>
  );
}
