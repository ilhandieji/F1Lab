import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import LandingExperience from "@/components/landing-experience";

async function LandingData() {
  const drivers = await prisma.driver.findMany({
    select: {
      first_name: true,
      last_name: true,
    },
  });

  return <LandingExperience drivers={drivers} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={<LandingExperience drivers={[]} />}
    >
      <LandingData />
    </Suspense>
  );
}
