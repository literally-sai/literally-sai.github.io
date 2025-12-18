"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const btnClasses =
    "fixed top-4 right-4 z-[300] w-12 h-12 rounded-2xl border-2 border-black bg-profile-lite flex items-center justify-center shadow-brutal hover:scale-[1.1] hover:rotate-5 active:scale-[0.95] transition-all cursor-pointer select-none";

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={btnClasses}
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-foreground hidden dark:block"
        strokeWidth="2.5"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="fill-foreground block dark:hidden"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
