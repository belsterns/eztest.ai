import { auth, signIn } from "@/app/auth";
import {
  StaticMessage,
  StatusCode,
} from "@/app/backend/constants/StaticMessages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    const session = await auth();
    if (!session || !session.data) {
      throw {
        statusCode: StatusCode.Unauthorized,
        message: StaticMessage.SessionNotFound,
        data: null,
      };
    }

    return NextResponse.json({
      message: StaticMessage.LoginSuccessfully,
      data: session.data,
    });
  } catch (error: any) {
    const cleanErrorMessage =
      error?.message?.split(" Read more at ")[0] ||
      StaticMessage.AuthenticationFailed;

    let statusCode;

    if (cleanErrorMessage.includes(StaticMessage.UserEmailNotFound)) {
      statusCode = StatusCode.NotFound;
    } else if (cleanErrorMessage.includes(StaticMessage.InvalidPassword)) {
      statusCode = StatusCode.Unauthorized;
    }

    return NextResponse.json(
      { message: cleanErrorMessage, data: error.data || null },
      { status: statusCode || error.statusCode }
    );
  }
}
