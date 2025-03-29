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

    // Ensure we do not process if it's a full test branch
    if (baseBranch.endsWith("__fullTest")) {
      return {
        message: `Branch '${baseBranch}' is a full test branch. No further action is taken.`,
      };
    }

    const suffix = "_unitTest";
    const newBranch = `${baseBranch}${suffix}`;

    const branchResponse = await provider.createBranch(
      repoFullName,
      baseBranch,
      newBranch
    );

    await provider.processBranchAndFiles(
      branchResponse,
      repoFullName,
      newBranch
    );

    const title = `Add unit tests for branch ${baseBranch}`;
    const body = `This PR introduces unit tests for the changes made in the branch '${baseBranch}'.`;

    // Create the Pull Request
    await provider.createPullRequest(
      repoFullName,
      newBranch,
      baseBranch,
      title,
      body
    );

    return { message: `Branch '${newBranch}' created successfully.` };
  }
}
