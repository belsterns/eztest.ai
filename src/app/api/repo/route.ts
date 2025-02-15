import { StaticMessage } from "@/app/constants/StaticMessages";
import { RepositoryController } from "@/app/controllers/repositories/repository.controller";
import { NextRequest, NextResponse } from "next/server";

const repositoryController = new RepositoryController();

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const repoToken = headers.get("x-origin-token");
    const body = await request.json();

    if (!repoToken) {
      return NextResponse.json(
        { message: StaticMessage.InvalidGitHubToken },
        { status: 401 },
      );
    }

    const response = await repositoryController.saveRepositoryDetails(
      body,
      repoToken,
    );

    return NextResponse.json(response.data.webhook_url, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: error.data || null },
      { status: error.statusCode || 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const headers = request.headers;
    const repoToken = headers.get("x-origin-token");
    const body = await request.json();

    if (!repoToken) {
      return NextResponse.json(
        { message: StaticMessage.InvalidGitHubToken },
        { status: 401 },
      );
    }

    const response = await repositoryController.updateRepositoryDetails(
      body,
      repoToken,
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: error.data || null },
      { status: error.statusCode || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await repositoryController.deleteRepository(body);

    return NextResponse.json(
      `Deleted repository '${response.repo_name}' from organization '${response.organization_name}' successfully.`,
    );
  } catch (error) {
    throw error;
  }
}
