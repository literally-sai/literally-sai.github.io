export default function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-bold text-2xl mb-6 ml-2 flex items-center gap-2">
      {children}
    </h1>
  );
}
