import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import BackLink from "@/components/ui/BackLink";
import ShareButton from "@/components/ui/ShareButton";
import { getPost, getPostSlugs } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { site } from "@/lib/site";
import { postProse } from "@/lib/styles";

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs();
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${site.name}`,
    description: site.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  // Previously an unknown slug crashed while destructuring undefined.
  if (!post) notFound();

  return (
    <PageContainer className="pt-4 bg-background">
      <div className="flex items-center justify-between gap-4 mb-6">
        <BackLink href="/posts" />
        <ShareButton title={post.title} />
      </div>

      <header className="mb-8 border-b-2 border-black/10 dark:border-white/10 pb-4">
        <h1 className="text-3xl font-black tracking-tight mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs font-mono text-foreground/60">
          <span>{formatLongDate(post.date)}</span>
          <span className="px-2 py-0.5 bg-transparent sm:bg-pink/20 text-pink rounded font-sans uppercase font-bold text-[10px]">
            {post.category}
          </span>
        </div>
      </header>

      <article className={postProse} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </PageContainer>
  );
}
