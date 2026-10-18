"use client";

import { Suspense, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { GridShell } from "./grid-shell";
import { parseSeasonYear } from "@/lib/grid/seasons";

type SeasonGridShellProps = {
  initialYear: number;
  children: ReactNode;
};

function SeasonGridShellInner({ initialYear, children }: SeasonGridShellProps) {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const year = parseSeasonYear(slug) ?? initialYear;

  return <GridShell year={year}>{children}</GridShell>;
}

export function SeasonGridShell({ initialYear, children }: SeasonGridShellProps) {
  return (
    <Suspense fallback={<GridShell year={initialYear}>{children}</GridShell>}>
      <SeasonGridShellInner initialYear={initialYear}>{children}</SeasonGridShellInner>
    </Suspense>
  );
}
