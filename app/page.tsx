import QuoteBento from "@/components/QuoteBento";
import Link from "next/link";
import { getSortedContent } from "@/lib/content";
import HomeProjectFeed from "@/components/HomeProjectFeed";
import HomePostFeed from "@/components/HomePostFeed";


export default async function Home() {
  const allPosts = getSortedContent("posts");
  const allProjects = getSortedContent("projects");

  const sortedProjects = [
    ...allProjects.filter((project: any) => project.featured === true),
    ...allProjects.filter((project: any) => project.featured !== true),
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-y-6 lg:gap-x-8 lg:grid-rows-[auto_1fr] pb-16 pt-4">
      <section className="lg:col-span-4 lg:row-start-1 lg:col-start-1 bg-card-bg border-2 border-black rounded-3xl p-5 shadow-brutal self-start">
        <h2 className="font-bold text-md mb-3 flex items-center gap-2">
          About Me
        </h2>
        <p className="text-sm leading-relaxed dark:text-foreground/80 text-black mb-4">
          I’m a systems engineer based in Heidelberg, Germany, and I spend most
          of my time writing low-level software in Rust. I really enjoy playing
          around with Linux internals, eBPF, and my NixOS setup. <br />
          <br />
          Lately, I’ve been getting really into defense tech, which is what got
          me into building multi-agent drone swarm simulations. I’ve also been
          doing some game dev using Bevy. I’m working on a game called Iron Line
          right now, and the plan is to release it mid next year. <br />
          <br />
          When I'm not looking at a screen, I’m usually reading theory-fiction,
          Dark Horse comics or 20th-century Japanese literature.
        </p>
      </section>

      <div className="contents lg:flex lg:flex-col lg:gap-8 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:row-span-2">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs font-bold text-blue hover:underline"
            >
              View all →
            </Link>
          </div>
          <HomeProjectFeed projects={sortedProjects} />
        </section>
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              Latest Posts
            </h2>
            <Link
              href="/posts"
              className="text-xs font-bold text-blue hover:underline"
            >
              View all →
            </Link>
          </div>
          <HomePostFeed posts={allPosts} />
        </section>
      </div>

      <div className="lg:col-span-4 lg:row-start-2 lg:col-start-1 flex flex-col gap-6 self-start">
        <QuoteBento />
      </div>
    </main>
  );
}
