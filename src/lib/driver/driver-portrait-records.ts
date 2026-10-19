import { prisma } from "@/lib/prisma";
import {
  resolveDriverPortraitUrl,
  type DriverPortraitRecord,
} from "./driver-photos";

export type DriverPortraitMap = Map<string, DriverPortraitRecord[]>;

export async function getPortraitMapForDriverIds(ids: string[]): Promise<DriverPortraitMap> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const rows = await prisma.driver_portrait.findMany({
    where: { driver_id: { in: uniqueIds } },
    select: { driver_id: true, season_key: true, object_key: true },
  });

  const map: DriverPortraitMap = new Map();
  for (const row of rows) {
    const list = map.get(row.driver_id) ?? [];
    list.push({ seasonKey: row.season_key, objectKey: row.object_key });
    map.set(row.driver_id, list);
  }
  return map;
}

export function portraitUrlFromMap(
  map: DriverPortraitMap,
  driverId: string,
  season: number | null,
): string | null {
  return resolveDriverPortraitUrl(map.get(driverId) ?? [], season);
}
