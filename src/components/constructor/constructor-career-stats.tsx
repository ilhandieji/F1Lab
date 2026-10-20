import type { ConstructorCareerTotals } from "@/lib/constructor/types";

const STAT_ITEMS: {
  key: keyof ConstructorCareerTotals;
  label: string;
  format?: (v: number) => string;
}[] = [
  { key: "raceWins", label: "Wins" },
  { key: "oneTwoFinishes", label: "1–2 finishes" },
  { key: "podiums", label: "Podiums" },
  { key: "polePositions", label: "Poles" },
  { key: "fastestLaps", label: "Fastest laps" },
  {
    key: "careerPoints",
    label: "Points",
    format: (v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 }),
  },
  { key: "championshipWins", label: "Titles" },
  {
    key: "bestChampionshipPosition",
    label: "Best finish",
    format: (v) => (v > 0 ? `P${v}` : "—"),
  },
];

type ConstructorCareerStatsProps = {
  totals: ConstructorCareerTotals;
};

export function ConstructorCareerStats({ totals }: ConstructorCareerStatsProps) {
  return (
    <section
      className="mt-8 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      aria-label="Career statistics"
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Career</span>
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">Career</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_ITEMS.map(({ key, label, format }) => {
          const raw = totals[key];
          const value = typeof raw === "number" ? raw : null;
          const display =
            value === null || (key === "bestChampionshipPosition" && value === 0)
              ? "—"
              : format
                ? format(value)
                : String(value);
          return (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.9),rgba(16,16,18,0.95))] p-4"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/45">{label}</p>
              <p className="mt-2 text-2xl font-black tabular-nums text-white">{display}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
