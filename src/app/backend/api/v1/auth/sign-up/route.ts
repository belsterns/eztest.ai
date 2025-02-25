import {
  OnboardingType,
  StaticMessage,
} from "@/app/backend/constants/StaticMessages";
import { AuthController } from "@/app/backend/controllers/auth/auth.controller";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";

const authController = new AuthController();

export const POST = baseInterceptor(async (request, context) => {
  const onboardingType = request.nextUrl.searchParams.get("onboardingType");
  const createdBy = request.nextUrl.searchParams.get("createdBy");

  if (onboardingType?.toLowerCase() === OnboardingType.Invite) {
    if (!createdBy) {
      throw {
        statusCode: 400,
        message: StaticMessage.CreatedByRequired,
        data: null,
      };
    }
  }
  const body = await request.json();

  return await authController.Register(body, onboardingType, createdBy);
});
