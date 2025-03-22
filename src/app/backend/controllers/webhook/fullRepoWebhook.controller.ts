import { NextResponse } from "next/server";
import { fetchProvider } from "../../utils/fetchProvider";
import { RepositoryService } from "../../services/repositories/repository.service";

export class FullRepoWebhookController {
  private repositoryService: RepositoryService;

  constructor() {
    this.repositoryService = new RepositoryService();
  }

  async handleFullRepoTestInitialization(
    userUuid: string,
    repoUuid: string,
    body: any
  ) {
    try {
      await this.repositoryService.fetchRepoDetailsByUuid(repoUuid);

      const {
        provider,
        orgName: organization_name,
        repoName: repo_name,
      } = await fetchProvider(body);

      const repoFullName = `${organization_name}/${repo_name}`;
      const baseBranch = body.baseBranch || "main";

      if (!repoFullName) {
        return NextResponse.json(
          { message: "Repository name is required" },
          { status: 400 }
        );
      }

      return await provider.processFullRepo(
        userUuid,
        repoUuid,
        repoFullName,
        baseBranch
      );
    } catch (error: any) {
      throw error;
    }
  }
}
