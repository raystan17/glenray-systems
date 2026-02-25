import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import type { ServiceEngagement } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await db.services.getAll());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const service: ServiceEngagement = {
    id: `svc-${uuid().slice(0, 8)}`,
    clientId: body.clientId,
    serviceName: body.serviceName || "",
    serviceSlug: body.serviceSlug || "",
    tier: body.tier || "starter",
    price: body.price || 0,
    status: body.status || "pending",
    startDate: body.startDate || "",
    estimatedEndDate: body.estimatedEndDate || "",
    currentPhase: body.currentPhase || "onboard",
    createdAt: new Date().toISOString(),
  };

  const created = await db.services.create(service);
  return NextResponse.json(created, { status: 201 });
}
