import { AuthValidator } from "../../validator/AuthValidator";
import { AuthService } from "../../services/auth/auth.service";
import {
  OnboardingType,
  OrganizationRoles,
  StaticMessage,
} from "../../constants/StaticMessages";
import { getRoleName } from "../../helpers/userRoleUtils";
import { RoleService } from "../../services/auth/role.service";
import { EmailController } from "../email/email.controller";
import { generatePassword } from "../../helpers/passwordGenerator";
import * as bcrypt from "bcrypt";
import { UserSignUpRequestDto } from "../../infrastructure/dtos/UserSignUpRequestDto";

export class AuthController {
  private authValidator: AuthValidator;
  private authService: AuthService;
  private roleService: RoleService;
  private emailController: EmailController;

  constructor() {
    this.authValidator = new AuthValidator();
    this.authService = new AuthService();
    this.roleService = new RoleService();
    this.emailController = new EmailController();
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

      const { email, password } = body;

      const isUserEmailExist = await this.authService.fetchUserByEmail(email);

      if (isUserEmailExist) {
        throw {
          statusCode: 400,
          message: StaticMessage.UserEmailAlreadyExists,
          data: null,
        };
      }

      let hashPassword;
      let randomPassword;

      if (onboardingType?.toLowerCase() === OnboardingType.SignUp) {
        if (!password) {
          throw {
            statusCode: 400,
            message: StaticMessage.PasswordIsRequired,
            data: null,
          };
        }
        hashPassword = await bcrypt.hash(password, 10);
      } else if (onboardingType?.toLowerCase() === OnboardingType.Invite) {
        randomPassword = generatePassword();
        hashPassword = await bcrypt.hash(randomPassword, 10);
      }

      const updatedBody = {
        ...body,
        password: hashPassword as string,
      };

      const user = await this.authService.saveUserDetails(
        updatedBody,
        roleUuid,
        createdBy
      );

      if (onboardingType?.toLowerCase() === OnboardingType.SignUp) {
        await this.emailController.sendUserCreatedEmail(user);
      } else if (onboardingType?.toLowerCase() === OnboardingType.Invite) {
        await this.emailController.sendUserCreatedEmail(user, randomPassword);
      }

      return {
        message: StaticMessage.SuccessfullyRegister,
        data: null,
      };
    } catch (err: any) {
      throw err;
    }
  }
}
