"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { brutalBase, brutalShadowSm } from "@/lib/styles";

export default function ShareButton({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      console.error("Failed to copy link: ", error);
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Reading: ${title}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this post: ${currentUrl}`)}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "px-3 py-1.5 flex items-center gap-1.5 hover:bg-[#4cc9f0] hover:text-black",
          brutalBase,
          brutalShadowSm,
          isOpen
            ? "bg-[#4cc9f0] text-black"
            : "bg-white dark:bg-zinc-800 text-foreground",
        )}
      >
        <svg
          suppressHydrationWarning
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
        Share
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden font-mono text-[11px] font-bold uppercase tracking-wide">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full text-left px-4 py-2.5 flex items-center gap-2 border-b-2 border-black transition-colors ${
              copied
                ? "bg-[#4cc9f0] text-black"
                : "hover:bg-pink dark:hover:bg-pink hover:text-black"
            }`}
          >
            {copied ? "Copied Link!" : "Copy Link"}
          </button>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 border-b-2 border-black hover:bg-[#1da1f2] hover:text-white dark:hover:bg-[#1da1f2] text-foreground transition-colors"
          >
            Post to Twitter
          </a>

          <a
            href={emailUrl}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 hover:bg-[#ffb703] hover:text-black dark:hover:bg-[#ffb703] text-foreground transition-colors"
          >
            Send via Email
          </a>
        </div>
      )}
    </div>
  );
}
