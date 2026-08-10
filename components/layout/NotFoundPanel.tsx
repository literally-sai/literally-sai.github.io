import PageContainer from "@/components/layout/PageContainer";
import BrutalLink from "@/components/ui/BrutalLink";
import { cn } from "@/lib/cn";
import { panel } from "@/lib/styles";

interface NotFoundAction {
  label: string;
  href: string;
}

interface NotFoundPanelProps {
  code?: string;
  title: string;
  message: string;

  hint?: string;
  actions?: NotFoundAction[];
}

export default function NotFoundPanel({
  code = "404",
  title,
  message,
  hint,
  actions = [],
}: NotFoundPanelProps) {
  return (
    <PageContainer className="pt-4">
      <section className={cn(panel, "max-w-xl")}>
        <div className="font-black text-5xl tracking-tight text-pink leading-none mb-3">
          {code}
        </div>

        <h1 className="font-bold text-xl tracking-tight mb-2">{title}</h1>
        <p className="text-sm leading-relaxed text-foreground/70">{message}</p>

        {hint && (
          <p className="mt-4 bg-terminal dark:text-foreground text-black rounded-2xl px-4 py-3 font-mono text-[11px] leading-relaxed border border-black/5 dark:border-white/5 break-all">
            {hint}
          </p>
        )}

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6">
            {actions.map((action) => (
              <BrutalLink key={action.href} href={action.href} size="md">
                {action.label}
              </BrutalLink>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
