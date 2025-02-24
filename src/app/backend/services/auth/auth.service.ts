import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

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

  async saveUserDetails(model: UserSignUpRequestDto) {
    try {
      const { email, full_name, organization_name, password } = model;

      return await prisma.users.create({
        data: {
          email: email,
          full_name,
          organization_name,
          password: await bcrypt.hash(password, 10),
          org_role_uuid: randomUUID(),
          created_by: "",
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
