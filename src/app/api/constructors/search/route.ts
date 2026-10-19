import { NextResponse } from "next/server";
import { searchConstructors } from "@/lib/constructor/constructor-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const constructors = await searchConstructors(q);
  return NextResponse.json({ constructors });
}
