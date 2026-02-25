import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import type { Client } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await db.clients.getAll());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const now = new Date().toISOString();

  const client: Client = {
    id: `client-${uuid().slice(0, 8)}`,
    name: body.name || "",
    company: body.company || "",
    email: body.email || "",
    phone: body.phone || "",
    vertical: body.vertical || "professional_services",
    status: body.status || "lead",
    notes: body.notes || "",
    createdAt: now,
    updatedAt: now,
  };

  const created = await db.clients.create(client);
  return NextResponse.json(created, { status: 201 });
}
