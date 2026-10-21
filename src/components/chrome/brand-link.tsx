import { useTranslations } from "next-intl";
import { focusRing } from "./focus";
import { Link } from "@/i18n/navigation";

export function BrandLink() {
  const t = useTranslations("Common");

  return (
    <Link
      href="/"
      className={`brand-mark shrink-0 text-[11px] font-black uppercase tracking-[0.34em] text-white ${focusRing}`}
      aria-label={t("home")}
    >
      F1<span className="text-red-500">Lab</span>
    </Link>
  );
}
