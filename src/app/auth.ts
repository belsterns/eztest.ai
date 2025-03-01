import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { StaticMessage } from "./backend/constants/StaticMessages";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import authConfig from "./auth.config";
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
    where: {
      email,
    },
  });

  if (!user) {
    throw {
      statusCode: 404,
      data: null,
      message: StaticMessage.UserEmailNotFound,
    };
  }

  if (!user.password) {
    throw {
      statusCode: 404,
      data: null,
      message: StaticMessage.UserEmailNotFound,
    };
  }
  const IsMatchPassword = await bcrypt.compare(password, user.password);
  if (!IsMatchPassword) {
    throw {
      statusCode: 401,
      data: null,
      message: StaticMessage.InvalidPassword,
    };
  }

  const org_role = await prisma.org_roles.findUnique({
    where: {
      uuid: user.org_role_uuid,
    },
  });

  if (!org_role) {
    throw {
      statusCode: 404,
      data: null,
      message: StaticMessage.RoleNotFound,
    };
  }

  const data = {
    email: user.email,
    user_uuid: user.uuid,
    org_name: user.organization_name,
    org_role: org_role.name,
  };
  return data;
};
