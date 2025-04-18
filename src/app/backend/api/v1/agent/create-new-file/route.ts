import { AgentController } from "@/app/backend/controllers/agent/agent.controller";
import { NextRequest, NextResponse } from "next/server";

const agentController = new AgentController();

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await agentController.createNewFile(body);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: error.data || null },
      { status: error.statusCode || 500 }
    );
  }
}
