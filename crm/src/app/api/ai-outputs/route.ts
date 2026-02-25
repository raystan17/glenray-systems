import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import type { AIOutput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await db.aiOutputs.getAll());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const output: AIOutput = {
    id: `ai-${uuid().slice(0, 8)}`,
    clientId: body.clientId,
    type: body.type || "research_brief",
    title: body.title || "",
    status: "pending",
    content: "",
    agentUsed: body.agentUsed || "Research Agent",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  const created = await db.aiOutputs.create(output);
  return NextResponse.json(created, { status: 201 });
}
