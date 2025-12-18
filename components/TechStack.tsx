export default async function TechStack() {
  const techStack = [
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
  ];

  return (
    <section className="bg-card-bg border-2 border-black rounded-3xl p-5 shadow-brutal">
      <h2 className="font-bold text-md mb-4 flex items-center gap-2">
        Tech Stack
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-3">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-center group relative cursor-pointer"
            title={tech.name}
          >
            {tech.slug ? (
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/black/white`}
                alt={`${tech.name} logo`}
                className="w-10 h-7 transition-transform duration-200 group-hover:scale-125"
              />
            ) : (
              <div className="w-10 h-7 flex items-center justify-center font-bold text-[10px] border-2 border-black dark:border-white rounded-md transition-transform duration-200 group-hover:scale-125">
                {tech.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
