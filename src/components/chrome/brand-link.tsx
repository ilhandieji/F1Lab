import Link from "next/link";
import { focusRing } from "./focus";

export function BrandLink() {
  return (
    <Link
      href="/"
      className={`shrink-0 text-[11px] font-black uppercase tracking-[0.34em] text-white ${focusRing}`}
      aria-label="F1Lab home"
    >
      F1<span className="text-red-500">Lab</span>
    </Link>
  );
}
