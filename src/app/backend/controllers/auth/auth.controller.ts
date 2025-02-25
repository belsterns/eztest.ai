import prisma from "@/lib/prisma";
import { AuthValidator } from "../../validator/AuthValidator";
import { AuthService } from "../../services/auth/auth.service";
import {
  OrganizationRoles,
  StaticMessage,
} from "../../constants/StaticMessages";
import { comparePassword } from "../../helpers/PasswordValidator";
import { getRoleName } from "../../helpers/userRoleUtils";
import { signJwtAccessToken } from "../../helpers/jwt";
import { RoleService } from "../../services/auth/role.service";

export class AuthController {
  private authValidator: AuthValidator;
  private authService: AuthService;
  private roleService: RoleService;

  constructor() {
    this.authValidator = new AuthValidator();
    this.authService = new AuthService();
    this.roleService = new RoleService();
  }

  async Register(
    body: UserSignUpRequestDto,
    onboardingType: string | null,
    createdBy: string | null
  ) {
    try {
      await this.authValidator.SignUp(body);

      if (createdBy) {
        const user = await this.authService.fetchUserByUserUuid(createdBy);

        if (!user) {
          throw {
            statusCode: 400,
            message: StaticMessage.UserNotFound,
            data: null,
          };
        }

        const role = await this.roleService.fetchRoleByRoleUuid(
          user.org_role_uuid
        );

        if (role.name.toLowerCase() !== OrganizationRoles.SuperAdmin) {
          throw {
            statusCode: 400,
            message: StaticMessage.YouNotAllowedToInviteAUser,
            data: null,
          };
        }
      }

      const { uuid: roleUuid } = await this.roleService.fetchRoleByRoleName(
        await getRoleName(onboardingType)
      );

      const { email } = body;

      const isUserEmailExist = await this.authService.fetchUserByEmail(email);

      if (isUserEmailExist) {
        throw {
          statusCode: 400,
          message: StaticMessage.UserEmailAlreadyExists,
          data: null,
        };
      }

      await this.authService.saveUserDetails(body, roleUuid, createdBy);

      return {
        message: StaticMessage.SuccessfullyRegister,
        data: null,
      };
    } catch (err: any) {
      throw err;
    }
  }

  async LogIn(body: UserSignInRequestDto) {
    try {
      await this.authValidator.SignIn(body);

      const { email } = body;

      const isUserEmailExist = await this.authService.fetchUserByEmail(email);

      if (!isUserEmailExist) {
        throw {
          statusCode: 400,
          message: StaticMessage.UserEmailNotFound,
          data: null,
        };
      }

      const user = await prisma.users.findUnique({
        where: {
          email: body.email,
          is_active: true,
        },
        select: {
          uuid: true,
          full_name: true,
          organization_name: true,
          email: true,
          password: true,
          org_role_uuid: true,
          org_role: {
            select: {
              uuid: true,
              name: true,
            },
          },
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        throw {
          statusCode: 404,
          data: null,
          message: StaticMessage.UserNotFound,
        };
      }

      let IsMatchPassword = await comparePassword(
        body.password,
        user.password!
      );

      if (!IsMatchPassword) {
        throw {
          statusCode: 401,
          data: null,
          message: StaticMessage.InvalidPassword,
        };
      }

      const { password, org_role, ...userWithoutPass } = user;
      const accessToken = await signJwtAccessToken(userWithoutPass);

      const result = {
        user_info: { ...userWithoutPass, role_info: org_role },
        auth_info: accessToken,
      };

      return {
        message: StaticMessage.LoginSuccessfully,
        data: result,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
