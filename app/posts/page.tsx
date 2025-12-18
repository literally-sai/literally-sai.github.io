import { getSortedContent } from "@/lib/content";
import PostsList from "@/components/PostsList";

export default function PostsPage() {
  const allPosts = getSortedContent("posts");

  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-16">
      <h1 className="font-bold text-2xl mb-6 ml-2 flex items-center gap-2">
        All Posts
      </h1>
      <PostsList initialPosts={allPosts} />
    </main>
  );
}
