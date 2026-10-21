import { ArchiveHeaderSkeleton } from "@/components/chrome/archive-header-skeleton";
import { archiveMainClass } from "@/lib/layout";
import { DriverSeasonSkeleton } from "./driver-season-skeleton";

function CareerTileSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="h-3 w-16 rounded bg-white/10" />
      <div className="mt-2 h-8 w-12 rounded bg-white/10" />
    </div>
  );
}

export function DriverProfileSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#07080c] text-white" aria-busy="true" aria-label="Loading driver">
      <ArchiveHeaderSkeleton />
      <main className={`${archiveMainClass} animate-pulse`}>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-5 md:p-8">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end">
            <div>
              <div className="h-3 w-14 rounded bg-white/10" />
              <div className="mt-3 h-10 w-4/5 rounded bg-white/10 md:h-12" />
              <div className="mt-2 h-4 w-3/5 rounded bg-white/10" />
              <div className="mt-3 h-4 w-40 rounded bg-white/10" />
              <div className="mt-2 h-4 w-48 rounded bg-white/10" />
              <div className="mt-2 h-4 w-32 rounded bg-white/10" />
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-6 w-36 rounded-full bg-white/10" />
                <div className="h-6 w-20 rounded-full bg-white/10" />
                <div className="h-6 w-24 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="min-h-[12rem] rounded-2xl border border-white/10 bg-white/5 md:min-h-[14rem]" />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5">
          <div className="mb-4 border-b border-white/10 pb-3">
            <div className="h-6 w-24 rounded bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <CareerTileSkeleton key={index} />
            ))}
          </div>
        </section>

        <div className="mt-8">
          <DriverSeasonSkeleton />
        </div>
      </main>
    </div>
  );
}
