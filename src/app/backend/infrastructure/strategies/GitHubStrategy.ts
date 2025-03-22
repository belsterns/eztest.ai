import { StaticMessage } from "../../constants/StaticMessages";
import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GitHubStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    organizationName: string,
    repoName: string,
    repoToken: string
  ) {
    try {
      const url = `${baseUrl}/repos/${organizationName}/${repoName}`;
      const headers = {
        Authorization: `token ${repoToken}`,
        Accept: "application/vnd.github.v3+json",
      };
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
