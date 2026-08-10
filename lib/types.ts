export type ContentKind = "posts" | "projects";

export interface Entry {
  slug: string;
  title: string;
  date: string | null;
  category: string;
  tags: string[];
}

export type Post = Entry;

export interface Project extends Entry {
  status: string;
  thumbnail: string;
  link: string;
  featured: boolean;
}

export interface PostDetail extends Post {
  contentHtml: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TechItem {
  name: string;

  slug: string | null;
}
