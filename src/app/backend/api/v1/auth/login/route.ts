import { signIn } from "@/app/auth";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";

export const POST = baseInterceptor(async (request, context) => {
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

  return new Response(
    JSON.stringify({
      message: StaticMessage.LoginSuccessfully,
      data: response,
    }),
    { status: 200 }
  );
});
