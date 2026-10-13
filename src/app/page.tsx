import { prisma } from "@/lib/prisma";

export const instant = false;

async function driver() {
  return prisma.driver.findMany({
    select: {
      first_name: true,
      last_name: true,
    },
  });
}

export default async function Page() {
  const drivers = await driver();
  return <pre>{JSON.stringify(drivers, null, 2)}</pre>;
}
