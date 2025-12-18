"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProfileCard";

export default function ProjectsList({
  initialProjects,
}: {
  initialProjects: any[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Systems Programming", "GameDev", "WebDev", "Misc"];

  const filteredProjects =
    activeFilter === "All"
      ? initialProjects
      : initialProjects.filter(
          (project) =>
            project.category?.toLowerCase() === activeFilter.toLowerCase(),
        );

  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-16">
      <div className="flex gap-2 mb-8 flex-wrap border-b border-black/5 dark:border-white/5 pb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider font-mono border rounded-lg transition-all hover:scale-105 active:scale-95 ${
              activeFilter === filter
                ? "bg-blue/20 text-blue border-blue/30 dark:border-blue/50"
                : "bg-card-bg/40 text-foreground/60 border-black/10 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            status={project.status || "Ongoing"}
            date={
              project.date
                ? new Date(project.date).toISOString().substring(0, 7)
                : ""
            }
            thumbnail={project.thumbnail || "/thumbnails/default.png"}
            tags={project.tags || []}
            link={project.link || "#"}
          />
        ))}
      </div>
    </main>
  );
}
