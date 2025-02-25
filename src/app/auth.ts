import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { StaticMessage } from "./backend/constants/StaticMessages";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import authConfig from "./auth.config";
import { generateJwtToken } from "./backend/helpers/jwt";

class CustomError extends CredentialsSignin {
  code = "Invalid Credentials";
}

interface Credentials {
  email: string;
  password: string;
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const user = await checkUser(credentials as any);
          return user;
        } catch (error) {
          throw new CustomError();
        }
      },
    }),
  ],
});

const checkUser = async ({ email, password }: Credentials) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw {
      statusCode: 404,
      data: null,
      message: StaticMessage.UserEmailNotFound,
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      statusCode: 401,
      data: null,
      message: StaticMessage.InvalidPassword,
    };
  }

  const role = await prisma.org_roles.findUnique({
    where: { uuid: user.org_role_uuid },
  });

  if (!role) {
    throw {
      statusCode: 404,
      data: null,
      message: StaticMessage.RoleNotFound,
    };
  }

  const userInfo = {
    uuid: user.uuid,
    full_name: user.full_name,
    organization_name: user.organization_name,
    email: user.email,
    org_role_uuid: user.org_role_uuid,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role_info: {
      uuid: role.uuid,
      name: role.name,
    },
  };

  // Generate JWT token
  const token = generateJwtToken(userInfo);

  return {
    user_info: userInfo,
    auth_info: token,
  };
};
