import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    user_info: {
      uuid: string;
      full_name: string;
      organization_name: string;
      email: string;
      org_role_uuid: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
      role_info: {
        uuid: string;
        name: string;
      };
    };
    auth_info: string;
  }

  interface Session extends DefaultSession {
    user: User;
    data: any;
  }
}
