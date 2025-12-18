import Link from "next/link";
import { getPostData, getAllPostSlugs } from "@/lib/content";
import ShareButton from "@/components/ShareButton";

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-16 pt-4 bg-background">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/posts"
          className="bg-white dark:bg-zinc-800 text-foreground border-2 border-black font-mono font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a0c4ff] hover:text-black active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-1.5"
        >
          <svg
            suppressHydrationWarning
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </Link>
        <ShareButton title={postData.title} />
      </div>

      <header className="mb-8 border-b-2 border-black/10 dark:border-white/10 pb-4">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          {postData.title}
        </h1>
        <div className="flex items-center gap-3 text-xs font-mono text-foreground/60">
          <span>
            {postData.date
              ? new Date(postData.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </span>
          <span className="px-2 py-0.5 bg-transparent sm:bg-pink/20 text-pink rounded font-sans uppercase font-bold text-[10px]">
            {postData.categories?.[0] || postData.tag || "Misc"}
          </span>
        </div>
      </header>

      <article
        className="prose dark:prose-invert bg-background max-w-[1200px] text-sm sm:text-base leading-relaxed space-y-4
          [&_p_code]:bg-transparent sm:[&_p_code]:bg-profile-lite [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:font-mono [&_p_code]:text-xs
          [&_pre]:border-2 [&_pre]:border-black [&_pre]:rounded-2xl [&_pre]:p-4 [&_pre]:shadow-sm [&_pre]:overflow-x-auto
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:pt-4
          [&_h3]:text-lg [&_h3]:font-bold"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </main>
  );
}
