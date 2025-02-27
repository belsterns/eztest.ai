import prisma from "@/lib/prisma";
import { UserSignUpRequestDto } from "../../infrastructure/dtos/UserSignUpRequestDto";

export class AuthService {
  constructor() {}

  async fetchUserByEmail(email: string) {
    try {
      return await prisma.users.findUnique({
        where: {
          email,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  async fetchUserByUserUuid(userUuid: string) {
    try {
      return await prisma.users.findUnique({
        where: {
          uuid: userUuid,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  async saveUserDetails(
    model: UserSignUpRequestDto,
    roleUuid: string,
    createdBy: string | null
  ) {
    try {
      const { email, full_name, organization_name, password } = model;

      return await prisma.users.create({
        data: {
          email,
          full_name,
          organization_name,
          password,
          org_role_uuid: roleUuid,
          created_by: createdBy || null,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
