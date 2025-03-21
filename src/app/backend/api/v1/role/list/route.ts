import { NextResponse } from "next/server";
import { handleError } from "@/app/backend/utils/errorHandler";
import { RoleController } from "@/app/backend/controllers/role/role.controller";

const roleController = new RoleController();

export async function GET() {
  try {
    const response = await roleController.getRoles();

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return handleError(error);
  }
}
