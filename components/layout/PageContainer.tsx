import { cn } from "@/lib/cn";

export default function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("max-w-[1200px] mx-auto px-4 pb-16", className)}>
      {children}
    </main>
  );
}
