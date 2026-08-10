import type { NavItem, SocialLink, TechItem } from "./types";

export const site = {
  name: "literally_sai",
  title: "literally_sai | Portfolio",
  description: "Static Systems Engineering Portfolio",
  avatar: "/profile.png",
  fallbackThumbnail: "/thumbnails/default.png",
  fallbackLink: "#",
  fallbackCategory: "Misc",
  fallbackStatus: "Ongoing",
  filterMode: "content" as "content" | "config",
  categoryOrder: ["Systems Programming", "GameDev", "WebDev", "Misc"],

  nav: [
    { label: "About", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Posts", href: "/posts" },
  ] satisfies NavItem[],

  socials: [
    { platform: "github", href: "https://github.com/literally-sai" },
    { platform: "instagram", href: "https://instagram.com/literally__sai" },
    { platform: "x", href: "https://x.com/literally_sai" },
    { platform: "email", href: "mailto:sai@literally-sai.com" },
  ] satisfies SocialLink[],

  about: [
    "I\u2019m a systems engineer based in Heidelberg, Germany, and I spend most of my time writing low-level software in Rust. I really enjoy playing around with Linux internals, eBPF, and my NixOS setup.",
    "Lately, I\u2019ve been getting really into defense tech, which is what got me into building multi-agent drone swarm simulations. I\u2019ve also been doing some game dev using Bevy. I\u2019m working on a game called Iron Line right now, and the plan is to release it mid next year.",
    "When I'm not looking at a screen, I\u2019m usually reading theory-fiction, Dark Horse comics or 20th-century Japanese literature.",
  ],

  techStack: [
    { name: "Rust", slug: "rust" },
    { name: "C", slug: "c" },
    { name: "Nix", slug: "nixos" },
    { name: "Linux", slug: "linux" },
    { name: "eBPF", slug: "ebpf" },
    { name: "Cilium", slug: "cilium" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "Docker", slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "AWS", slug: "amazonaws" },
    { name: "Python", slug: "python" },
    { name: "Bash", slug: "gnubash" },
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "JavaScript", slug: "javascript" },
    { name: "OpenGL", slug: "opengl" },
    { name: "Vulkan", slug: "vulkan" },
    { name: "RabbitMQ", slug: "rabbitmq" },
    { name: "Bevy", slug: null },
    { name: "Ghidra", slug: null },
  ] satisfies TechItem[],

  quotes: [
    "As the bonfires of knowledge grow brighter, the more the darkness is revealed to our startled eyes - Terence McKenna",
    "Intelligence without risk is an empty thought, as is an intelligence whose realization takes no time. Risk and time are the presuppositions for the history of intelligence in which nothing is given in advance and nothing is completed as the totality of that history - Reza Negarestani",
    "Anything can happen for some weird reason; yet also, without any reason, nothing at all can happen - Reza Negarestani",
    "A concept is a brick. It can be used to build a courthouse of reason. Or it can be thrown through the window - Gilles Deleuze",
    "We head for the horizon, on the plane of immanence, and we return with bloodshot eyes, yet they are the eyes of the mind - Gilles Deleuze",
    "Beauty is something that burns the hand when you touch it - Yukio Mishima",
  ],
};
