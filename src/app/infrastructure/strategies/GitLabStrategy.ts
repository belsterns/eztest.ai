import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GitLabStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    _organizationName: string,
    repoName: string,
    repoToken: string
  ) {
    const url = baseUrl ?? process.env.GITLAB_API_BASE_URL;

    const searchResponse = await axios.get(
      `${url}/projects?search=${encodeURIComponent(repoName)}`,
      {
        headers: {
          Authorization: `Bearer ${repoToken}`,
        },
      }
    );

    if (searchResponse.data.length === 0) {
      throw new Error("Repository not found");
    }

    const repo = searchResponse.data[0];

    const repoResponse = await axios.get(`${url}/projects/${repo.id}`, {
      headers: {
        Authorization: `Bearer ${repoToken}`,
      },
    });

    return repoResponse.data;
  }
}
