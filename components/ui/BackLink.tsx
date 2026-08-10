import BrutalLink from "./BrutalLink";

interface BackLinkProps {
  href: string;
  children?: React.ReactNode;
}

export default function BackLink({ href, children = "Back" }: BackLinkProps) {
  return (
    <BrutalLink href={href}>
      <svg
        suppressHydrationWarning
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      {children}
    </BrutalLink>
  );
}
