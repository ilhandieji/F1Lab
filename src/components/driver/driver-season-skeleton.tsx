export function DriverSeasonSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-4" aria-busy="true" aria-label="Loading season data">
      <div className="rounded-3xl border border-white/10 bg-white/3 p-5">
        <div className="mb-4 h-4 w-32 rounded bg-white/10" />
        <div className="mb-6 h-8 w-48 rounded bg-white/10" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-white/10" />
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-14 rounded-xl bg-white/10" />
          <div className="h-14 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
