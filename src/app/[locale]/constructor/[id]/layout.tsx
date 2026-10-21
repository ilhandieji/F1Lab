import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConstructorProfileLayout } from "@/components/constructor/constructor-profile-layout";
import { ConstructorProfileSkeleton } from "@/components/constructor/constructor-profile-skeleton";
import { getConstructorProfile } from "@/lib/constructor/constructor-profile";
import { getTeamLogo } from "@/lib/team-logos";

type ConstructorLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default function ConstructorLayout({ children, params }: ConstructorLayoutProps) {
  return (
    <Suspense fallback={<ConstructorProfileSkeleton />}>
      <ConstructorLayoutContent params={params}>{children}</ConstructorLayoutContent>
    </Suspense>
  );
}

async function ConstructorLayoutContent({ children, params }: ConstructorLayoutProps) {
  const { id } = await params;
  const profile = await getConstructorProfile(id);
  if (!profile) notFound();

  const seasonMarks = profile.careerYears.map((year) => {
    const logo = getTeamLogo(profile.id, year);
    return {
      year,
      logoPath: logo?.src ?? null,
      lightLogo: logo?.light ?? false,
    };
  });

  return (
    <ConstructorProfileLayout profile={profile} seasonMarks={seasonMarks}>
      {children}
    </ConstructorProfileLayout>
  );
}
