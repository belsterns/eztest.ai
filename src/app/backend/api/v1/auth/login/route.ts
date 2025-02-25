import { AuthController } from "@/app/backend/controllers/auth/auth.controller";
import { baseInterceptor } from "@/app/backend/utils/baseInterceptor";

const authController = new AuthController();

export const POST = baseInterceptor(async (request, context) => {
  const body = await request.json();

  return await authController.LogIn(body);
});
