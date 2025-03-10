import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createUsersWithWorkspacesAndRepositories() {
  try {
    await prisma.users.deleteMany();
    await prisma.workspaces.deleteMany();
    await prisma.user_workspaces.deleteMany();
    await prisma.repositories.deleteMany();

    const userSize = 5;
    const workspaceSize = 2;
    const repositorySize = 3;
    let password = await bcrypt.hash("Password@123", 10);

    console.log("🔄 Seeding users, workspaces, and repositories...");

    const roles = {
      superAdmin: "d8925dae-641b-4744-8d62-7245261285c7",
      workspaceAdmin: "246816b0-7e6c-48d0-86b1-dace2f455c3f",
      workspaceMember: "0542aa8d-990a-4cd5-a59d-e44a1694d5dc",
    };

    for (let i = 0; i < userSize; i++) {
      const roleUuid = i < 2 ? roles.superAdmin : roles.workspaceMember;

      const user = await prisma.users.create({
        data: {
          full_name: `User ${i + 1}`,
          organization_name: `User ${i + 1} Company`,
          email: `user${i + 1}@belsterns.com`,
          password: password,
          org_role_uuid: roleUuid,
        },
      });

      for (let j = 0; j < workspaceSize; j++) {
        const workspace = await prisma.workspaces.create({
          data: {
            name: `Workspace ${i + 1}`,
            description: faker.lorem.sentence(),
          },
        });

        await prisma.user_workspaces.create({
          data: {
            user_uuid: user.uuid,
            workspace_uuid: workspace.uuid,
          },
        });

        for (let k = 0; k < repositorySize; k++) {
          // const repo_url = "https://github.com/anand-belsterns/nodejs-tasks/";

          // const {
          //   hostName,
          //   orgName: organization_name,
          //   repoName: repo_name,
          // } = parseRepoUrl(repo_url);

          const repository = await prisma.repositories.create({
            data: {
              user_uuid: user.uuid,
              workspace_uuid: workspace.uuid,
              host_url: "https://api.github.com",
              repo_url: faker.string.uuid(),
              webhook_uuid: faker.string.uuid(),
              remote_origin: "github",
              organization_name: "anand-belsters",
              repo_name: "nodejs-tasks",
              token: faker.string.uuid(),
            },
          });
        }
      }
    }
    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
