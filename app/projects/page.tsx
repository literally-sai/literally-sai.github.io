import type { Metadata } from "next";
import ProjectFeed from "@/components/feeds/ProjectFeed";
import PageContainer from "@/components/layout/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects | literally_sai" };

export default function ProjectsPage() {
  return (
    <PageContainer>
      <PageTitle>All Projects</PageTitle>
      <ProjectFeed projects={getProjects()} filterable />
    </PageContainer>
  );
}
