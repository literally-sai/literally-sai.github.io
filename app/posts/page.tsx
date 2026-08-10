import type { Metadata } from "next";
import PostFeed from "@/components/feeds/PostFeed";
import PageContainer from "@/components/layout/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Posts | literally_sai" };

export default function PostsPage() {
  return (
    <PageContainer>
      <PageTitle>All Posts</PageTitle>
      <PostFeed posts={getPosts()} filterable />
    </PageContainer>
  );
}
