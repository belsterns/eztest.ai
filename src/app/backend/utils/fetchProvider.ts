import { GitProvider } from "../infrastructure/factory/GitProvider";
import { GitProviderFactory } from "../infrastructure/factory/GitProviderFactory";
import { RepositoryService } from "../services/repositories/repository.service";
import { decryptToken } from "./cryptoUtils";
import { fetchBaseUrl } from "./fetchBaseUrl";
import { parseRepoUrl } from "./parseUrl";

interface FetchProviderResult {
  provider: GitProvider;
  orgName: string;
  repoName: string;
}

export async function fetchProvider(body: any): Promise<FetchProviderResult> {
  const { repo_url } = body;

  const { hostName, orgName, repoName } = parseRepoUrl(repo_url);

  const repositoryService = new RepositoryService();
  const repository =
    await repositoryService.fetchRepositoryByRepoName(repoName);

  const baseUrl = fetchBaseUrl(hostName);

  const provider = GitProviderFactory.getProvider(
    baseUrl,
    decryptToken(repository.token)
  );

  return { provider, orgName, repoName };
}
