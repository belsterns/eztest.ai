import { StaticMessage } from "../../constants/StaticMessages";
import { RoleService } from "../../services/auth/role.service";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  async getRoles() {
    try {
      return {
        message: StaticMessage.RolesFetchedSuccessfully,
        data: await this.roleService.fetchAllRoles(),
      };
    } catch (error) {
      throw error;
    }
  }
}
