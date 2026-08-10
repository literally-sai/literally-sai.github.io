import PostFeed from "@/components/feeds/PostFeed";
import ProjectFeed from "@/components/feeds/ProjectFeed";
import AboutCard from "@/components/home/AboutCard";
import QuoteBento from "@/components/home/QuoteBento";
import TechStack from "@/components/home/TechStack";
import SectionHeader from "@/components/ui/SectionHeader";
import { getPosts, getProjects } from "@/lib/content";

export default function Home() {
  const posts = getPosts();
  const projects = getProjects();

  return (
    <main className="max-w-[1200px] mx-auto px-4 pt-4 pb-16 flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
      <div className="contents lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:gap-6 lg:self-start">
        <AboutCard className="order-1 lg:order-none" />
        <QuoteBento className="order-4 lg:order-none" />
        <TechStack className="order-5 lg:order-none" />
      </div>

      <div className="contents lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:flex lg:flex-col lg:gap-8">
        <section className="order-2 lg:order-none">
          <SectionHeader title="Projects" href="/projects" />
          <ProjectFeed
            projects={projects}
            pageSize={4}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
          />
        </section>

        <section className="order-3 lg:order-none">
          <SectionHeader title="Latest Posts" href="/posts" />
          <PostFeed
            posts={posts}
            pageSize={4}
            cardShadowClassName="shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
          />
        </section>
      </div>
    </main>
  );
}
