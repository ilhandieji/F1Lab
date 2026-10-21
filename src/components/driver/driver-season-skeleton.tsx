export function DriverSeasonSkeleton() {
  return (
    <section
      className="animate-pulse rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      aria-busy="true"
      aria-label="Loading season data"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-2 h-6 w-28 rounded bg-white/10" />
        </div>
        <div>
          <div className="ms-auto h-3 w-16 rounded bg-white/10" />
          <div className="mt-2 h-8 w-16 rounded bg-white/10" />
          <div className="mt-1 ms-auto h-4 w-14 rounded bg-white/10" />
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="h-3 w-14 rounded bg-white/10" />
            <div className="mt-1 h-7 w-10 rounded bg-white/10" />
          </div>
        ))}
      </div>
      <div className="mb-3 h-3 w-14 rounded bg-white/10" />
      <div className="grid gap-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="h-10 w-12 shrink-0 rounded-md bg-white/10" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-40 max-w-full rounded bg-white/10" />
              <div className="mt-2 h-3 w-24 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
