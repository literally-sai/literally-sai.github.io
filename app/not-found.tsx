import type { Metadata } from "next";
import NotFoundPanel from "@/components/layout/NotFoundPanel";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Not Found | ${site.name}` };

export default function NotFound() {
  return (
    <NotFoundPanel
      title="This page doesn't exist."
      message="The link is either wrong or the page has moved. Nothing broke on your end."
      hint="$ ls -la . → No such file or directory"
      actions={[
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Posts", href: "/posts" },
      ]}
    />
  );
}
