import { archiveHeaderInnerClass } from "@/lib/layout";

export function ArchiveHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080c]/90" aria-hidden="true">
      <div className={archiveHeaderInnerClass}>
        <div className="flex flex-col gap-1.5 md:hidden">
          <div className="flex h-8 items-center justify-between gap-2">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-8 w-24 rounded-lg bg-white/10" />
          </div>
          <div className="h-9 rounded-xl bg-white/10" />
          <div className="h-8 w-40 rounded bg-white/10" />
        </div>
        <div className="hidden min-h-11 items-center gap-3 md:flex">
          <div className="h-4 w-36 shrink-0 rounded bg-white/10" />
          <div className="h-8 min-w-0 flex-1 rounded bg-white/5" />
          <div className="h-9 w-[min(20rem,22vw)] shrink-0 rounded-xl bg-white/10" />
          <div className="h-8 w-28 shrink-0 rounded-lg bg-white/10" />
        </div>
      </div>
    </header>
  );
}
