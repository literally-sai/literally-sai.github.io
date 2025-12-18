"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  "As the bonfires of knowledge grow brighter, the more the darkness is revealed to our startled eyes - Terence McKenna",
  "Intelligence without risk is an empty thought, as is an intelligence whose realization takes no time. Risk and time are the presuppositions for the history of intelligence in which nothing is given in advance and nothing is completed as the totality of that history - Reza Negarestani",
  "Anything can happen for some weird reason; yet also, without any reason, nothing at all can happen - Reza Negarestani",
  "A concept is a brick. It can be used to build a courthouse of reason. Or it can be thrown through the window - Gilles Deleuze",
  "We head for the horizon, on the plane of immanence, and we return with bloodshot eyes, yet they are the eyes of the mind - Gilles Deleuze",
  "Beauty is something that burns the hand when you touch it - Yukio Mishima",
];

export default function QuoteBento() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <section className="bg-[#cdd6f4] dark:bg-[#4a2a3a] border-2 border-black dark:border-[#9d5b7a] rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="absolute top-2 left-3 text-4xl text-blue dark:text-[#9d5b7a] opacity-50 font-serif">
        "
      </div>
      <p className="text-sm font-bold text-black dark:text-white relative z-10 pt-4 pb-2 italic leading-relaxed">
        {quote || "Loading wisdom..."}
      </p>
    </section>
  );
}
