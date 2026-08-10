"use client";

import ProjectCard from "@/components/cards/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/ui/FilterBar";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import { useFeed } from "@/hooks/useFeed";
import type { Project } from "@/lib/types";

interface ProjectFeedProps {
  projects: Project[];
  filterable?: boolean;
  pageSize?: number;
  step?: number;
  gridClassName?: string;
}

export default function ProjectFeed({
  projects,
  filterable = false,
  pageSize,
  step = 2,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
}: ProjectFeedProps) {
  const {
    filters,
    activeFilter,
    changeFilter,
    visible,
    canLoadMore,
    loadMore,
    isEmpty,
  } = useFeed(projects, { pageSize, step });

  return (
    <div className="w-full">
      {filterable && (
        <FilterBar
          filters={filters}
          active={activeFilter}
          onChange={changeFilter}
        />
      )}
      <div className={gridClassName}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {isEmpty && (
        <EmptyState message="No projects found under this category." />
      )}
      {canLoadMore && (
        <LoadMoreButton onClick={loadMore} className="mt-5">
          ↓ Load More Projects
        </LoadMoreButton>
      )}
    </div>
  );
}
