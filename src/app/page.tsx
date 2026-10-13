import { prisma } from "@/lib/prisma";

export default async function Page() {
  const drivers = await prisma.driver.findMany({
    select: {
      first_name: true,
      last_name: true,
    },
  });

  return <pre>{JSON.stringify(drivers, null, 2)}</pre>;
}
