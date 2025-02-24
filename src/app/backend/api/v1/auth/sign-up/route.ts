import { AuthController } from "@/app/backend/controllers/auth/auth.controller";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";

const authController = new AuthController();

export const POST = baseInterceptor(async (request, context) => {
  const onboardingType = request.nextUrl.searchParams.get("onboardingType");
  const createdBy = request.nextUrl.searchParams.get("createdBy");

  const body = await request.json();

  return await authController.SignUp(body, onboardingType, createdBy);
});
