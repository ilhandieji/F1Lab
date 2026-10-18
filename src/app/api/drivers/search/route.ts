import { NextResponse } from "next/server";
import { searchDrivers } from "@/lib/driver/driver-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const drivers = await searchDrivers(q);
  return NextResponse.json({ drivers });
}
