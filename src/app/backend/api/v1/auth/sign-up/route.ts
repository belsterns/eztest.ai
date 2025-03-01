import { AuthController } from "@/app/backend/controllers/auth/auth.controller";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";
import { signIn } from "@/app/auth";
import {
  OnboardingType,
  StaticMessage,
} from "@/app/backend/constants/StaticMessages";

const authController = new AuthController();

export const POST = baseInterceptor(async (request) => {
  const onboardingType = request.nextUrl.searchParams.get("onboardingType");
  const createdBy = request.nextUrl.searchParams.get("createdBy");

  if (onboardingType?.toLowerCase() === OnboardingType.Invite && !createdBy) {
    throw {
      statusCode: 400,
      message: StaticMessage.CreatedByRequired,
      data: null,
    };
  }

  const body = await request.json();
  const user = await authController.Register(body, onboardingType, createdBy);

  await signIn("credentials", {
    redirect: false,
    email: body.email,
    password: body.password,
  });

  return {
    message: user.message,
    data: null,
  };
});
