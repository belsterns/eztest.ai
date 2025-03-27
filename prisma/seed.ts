import { PrismaClient } from "@prisma/client";
import { parseArgs } from "node:util";

import { createUsersWithWorkspacesAndRepositories, createUsersWithWorkspacesAndRepositoriesForProd } from "./seedTables/seedDataToTables";

// npx prisma db seed -- --environment develop
// npx prisma db seed -- --environment prod

const options = {
  environment: { type: "string" },
};

const prisma = new PrismaClient();

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options } as any);

  switch (environment) {
    case "develop":
      await createUsersWithWorkspacesAndRepositories();
      break;
    case "prod":
      await createUsersWithWorkspacesAndRepositoriesForProd();
      break;
    default:
      break;
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
