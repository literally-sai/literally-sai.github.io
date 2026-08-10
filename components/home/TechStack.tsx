import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { panel } from "@/lib/styles";

export default function TechStack({ className }: { className?: string }) {
  return (
    <section className={cn(panel, className)}>
      <h2 className="font-bold text-md mb-4 flex items-center gap-2">
        Tech Stack
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-3">
        {site.techStack.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-center group relative cursor-pointer"
            title={tech.name}
          >
            {tech.slug ? (
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/black/white`}
                alt={`${tech.name} logo`}
                className="w-10 h-7 transition-transform duration-200 group-hover:scale-125"
              />
            ) : (
              <div className="w-10 h-7 flex items-center justify-center font-bold text-[10px] border-2 border-black dark:border-white rounded-md transition-transform duration-200 group-hover:scale-125">
                {tech.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
