"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProfileCard";

export default function HomeProjectFeed({ projects }: { projects: any[] }) {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.slice(0, visibleCount).map((project: any) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            status={project.status || "Ongoing"}
            date={
              project.date
                ? new Date(project.date).toISOString().substring(0, 7)
                : ""
            }
            thumbnail={project.thumbnail || "/thumbnails/rs.png"}
            tags={project.tags || []}
            link={project.link || "https://github.com"}
          />
        ))}
      </div>
      {visibleCount < projects.length && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-5 bg-white dark:bg-zinc-800 text-foreground border-2 border-black font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a0c4ff] hover:text-black active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
        >
          ↓ Load More Projects
        </button>
      )}
    </>
  );
}
