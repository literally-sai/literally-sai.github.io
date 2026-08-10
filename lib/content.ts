import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";
import { site } from "./site";
import type { ContentKind, Post, PostDetail, Project } from "./types";

const DIRS: Record<ContentKind, string> = {
  posts: path.join(process.cwd(), "posts"),
  projects: path.join(process.cwd(), "projects"),
};

type RawEntry = {
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

function readDir(kind: ContentKind): RawEntry[] {
  const dir = DIRS[kind];
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        data: data as Record<string, unknown>,
        content,
      };
    });
}

function toText(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toIsoDate(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value))
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  return [];
}

function toCategory(data: Record<string, unknown>): string {
  const fromList = Array.isArray(data.categories)
    ? data.categories[0]
    : data.categories;
  return toText(data.category ?? fromList ?? data.tag, site.fallbackCategory);
}

function toBaseEntry({ slug, data }: RawEntry): Post {
  return {
    slug,
    title: toText(data.title, slug),
    date: toIsoDate(data.date),
    category: toCategory(data),
    tags: toTags(data.tags),
  };
}

function toProject(entry: RawEntry): Project {
  const { data } = entry;
  return {
    ...toBaseEntry(entry),
    status: toText(data.status, site.fallbackStatus),
    thumbnail: toText(data.thumbnail, site.fallbackThumbnail),
    link: toText(data.link, site.fallbackLink),
    featured: data.featured === true || data.featured === "true",
  };
}

function byNewest(a: Post, b: Post): number {
  return (b.date ?? "").localeCompare(a.date ?? "");
}

export function getPosts(): Post[] {
  return readDir("posts").map(toBaseEntry).sort(byNewest);
}

export function getProjects(): Project[] {
  return readDir("projects")
    .map(toProject)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || byNewest(a, b));
}

export function getPostSlugs(): { slug: string }[] {
  return readDir("posts").map(({ slug }) => ({ slug }));
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  if (!/^[\w.-]+$/.test(slug)) return null;

  const file = [".md", ".mdx"]
    .map((extension) => path.join(DIRS.posts, `${slug}${extension}`))
    .find((candidate) => fs.existsSync(candidate));

  if (!file) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const entry: RawEntry = {
    slug,
    data: data as Record<string, unknown>,
    content,
  };

  return {
    ...toBaseEntry(entry),
    contentHtml: await renderMarkdown(content),
  };
}
