export function GridSkeleton() {
  return (
    <div className="mt-6 space-y-4" aria-label="Loading this season" aria-busy="true">
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="space-y-3 p-4">
              <div className="h-4 rounded-full bg-white/10" />
              <div className="grid gap-3 md:grid-cols-[60px_1fr_80px]">
                <div className="h-4 rounded-full bg-white/10" />
                <div className="h-4 rounded-full bg-white/10" />
                <div className="h-4 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
