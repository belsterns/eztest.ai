import { StaticMessage } from "../../constants/StaticMessages";
import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GiteaStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    owner: string,
    repoName: string,
    repoToken: string
  ) {
    try {
      const url = `${baseUrl}/repos/${owner}/${repoName}`;
      const headers = { Authorization: `token ${repoToken}` };
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error: any) {
      if (error.response.status === 401) {
        throw {
          message: StaticMessage.InvalidToken,
          data: null,
          statusCode: error.response.status,
        };
      }

      if (error.response.status === 404) {
        throw {
          message: StaticMessage.InvalidRepositoryUrl,
          data: null,
          statusCode: error.response.status,
        };
      }

      throw error;
    }
  }
}
