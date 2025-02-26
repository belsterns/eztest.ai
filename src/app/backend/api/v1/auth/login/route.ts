import { auth, signIn } from "@/app/auth";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
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
        statusCode: 401,
        message: "Session not found after login",
        data: null,
      };
    }

    return NextResponse.json({
      message: StaticMessage.LoginSuccessfully,
      data: session.data,
    });
  } catch (error: any) {
    const cleanErrorMessage =
      error?.message?.split(" Read more at ")[0] || "Authentication failed";

    let statusCode;

    if (
      cleanErrorMessage.includes(
        "No account found with this email. Please enter a valid email address.."
      )
    ) {
      statusCode = 404;
    } else if (
      cleanErrorMessage.includes(
        "The password you entered is incorrect. Please try again.."
      )
    ) {
      statusCode = 401;
    }

    return NextResponse.json(
      { message: cleanErrorMessage, data: error.data || null },
      { status: statusCode || error.statusCode }
    );
  }
}
