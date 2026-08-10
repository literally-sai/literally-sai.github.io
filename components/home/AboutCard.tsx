import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { panel } from "@/lib/styles";

export default function AboutCard({ className }: { className?: string }) {
  return (
    <section className={cn(panel, className)}>
      <h2 className="font-bold text-md mb-3 flex items-center gap-2">
        About Me
      </h2>
      <p className="text-sm leading-relaxed dark:text-foreground/80 text-black mb-4">
        {site.about.map((paragraph, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <>
                <br />
                <br />
              </>
            )}
            {paragraph}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
