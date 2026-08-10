export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 font-mono text-xs text-foreground/40 border-2 border-dashed border-black/10 rounded-2xl">
      {message}
    </div>
  );
}
