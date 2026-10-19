type ResultMarksProps = {
  pole: boolean;
  fastestLap: boolean;
};

export function ResultMarks({ pole, fastestLap }: ResultMarksProps) {
  return (
    <>
      {pole ? (
        <span className="ms-1 rounded-sm border border-red-500/40 px-1 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-300">
          Pole
        </span>
      ) : null}
      {fastestLap ? (
        <span className="ms-1 rounded-sm border border-white/25 px-1 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white/80">
          FL
        </span>
      ) : null}
    </>
  );
}
