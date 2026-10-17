import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { GridShell } from "@/components/grid/grid-shell";
import { GridSkeleton } from "@/components/grid/grid-skeleton";
import { parseSeasonYear } from "@/lib/grid/seasons";

type SeasonLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default function SeasonLayout({ children, params }: SeasonLayoutProps) {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <SeasonLayoutContent params={params}>{children}</SeasonLayoutContent>
    </Suspense>
  );
}

async function SeasonLayoutContent({ children, params }: SeasonLayoutProps) {
  const { slug } = await params;
  const year = parseSeasonYear(slug);
  if (!year) notFound();

  return <GridShell year={year}>{children}</GridShell>;
}
