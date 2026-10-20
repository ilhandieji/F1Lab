import Link from "next/link";
import { focusRing } from "./focus";

type Crumb = {
  href?: string;
  label: string;
  title?: string;
};

export function ArchiveBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? (
            <Link href={item.href} className={`shrink-0 transition hover:text-white ${focusRing}`}>
              {item.label}
            </Link>
          ) : (
            <span className="truncate text-white/90" title={item.title}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
