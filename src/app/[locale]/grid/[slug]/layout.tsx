import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { SeasonGridShell } from "@/components/grid/season-grid-shell";
import { FEATURED_SEASON, parseSeasonYear } from "@/lib/grid/seasons";

type SeasonLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default function SeasonLayout({ children, params }: SeasonLayoutProps) {
  return (
    <Suspense
      fallback={
        <SeasonGridShell initialYear={FEATURED_SEASON}>{children}</SeasonGridShell>
      }
    >
      <SeasonLayoutContent params={params}>{children}</SeasonLayoutContent>
    </Suspense>
  );
}

async function SeasonLayoutContent({ children, params }: SeasonLayoutProps) {
  const { slug } = await params;
  const year = parseSeasonYear(slug);
  if (!year) notFound();

  return <SeasonGridShell initialYear={year}>{children}</SeasonGridShell>;
}
