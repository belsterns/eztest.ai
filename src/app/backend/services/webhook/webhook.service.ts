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
    console.log("repoFullName : ", repoFullName, "baseBranch : ", baseBranch);

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

    console.log("newBranch : ", newBranch);

    let branchResponse: any;

    // Check if the branch already exists
    branchResponse = await provider.branchExists(repoFullName, newBranch);
    
    if (!branchResponse) {
      branchResponse = await provider.createBranch(repoFullName, baseBranch, newBranch);
      return;
    }
    console.log("branchResponse ===> ", branchResponse);

    await provider.fetchAndPull(repoFullName, baseBranch, newBranch);
    const updatedBranchResponse = await provider.branchExists(repoFullName, newBranch);
    console.log("updatedBranchResponse ===> ", updatedBranchResponse);

    await provider.processBranchAndFiles(
      updatedBranchResponse,
      repoFullName,
      newBranch
    );

    // await provider.pushBranch(repoFullName, newBranch);

    // Create the Pull Request
    await provider.createOrUpdatePullRequest(
      repoFullName,
      newBranch,
      baseBranch
    );

    return { message: `Branch '${newBranch}' created successfully.` };
  }
}
