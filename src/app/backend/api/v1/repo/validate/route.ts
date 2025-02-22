import { RepositoryController } from "@/app/backend/controllers/repositories/repository.controller";
import { NextRequest, NextResponse } from "next/server";
import { StaticMessage } from "../../../../constants/StaticMessages";

const repositoryController = new RepositoryController();

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const repoToken = headers.get("x-origin-token");
    const body = await request.json();

    if (!repoToken) {
      return NextResponse.json(
        { message: StaticMessage.InvalidGitHubToken },
        { status: 401 }
      );
    }

    const response = await repositoryController.findRepositoryDetails(
      body,
      repoToken
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: error.data || null },
      { status: error.statusCode || 500 }
    );
  }
}
