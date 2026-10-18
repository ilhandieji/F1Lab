import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { DriverProfileLayout } from "@/components/driver/driver-profile-layout";
import { DriverSeasonSkeleton } from "@/components/driver/driver-season-skeleton";
import { getDriverProfile } from "@/lib/driver/driver-profile";

type DriverLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default function DriverLayout({ children, params }: DriverLayoutProps) {
  return (
    <Suspense fallback={<DriverSeasonSkeleton />}>
      <DriverLayoutContent params={params}>{children}</DriverLayoutContent>
    </Suspense>
  );
}

async function DriverLayoutContent({ children, params }: DriverLayoutProps) {
  const { id } = await params;
  const profile = await getDriverProfile(id);
  if (!profile) notFound();

  return <DriverProfileLayout profile={profile}>{children}</DriverProfileLayout>;
}
