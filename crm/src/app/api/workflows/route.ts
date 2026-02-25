import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(db.workflows.getAll());
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const updated = db.workflows.update(body.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
