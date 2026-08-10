"use client";

import { cn } from "@/lib/cn";
import {
  brutalBase,
  brutalHover,
  brutalShadowMd,
  brutalSurface,
} from "@/lib/styles";

interface LoadMoreButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function LoadMoreButton({
  onClick,
  children,
  className,
}: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-2.5",
        brutalBase,
        brutalSurface,
        brutalHover,
        brutalShadowMd,
        className,
      )}
    >
      {children}
    </button>
  );
}
