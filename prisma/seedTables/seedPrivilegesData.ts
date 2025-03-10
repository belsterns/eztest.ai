import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface RolePrivilege {
  [role_name: string]: {
    scope: 'all' | 'org';
    module: {
      org: 'all' | 'r';
      prn: 'all' | 'r';
      act: 'all' | 'r';
      wks: 'all' | 'r';
      app?: 'all' | 'r';
      svr?: 'all' | 'r';
    };
  };
}

export async function seedPrivilegesData(env: string) {
  const rolePrivilegeData: RolePrivilege = JSON.parse(
    fs.readFileSync(`./prisma/seedData/privileges-${env}.json`, 'utf-8')
  );

  const roles = [
    {
      role_name: 'GLOBAL_ADMIN',
      description: 'Global Administrator',
      hierarchy: 1
    },
    {
      role_name: 'GLOBAL_MANAGER',
      description: 'Global Manager',
      hierarchy: 2
    },
    {
      role_name: 'ORG_ADMIN',
      description: 'Organization Admin',
      hierarchy: 3
    },
    {
      role_name: 'ORG_MEMBER',
      description: 'Organization Member',
      hierarchy: 4
    }
  ];

  const scopes = [
    {
      keyword: 'all',
      description: 'Application level',
      score: 0.0
    },
    {
      keyword: 'org',
      description: 'Organization level',
      score: 1.0
    },
    {
      keyword: 'wks',
      description: 'Workspace level',
      score: 2.0
    },
    {
      keyword: 'usr',
      description: 'User level',
      score: 3.0
    }
  ];

  const actions = [
    {
      keyword: 'all',
      description: 'All',
      score: 0.0
    },
    {
      keyword: 'c',
      description: 'Create resource',
      score: 1.0
    },
    {
      keyword: 'd',
      description: 'Delete resource',
      score: 2.0
    },
    {
      keyword: 'u',
      description: 'Update resource',
      score: 3.0
    },
    {
      keyword: 'r',
      description: 'Read resource',
      score: 4.0
    }
  ];

  const modules = [
    {
      module_name: 'Organizations',
      description: 'Organization module',
      keyword: 'org'
    },
    {
      module_name: 'Provisions',
      description: 'Provision module for launch, edit, delete application',
      keyword: 'prn'
    },
    {
      module_name: 'Workspaces',
      description: 'Workspace module',
      keyword: 'wks',
      menu: {
        menu: 'Workspaces',
        sub_menu: [],
        path: '/workspaces',
        icon: 'Workspaces'
      }
    },
    {
      module_name: 'Account',
      description: 'Account module',
      keyword: 'act',
      menu: {
        menu: 'Account',
        sub_menu: [],
        path: '/account',
        icon: 'AccountCircle'
      }
    },
    {
      module_name: 'Applications',
      description: 'Add new application',
      keyword: 'app',
      menu: {
        menu: 'Applications',
        sub_menu: [],
        path: '/applications',
        icon: 'Apps'
      }
    },
    {
      module_name: 'Servers',
      description: 'server related configurations',
      keyword: 'svr',
      menu: { menu: 'Servers', sub_menu: [], path: '/servers', icon: 'Storage' }
    }
  ];

  // SEEDING role TABLE
  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { role_name: role.role_name }
    });

    if (existingRole) {
      await prisma.role.update({
        where: { role_name: existingRole.role_name },
        data: { hierarchy: role.hierarchy, description: role.description }
      });
    } else {
      await prisma.role.create({
        data: {
          role_name: role.role_name,
          description: role.description,
          hierarchy: role.hierarchy
        }
      });
    }
  }

  // SEEDING scope TABLE
  for (const scp of scopes) {
    const existingScope = await prisma.scope.findFirst({
      where: { keyword: scp.keyword }
    });

    if (existingScope) {
      await prisma.scope.update({
        where: { keyword: existingScope.keyword },
        data: { description: scp.description, score: scp.score }
      });
    } else {
      await prisma.scope.create({
        data: {
          keyword: scp.keyword,
          description: scp.description,
          score: scp.score
        }
      });
    }
  }

  // SEEDING module TABLE
  for (const mdl of modules) {
    const existingModule = await prisma.module.findFirst({
      where: { keyword: mdl.keyword }
    });

    if (existingModule) {
      await prisma.module.update({
        where: { keyword: existingModule.keyword },
        data: { module_name: mdl.module_name }
      });
    } else {
      await prisma.module.create({
        data: {
          keyword: mdl.keyword,
          description: mdl.description,
          module_name: mdl.module_name,
          menu: mdl.menu
        }
      });
    }
  }

  // SEEDING action TABLE
  for (const acn of actions) {
    const existingAction = await prisma.action.findFirst({
      where: { keyword: acn.keyword }
    });

    if (existingAction) {
      await prisma.action.update({
        where: { keyword: existingAction.keyword },
        data: { description: acn.description, score: acn.score }
      });
    } else {
      await prisma.action.create({
        data: {
          keyword: acn.keyword,
          description: acn.description,
          score: acn.score
        }
      });
    }
  }

  // SEEDING role_privilege TABLE
  for (const [role_name, role_data] of Object.entries(rolePrivilegeData)) {
    const { scope, module } = role_data;

    // Check if role exists
    const roleExists = await prisma.role.findFirst({ where: { role_name } });
    if (!roleExists) {
      console.log(`Role '${role_name}' does not exist. ending...`);
      break;
    }

    // Check if scope exists
    const scopeExists = await prisma.scope.findFirst({
      where: { keyword: scope }
    });
    if (!scopeExists) {
      console.log(`Scope '${scope}' does not exist. ending...`);
      break;
    }

    for (const [module_keyword, action_keyword] of Object.entries(module)) {
      // Check if module exists
      const moduleExists = await prisma.module.findFirst({
        where: { keyword: module_keyword }
      });
      if (!moduleExists) {
        console.error(`Module '${module_keyword}' does not exist. ending...`);
        break;
      }

      // Check if action exists
      const actionExists = await prisma.action.findFirst({
        where: { keyword: action_keyword }
      });
      if (!actionExists) {
        console.error(`Action '${action_keyword}' does not exist. ending...`);
        break;
      }

      const rolePrivilegeExist = await prisma.role_privilege.findFirst({
        where: {
          role_name,
          module_keyword: module_keyword
        }
      });

      if (rolePrivilegeExist) {
        await prisma.role_privilege.update({
          where: {
            uuid: rolePrivilegeExist.uuid
          },
          data: {
            role_name,
            scope_keyword: scope,
            module_keyword: module_keyword,
            action_keyword: action_keyword
          }
        });
      } else {
        await prisma.role_privilege.create({
          data: {
            role_name,
            scope_keyword: scope,
            module_keyword: module_keyword,
            action_keyword: action_keyword
          }
        });
      }
    }
  }
}
