interface ProfileCardProps {
  title: string;
  status: string;
  date: string;
  thumbnail: string;
  tags: string[];
  link: string;
}

export default function ProfileCard({
  title,
  status,
  date,
  thumbnail,
  tags,
  link,
}: ProfileCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block bg-card-bg border-2 border-black rounded-[24px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
    >
      <div className="relative aspect-[16/10] w-full bg-profile-lite border-b-2 border-black overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 bg-white text-black border-2 border-black font-black text-xs px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {title}
        </div>

        <div className="absolute top-12 left-3 bg-[#b5179e] text-white border-2 border-black font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          {status}
        </div>

        <div className="absolute top-3 right-3 bg-[#ffb703] text-black border-2 border-black p-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
          <svg
            suppressHydrationWarning
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
      </div>

      <div className="p-3 flex items-center justify-between gap-2 bg-card-bg">
        <span className="bg-[#a0c4ff] text-black border-2 border-black font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] update-capsule">
          {date}
        </span>

        <div className="flex gap-1.5 flex-wrap justify-end">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-white text-black border-2 border-black font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
