import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  brutalBase,
  brutalHover,
  brutalShadowMd,
  brutalShadowSm,
  brutalSurface,
} from "@/lib/styles";

interface BrutalLinkProps {
  href: string;
  children: React.ReactNode;

  size?: "sm" | "md";
  className?: string;
}

export default function BrutalLink({
  href,
  children,
  size = "sm",
  className,
}: BrutalLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 inline-flex items-center gap-1.5",
        brutalBase,
        brutalSurface,
        brutalHover,
        size === "sm" ? brutalShadowSm : brutalShadowMd,
        className,
      )}
    >
      {children}
    </Link>
  );
}
