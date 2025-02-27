import { IRepoStrategy } from "./IRepoStrategy";
import axios from "axios";

export class GitLabStrategy implements IRepoStrategy {
  async findRepositoryDetails(
    baseUrl: string,
    _organizationName: string,
    repoName: string,
    repoToken: string
  ) {
    try {
      console.log(baseUrl, _organizationName, repoName, repoToken);
      const url = baseUrl ?? process.env.GITLAB_API_BASE_URL;

      const projectPath = await encodeURIComponent(
        `${_organizationName}/${repoName}`
      );

      const myHeaders = new Headers();
      myHeaders.append("PRIVATE-TOKEN", repoToken);

      const requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const searchResponse = await fetch(
        `https://gitlab.com/api/v4/projects/${projectPath}`,
        requestOptions
      );

      return searchResponse.json();
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }
}
