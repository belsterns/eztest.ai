import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { StaticMessage } from "./backend/constants/StaticMessages";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import authConfig from "./auth.config";
import { generateJwtToken } from "./backend/helpers/jwt";

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
        } catch (error: any) {
          throw new CredentialsSignin(error.message || "Authentication failed");
        }
      },
    }),
  ],
});

const checkUser = async ({ email, password }: Credentials) => {
  if (!email || !password) {
    throw new CredentialsSignin("Email and password are required.");
  }

  const user = await prisma.users.findUnique({
    where: { email, is_active: true },
  });

  if (!user) {
    throw new CredentialsSignin(StaticMessage.UserEmailNotFound);
  }

  if (!user.password) {
    throw new CredentialsSignin("Account does not have a password set.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CredentialsSignin(StaticMessage.InvalidPassword);
  }

  const role = await prisma.org_roles.findUnique({
    where: { uuid: user.org_role_uuid },
  });

  if (!role) {
    throw new CredentialsSignin(StaticMessage.RoleNotFound);
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
