import prisma from "@/lib/prisma";
import { decryptToken } from "@/app/backend/utils/cryptoUtils";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { GitProviderFactory } from "../../infrastructure/factory/GitProviderFactory";

export class WebhookService {
  async findRepositoryByWebhookUuid(webhookUuid: string) {
    const repository = await prisma.repositories.findUnique({
      where: {
        webhook_uuid: webhookUuid,
      },
    });

    if (!repository) {
      throw {
        statusCode: 404,
        message: StaticMessage.RepositoryNotFound,
        data: null,
      };
    }
    return repository;
  }

  async processWebhook(
    repoFullName: string,
    baseBranch: string,
    webhookUuid: string
  ) {
    const repository = await this.findRepositoryByWebhookUuid(webhookUuid);
    const repoToken = decryptToken(repository.token);

    const provider = GitProviderFactory.getProvider(
      repository.host_url,
      repoToken
    );

    // Ensure we do not process if it's a full test or unit test branch
    if (baseBranch.endsWith("_fullTest") || baseBranch.endsWith("_unitTest")) {
      return null;
    }

    const suffix = "_unitTest";
    const newBranch = `${baseBranch}${suffix}`;

    let branchResponse = await provider.branchExists(repoFullName, newBranch);

    if (!branchResponse) {
      console.log(`Branch "${newBranch}" does not exist. Creating...`);
      branchResponse = await provider.createBranch(
        repoFullName,
        baseBranch,
        newBranch
      );
    } else {
      console.log(`Branch "${newBranch}" already exists.`);
    }

    await provider.processBranchAndFiles(
      branchResponse,
      repoFullName,
      baseBranch,
      newBranch
    );

    // Create the Pull Request
    await provider.createOrUpdatePullRequest(
      repoFullName,
      baseBranch,
      newBranch
    );

    return { message: `Branch '${newBranch}' created successfully.` };
  }
}
