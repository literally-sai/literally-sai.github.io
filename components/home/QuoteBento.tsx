"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export default function QuoteBento({ className }: { className?: string }) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(site.quotes[Math.floor(Math.random() * site.quotes.length)]);
  }, []);

  return (
    <section
      className={cn(
        "bg-[#cdd6f4] dark:bg-[#4a2a3a] border-2 border-black dark:border-[#9d5b7a] rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform",
        className,
      )}
    >
      <div className="absolute top-2 left-3 text-4xl text-blue dark:text-[#9d5b7a] opacity-50 font-serif">
        &quot;
      </div>
      <p className="text-sm font-bold text-black dark:text-white relative z-10 pt-4 pb-2 italic leading-relaxed">
        {quote || "Loading wisdom..."}
      </p>
    </section>
  );
}
