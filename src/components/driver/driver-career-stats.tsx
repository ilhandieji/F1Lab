import { useTranslations } from "next-intl";
import { formatGroupedNumber } from "@/lib/format-number";
import type { DriverCareerTotals } from "@/lib/driver/types";

const STAT_ITEMS: {
  key: keyof DriverCareerTotals;
  label: "wins" | "podiums" | "poles" | "fastestLaps" | "points" | "grandSlams" | "titles" | "bestFinish";
  format?: "grouped" | "position";
}[] = [
  { key: "raceWins", label: "wins" },
  { key: "podiums", label: "podiums" },
  { key: "polePositions", label: "poles" },
  { key: "fastestLaps", label: "fastestLaps" },
  { key: "careerPoints", label: "points", format: "grouped" },
  { key: "grandSlams", label: "grandSlams" },
  { key: "championshipWins", label: "titles" },
  { key: "bestChampionshipPosition", label: "bestFinish", format: "position" },
];

type DriverCareerStatsProps = {
  totals: DriverCareerTotals;
};

export function DriverCareerStats({ totals }: DriverCareerStatsProps) {
  const t = useTranslations("Common");

  return (
    <section
      className="mt-8 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      aria-label={t("careerStats")}
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">{t("career")}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_ITEMS.map(({ key, label, format }) => {
          const raw = totals[key];
          const value = typeof raw === "number" ? raw : null;
          const display =
            value === null || (key === "bestChampionshipPosition" && value === 0)
              ? "—"
              : format === "grouped"
                ? formatGroupedNumber(value, 0)
                : format === "position"
                  ? t("position", { position: value })
                  : String(value);
          return (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.9),rgba(16,16,18,0.95))] p-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{t(label)}</p>
              <p dir="ltr" className="mt-2 text-2xl font-black tabular-nums text-white">{display}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
