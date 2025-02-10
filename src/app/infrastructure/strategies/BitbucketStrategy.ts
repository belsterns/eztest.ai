import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class BitbucketStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    workspace: string,
    repoName: string,
    repoToken: string
  ) {
    const url = `${baseUrl}/repositories/${workspace}/${repoName}`;
    const headers = { Authorization: `Bearer ${repoToken}` };
    const response = await axios.get(url, { headers });
    return response.data;
  }
}
