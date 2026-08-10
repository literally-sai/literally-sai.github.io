import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  title,
  href,
  linkLabel = "View all →",
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg flex items-center gap-2">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-bold text-blue hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
