import { signIn, auth } from "@/app/auth";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";

export const POST = baseInterceptor(async (request) => {
  const body = await request.json();
  const { email, password } = body;

  const response = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (response?.error) {
    throw {
      statusCode: 401,
      message: response.error,
      data: null,
    };
  }

  // Get user session after successful login
  const session = await auth();

  if (!session || !session.data) {
    throw {
      statusCode: 401,
      message: "Session not found after login",
      data: null,
    };
  }

  return {
    message: StaticMessage.LoginSuccessfully,
    data: session.data,
  };
});
