import type { Metadata } from "next";
import NotFoundPanel from "@/components/layout/NotFoundPanel";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Post Not Found | ${site.name}` };

export default function PostNotFound() {
  return (
    <NotFoundPanel
      title="No post under that slug."
      message="It may have been renamed. The full archive is one click away."
      hint="$ cat posts/<slug>.md → No such file or directory"
      actions={[
        { label: "All Posts", href: "/posts" },
        { label: "Home", href: "/" },
      ]}
    />
  );
}
