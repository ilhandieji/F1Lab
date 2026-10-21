import { useTranslations } from "next-intl";
import { ArchiveHeaderSkeleton } from "@/components/chrome/archive-header-skeleton";
import { archiveMainClass } from "@/lib/layout";
import { ConstructorSeasonSkeleton } from "./constructor-season-skeleton";

function CareerTileSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="h-3 w-16 rounded bg-white/10" />
      <div className="mt-2 h-8 w-12 rounded bg-white/10" />
    </div>
  );
}

export function ConstructorProfileSkeleton() {
  const t = useTranslations("Common");
  return (
    <div className="relative min-h-screen bg-[#07080c] text-white" aria-busy="true" aria-label={t("loadingTeam")}>
      <ArchiveHeaderSkeleton />
      <main className={`${archiveMainClass} animate-pulse`}>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-5 md:p-8">
          <div className="grid gap-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-stretch md:gap-8">
            <div className="min-h-[6.5rem] rounded-2xl border border-white/10 bg-white/5 md:min-h-[10rem]" />
            <div className="min-w-0">
              <div className="h-3 w-12 rounded bg-white/10" />
              <div className="mt-3 h-10 w-4/5 rounded bg-white/10 md:h-12" />
              <div className="mt-3 h-4 w-48 rounded bg-white/10" />
              <div className="mt-2 h-4 w-56 rounded bg-white/10" />
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-6 w-44 rounded-full bg-white/10" />
                <div className="h-6 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <div className="h-5 w-7 rounded bg-white/10" />
              <div className="h-3 w-8 rounded bg-white/10" />
            </div>
          ))}
        </div>

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

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5">
          <div className="mb-4 border-b border-white/10 pb-3">
            <div className="h-3 w-16 rounded bg-white/10" />
            <div className="mt-2 h-5 w-36 rounded bg-white/10" />
            <div className="mt-2 h-4 w-64 max-w-full rounded bg-white/10" />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="h-7 w-9 shrink-0 rounded-md bg-white/10" />
            <div className="h-4 w-40 rounded bg-white/10" />
          </div>
        </section>

        <div className="mt-8">
          <ConstructorSeasonSkeleton />
        </div>
      </main>
    </div>
  );
}
