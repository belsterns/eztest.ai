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
}
