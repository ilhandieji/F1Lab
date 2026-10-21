import { ArchiveHeader } from "@/components/chrome/archive-header";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("Common");
  const meta = await getTranslations("Metadata");

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <ArchiveHeader showSearch={false} />
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-4 px-4 py-16 md:px-6">
        <h1 className="text-3xl font-black tracking-[-0.04em]">{t("notFoundHeading")}</h1>
        <p className="max-w-xl text-sm leading-6 text-white/70">{t("notFoundBody")}</p>
        <Link
          href="/"
          className="inline-flex w-fit text-sm font-semibold text-red-300 underline decoration-red-400/40 underline-offset-4"
        >
          {meta("title")}
        </Link>
      </div>
    </main>
  );
}
