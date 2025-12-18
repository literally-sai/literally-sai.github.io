import { getSortedContent } from "@/lib/content";
import ProjectsList from "@/components/ProjectsList";

export default function ProjectsPage() {
  const allProjects = getSortedContent("projects");

  return <ProjectsList initialProjects={allProjects} />;
}
