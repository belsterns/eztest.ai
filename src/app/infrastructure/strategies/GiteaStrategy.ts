import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GiteaStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    owner: string,
    repoName: string,
    repoToken: string
  ) {
    const url = `${baseUrl}/repos/${owner}/${repoName}`;
    const headers = { Authorization: `token ${repoToken}` };
    const response = await axios.get(url, { headers });
    return response.data;
  }
}
