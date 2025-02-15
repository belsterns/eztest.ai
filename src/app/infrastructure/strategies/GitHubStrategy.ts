import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GitHubStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    organizationName: string,
    repoName: string,
    repoToken: string,
  ) {
    const url = `${baseUrl}/repos/${organizationName}/${repoName}`;
    const headers = {
      Authorization: `token ${repoToken}`,
      Accept: "application/vnd.github.v3+json",
    };
    const response = await axios.get(url, { headers });
    return response.data;
  }
}
